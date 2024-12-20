from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import os
import groq
import requests
import json
import time
import base64
from urllib.parse import quote
import fal_client
import tempfile
from PIL import Image
from io import BytesIO
from roboflow import Roboflow
from requests.exceptions import HTTPError
import numpy as np

class ProcessStyleView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        style_description = request.data.get("style_description", "")
        image_file = request.FILES.get("image")
        
        if not style_description or not image_file:
            return Response(
                {"error": "Both style_description and image are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            self.predictions = self.apply_object_detection(image_file)
            print("\n=== Object Detection Predictions ===")
            print(json.dumps(self.predictions, indent=2))
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        temp_file_path = None
        try:
            # First, optimize the user's query using Llama
            groq_api_key = os.getenv('GROQ_API_KEY')
            if not groq_api_key:
                return Response(
                    {"error": "GROQ_API_KEY not configured"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            client = groq.Groq(api_key=groq_api_key)

            # Prepare the prompt for query optimization
            query_prompt = f"""Convert this clothing modification request into a clear, concise instruction focused only on the desired change. Remove any unnecessary words or pleasantries.

User's request: "{style_description}"

Output only the optimized instruction in a single line. For example:
Input: "hi can you please make this coat navy blue color thanks"
Output: make the coat navy blue

Your optimized instruction:"""

            # Get optimized query from Llama
            chat_completion = client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": query_prompt
                }],
                model="llama-3.1-70b-versatile",
                temperature=0.1,
                max_tokens=50,
            )

            # Get the optimized query
            optimized_query = chat_completion.choices[0].message.content.strip()
            print("\n=== Original Query ===")
            print(style_description)
            print("\n=== Optimized Query ===")
            print(optimized_query)

            # Save uploaded image temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name

            # Get input image dimensions
            with Image.open(temp_file_path) as img:
                width, height = img.size

            # Initialize FAL.ai client
            fal_api_key = os.getenv('FAL_KEY')
            if not fal_api_key:
                return Response(
                    {"error": "FAL_KEY not configured"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            os.environ["FAL_KEY"] = fal_api_key

            print("\n=== Starting FAL.ai image transformation ===")
            # Upload image to FAL.ai
            url = fal_client.upload_file(temp_file_path)
            
            def on_queue_update(update):
                if isinstance(update, fal_client.InProgress):
                    for log in update.logs:
                        print(log["message"])

            # Transform image using FAL.ai with optimized query
            result = fal_client.subscribe(
                "fal-ai/flux-pro/v1/canny",
                arguments={
                    "control_image_url": url,
                    "prompt": optimized_query
                },
                with_logs=True,
                on_queue_update=on_queue_update,
            )
            
            print("\n=== FAL.ai transformation complete ===")
            print("FAL.ai response:", result)  # Debug print
            
            # Handle the FAL.ai response
            if isinstance(result, dict):
                if 'images' in result and isinstance(result['images'], list) and result['images']:
                    # Get the URL from the first image
                    transformed_image_url = result['images'][0].get('url')
                    if not transformed_image_url:
                        raise ValueError("No image URL in the response")
                else:
                    print("Unexpected result structure:", result)
                    raise ValueError(f"Unexpected response format from FAL.ai: {result}")
            else:
                print("Result is not a dict:", type(result), result)
                raise ValueError(f"Unexpected response type from FAL.ai: {type(result)}")

            # Initialize Groq client for style advice
            groq_api_key = os.getenv('GROQ_API_KEY')
            if not groq_api_key:
                return Response(
                    {"error": "GROQ_API_KEY not configured"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            client = groq.Groq(api_key=groq_api_key)

            # Prepare the prompt
            prompt = f"""Given this style description: "{style_description}"
            Provide fashion advice and specific clothing recommendations. Format your response as JSON with these fields:
            - overall_style: Brief summary of the suggested style
            - key_pieces: List of 3-5 essential clothing items
            - styling_tips: 2-3 practical styling suggestions
            - color_palette: 2-4 recommended colors that work well together
            """

            # Call Groq API
            chat_completion = client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=1000,
            )

            # Get the style advice
            style_advice = chat_completion.choices[0].message.content

            print("\n=== Style Advice from LLM ===")
            print(style_advice)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name
                
            matched_objects = [
                obj for obj in self.predictions.get('predictions', [])
                if any(keyword.lower() in style_description.lower() for keyword in obj['class'].split())
            ]

            if matched_objects:
                print("\n=== Matched Objects ===")
                print(matched_objects)

                # Crop the image based on the first matched object's bounding box
                matched_object = matched_objects[0]
                x, y, width, height = (
                    matched_object['x'], 
                    matched_object['y'], 
                    matched_object['width'], 
                    matched_object['height']
                )

                # Open the original image and crop
                with Image.open(temp_file_path) as img:
                    left = max(0, int(x - width / 2))
                    upper = max(0, int(y - height / 2))
                    right = min(img.width, int(x + width / 2))
                    lower = min(img.height, int(y + height / 2))
                    cropped_image = img.crop((left, upper, right, lower))

                    # Save the cropped image temporarily
                    cropped_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
                    cropped_image.save(cropped_temp_file.name)
                    cropped_image_path = cropped_temp_file.name

                    # Get product recommendations using the cropped image
                    product_results = self.get_product_recommendations_from_image(cropped_image_path)

                    # Clean up the cropped image file
                    os.unlink(cropped_image_path)
            else:
                print("\n=== No Matched Objects ===")
                # Use the whole transformed image if no matches are found
                product_results = self.get_product_recommendations_from_image(transformed_image_url)
                    
            print("\n=== Final Product Results ===")
            print(json.dumps(product_results, indent=2))

            # Clean up original temporary file
            if temp_file_path:
                os.unlink(temp_file_path)

            return Response({
                "style_advice": style_advice,
                "original_description": style_description,
                "transformed_image_url": transformed_image_url,
                "product_results": product_results
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"\n=== Error in main process ===\n{str(e)}")
            # Clean up temporary files
            if temp_file_path and os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_product_recommendations_from_image(self, image_url):
        try:
            serp_api_key = os.getenv('SERP_API_KEY')
            if not serp_api_key:
                raise Exception("SERP_API_KEY not configured")

            print("\n=== Starting Google Lens API request ===")
            api_url = "https://serpapi.webscrapingapi.com/v2"
            
            print(f"Using image URL: {image_url}")
            print(f"API endpoint: {api_url}")
            
            print("Making API request to Google Lens...")
            response = requests.get(
                api_url,
                params={
                    "engine": "google_reverse_image",
                    "api_key": serp_api_key,
                    "url": image_url,
                    "hl": "en",
                },
                timeout=30
            )

            print(f"Response Status: {response.status_code}")
            
            results = []  # Initialize results to avoid undefined variable error
            
            if response.status_code == 200:
                data = response.json()

                # Check for images in the response
                images = data.get('images', [])
                if images:
                    print(f"Found {len(images)} image results")
                    # Filter for items with USD prices and limit to 30 results
                    filtered_results = []
                    for item in images:
                        price = item.get('price', '')
                        # Check if price exists and is in USD
                        if price and price.startswith('$'):
                            try:
                                # Remove '$' and any '*' and convert to float to verify it's a valid price
                                price_value = float(price.replace('$', '').replace('*', '').strip())
                                result = {
                                    'title': item.get('title', ''),
                                    'link': item.get('link', ''),
                                    'image': item.get('image_url', ''),
                                    'price': f"${price_value:.2f}",
                                    'source': item.get('source', '')
                                }
                                filtered_results.append(result)
                                # Break if we have 30 results
                                if len(filtered_results) >= 30:
                                    break
                            except ValueError:
                                # Skip if price can't be converted to float
                                continue
                    
                    results = filtered_results
                    print(f"Filtered to {len(results)} USD-priced results")
                else:
                    print("No matching results found")
                    print("Available data:", json.dumps(data, indent=2))
                
                print(f"=== Final Results Count: {len(results)} ===")
                return results
            else:
                print(f"API request failed with status code: {response.status_code}")
                return []

        except Exception as e:
            print(f"Error in get_product_recommendations_from_image: {str(e)}")
            return []
    
    def apply_object_detection(self, image_file):
        """
        Process the uploaded image for object detection.
        """
        # Convert the uploaded file into a format Roboflow API can use
        api_key = os.getenv('ROBOFLOW_API_KEY')
        if not api_key:
            raise ValueError("ROBOFLOW_API_KEY not configured")
        
        rf = Roboflow(api_key)
        project = rf.workspace().project("clothing-detection-s4ioc")
        model = project.version(6).model

        try:
            # Save the image temporarily or use an in-memory buffer
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name

            # Call the Roboflow model for predictions
            prediction = model.predict(temp_file_path, confidence=40, overlap=30).json()


            # Clean up the temporary file
            os.unlink(temp_file_path)
            
            return prediction

        except HTTPError as e:
            print(f"An error occurred during object detection: {e}")
            raise

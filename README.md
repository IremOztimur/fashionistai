# FastionistAI 
## AI-Powevered Fashion Discovery & Transformation Platform

Upload any clothing image, visualize  style changes instantly with AI, and find exact product matches through advanced reverse image search. See a pice you love but want it in white? We'll show you how it looks AND where to buy it!

https://github.com/user-attachments/assets/c26e1c2a-acbe-4d37-bf80-91162b65ed2a


## Project Overview
FashionistAI solves two biggest problems in online fashion shopping: _"How would this look in a different style?" and "Where can I find this exact piece?"_

By combining AI image transformation with powerful reverse image search, we create a seamless journey from inspiration to purchase.

### Features
- *__Style Description Processing:__* Parses user-provided text instructions for clothing modifications.
- *__Image Upload Handling:__* Accepts and processes image files for object detection and AI transformations.
- *__AI-Driven Image Transformation:__* Generates modified images based on style descriptions using FAL.ai.
- *__Object Detection:__* Identifies specific clothing items in images with Roboflow.
- *__Fashion Recommendations:__* Provides AI-generated styling advice.
- *__Reverse Image Search:__* Finds shopping results for segmented or transformed images using SerpAPI.

## How to Run Locally

### 1. Prerequisites
Ensure you have the following installed:

- Python 3.8+
- pip (Python package manager)
- Django Rest Framework
- Environment variables for API keys (see below).

### 2. Clone the Repository
```bash
git clone <repository-url>  
cd fashionistaai-backend  
```

### 3. Set Up Environment Variables
The backend relies on external services. Add the following environment variables to a .env file:

* GROQ_API_KEY: For Groq API (query optimization and fashion advice).
* FAL_KEY: For FAL.ai API (image transformation).
* ROBOFLOW_API_KEY: For Roboflow API (object detection).
* SERP_API_KEY: For Google Lens reverse image search.

### 4. Install Dependencies
```bash
make setup-backend
```

### 5. Run the Project
Start Frontend Server:
```bash
make run-frontend
```
Start Backend Server:
```bash
make run-backend
```

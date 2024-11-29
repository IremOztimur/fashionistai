from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser

class ProcessStyleView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        style_description = request.data.get("style_description", "")
        predefined_style = request.data.get("predefined_style", "")

        return Response({
            "message": "Style processed successfully!",
            "received_description": style_description,
            "received_predefined_style": predefined_style,
        }, status=status.HTTP_200_OK)

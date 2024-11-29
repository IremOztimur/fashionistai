from django.urls import path
from .views import ProcessStyleView

urlpatterns = [
    path('process-style/', ProcessStyleView.as_view(), name='process-style'),
]

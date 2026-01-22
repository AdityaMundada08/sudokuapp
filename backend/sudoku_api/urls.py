from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('generate/', views.generate_puzzle, name='generate_puzzle'),
    path('verify/', views.verify_solution, name='verify_solution'),
]
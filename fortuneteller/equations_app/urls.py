from django.urls import path
from . import views

app_name = 'equations_app'

urlpatterns = [
    path('', views.index, name='index'),
]

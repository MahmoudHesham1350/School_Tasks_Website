from django.urls import path
from . import views

urlpatterns = [
    path('teacher/', views.teacherDashboard, name='teacher_dashboard'),
    path('admin/', views.adminDashboard, name='admin_dashboard'),
]
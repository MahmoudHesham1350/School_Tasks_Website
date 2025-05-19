from django.urls import path
from . import views


urlpatterns = [
    path('', views.tasks, name='tasks'),
    path('create/', views.create_task, name='create_task'),
    path('<int:task_id>/', views.task_detail, name='task_detail'),
    path('<int:task_id>/update/', views.update_task, name='update_task'),
    path('<int:task_id>/delete/', views.delete_task, name='delete_task'),
    path('task/<int:task_id>/complete/', views.complete_task, name='complete_task'),
]
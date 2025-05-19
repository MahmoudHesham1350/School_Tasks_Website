from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from datetime import date
from users.models import User
from .models import Task, Assigned

class TaskModelTest(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='adminpass123',
            role='admin'
        )
        self.teacher_user = User.objects.create_user(
            email='teacher@example.com',
            username='teacher',
            password='teacherpass123',
            role='teacher'
        )
        self.task = Task.objects.create(
            creator=self.admin_user,
            title='Test Task',
            subject='Mathematics',
            priority='high',
            description='Test description',
            due_date=date(2025, 12, 31)
        )
        self.assignment = Assigned.objects.create(
            task=self.task,
            teacher=self.teacher_user
        )

    def test_task_creation(self):
        self.assertTrue(isinstance(self.task, Task))
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.creator, self.admin_user)
        self.assertEqual(self.task.priority, 'high')

    def test_assigned_creation(self):
        self.assertTrue(isinstance(self.assignment, Assigned))
        self.assertEqual(self.assignment.task, self.task)
        self.assertEqual(self.assignment.teacher, self.teacher_user)
        self.assertFalse(self.assignment.is_completed)
        self.assertIsNone(self.assignment.completed_at)

class TaskViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='adminpass123',
            role='admin'
        )
        self.teacher_user = User.objects.create_user(
            email='teacher@example.com',
            username='teacher',
            password='teacherpass123',
            role='teacher'
        )
        self.task = Task.objects.create(
            creator=self.admin_user,
            title='Test Task',
            subject='Mathematics',
            priority='high',
            description='Test description',
            due_date=date(2025, 12, 31)
        )
        self.assignment = Assigned.objects.create(
            task=self.task,
            teacher=self.teacher_user
        )

    def test_home_view_unauthenticated(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['recent_tasks']), 0)

    def test_home_view_admin(self):
        self.client.login(username='admin@example.com', password='adminpass123')
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['recent_tasks']), 1)

    def test_home_view_teacher(self):
        self.client.login(username='teacher@example.com', password='teacherpass123')
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['recent_tasks']), 1)

    def test_assignment_completion(self):
        self.client.login(username='teacher@example.com', password='teacherpass123')
        self.assignment.is_completed = True
        self.assignment.completed_at = timezone.now()
        self.assignment.save()
        
        self.assertTrue(self.assignment.is_completed)
        self.assertIsNotNone(self.assignment.completed_at)

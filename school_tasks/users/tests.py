from django.test import TestCase, Client
from django.urls import reverse
from .models import User
from .forms import UserLoginForm, UserRegistrationForm

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123',
            role='admin'
        )

    def test_user_creation(self):
        self.assertTrue(isinstance(self.user, User))
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.role, 'admin')

class UserViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123',
            role='admin'
        )
        self.login_url = reverse('login')
        self.signup_url = reverse('signup')
        self.home_url = reverse('home')

    def test_login_view_GET(self):
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'users/login.html')

    def test_login_view_POST_success(self):
        response = self.client.post(self.login_url, {
            'email': 'test@example.com',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.home_url)

    def test_login_view_POST_invalid(self):
        response = self.client.post(self.login_url, {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'users/login.html')

    def test_signup_view_GET(self):
        response = self.client.get(self.signup_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'users/signup.html')

    def test_signup_view_POST_success(self):
        response = self.client.post(self.signup_url, {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password1': 'newpassword123',
            'password2': 'newpassword123',
            'role': 'teacher'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(User.objects.filter(email='newuser@example.com').exists())
        self.assertRedirects(response, self.home_url)

    def test_logout_view(self):
        self.client.login(username='test@example.com', password='testpassword123')
        response = self.client.get(reverse('logout'))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.home_url)

class UserFormsTest(TestCase):
    def test_login_form_valid(self):
        form_data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        form = UserLoginForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_registration_form_valid(self):
        form_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'role': 'teacher'
        }
        form = UserRegistrationForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_registration_form_passwords_dont_match(self):
        form_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'differentpassword',
            'role': 'teacher'
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())

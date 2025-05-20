# School Tasks Management System

A Django-based web application for managing school tasks and assignments between administrators and teachers.

## Features

- Custom user authentication system with email-based login
- Role-based access control (Admin and Teacher roles)
- Task management system with:
  - Title, subject, and priority levels
  - File attachments support
  - Due date tracking
  - Task assignment system
- Separate dashboards for:
  - Administrators: Create and manage tasks
  - Teachers: View and manage assigned tasks
- Modern UI with responsive design

## Technical Stack

- Python 3.12+
- Django 5.2.1
- SQLite3 (Database)
- HTML/CSS/JavaScript (Frontend)
- uv (Fast Python package installer and runner)

## Project Structure

```
school_tasks/
├── dashboards/         # Dashboard views and templates
├── tasks/             # Task management functionality
├── users/            # Custom user authentication
├── static/          # Static files (CSS, JS, Images)
├── media/          # User uploaded files
└── templates/     # Base templates
```

## Installation

For uv installation and setup instructions, visit the [official uv documentation](https://docs.astral.sh/uv/getting-started/installation/).

1. Clone the repository:
```bash
git clone https://github.com/MahmoudHesham1350/School_Tasks_Website.git
cd school_backend
```

2. Apply database migrations:
```bash
uv run manage.py migrate
```

3. Create a superuser:
```bash
uv run manage.py createsuperuser
```

4. Run the development server:
```bash
uv run manage.py runserver
```

The application will be available at `http://localhost:8000`

## Usage

### Admin Users
- Can create new tasks
- Assign tasks to teachers
- Monitor task completion status
- Access the admin dashboard

### Teacher Users
- View assigned tasks
- Mark tasks as completed
- Upload task-related files
- Access the teacher dashboard

## Project Structure Details

### Apps

1. **Users App**
   - Custom user model with email authentication
   - Role-based access control (Admin/Teacher)

2. **Tasks App**
   - Task creation and management
   - Assignment system
   - File upload functionality

3. **Dashboards App**
   - Role-specific dashboards
   - Task overview and management interfaces

## Security Features

- Custom user authentication
- CSRF protection
- Secure file upload handling
- Role-based access control
- Login required decorators for protected views
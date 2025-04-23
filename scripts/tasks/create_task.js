document.addEventListener('DOMContentLoaded', () => {
  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '../auth/login.html';
    return;
  }

  // Get data from localStorage
  const usersJSON = localStorage.getItem('users');
  if (!usersJSON) {
    document.querySelector("form").innerHTML = "<p>No user data available. Please contact administrator.</p>";
    return;
  }

  const users = JSON.parse(usersJSON);
  populateStudentSelect(users);

  document.getElementById('create-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = e.target;
    const newTask = {
      id: Date.now(), // Use timestamp as unique ID
      title: form.title.value,
      description: form.description.value,
      assigned_to: parseInt(form.student.value),
      assigned_by: currentUser.id,
      due_date: form.due_date.value,
      priority: form.priority.value,
      status: 'pending',
      subject: form.subject.value
    };

    // Get existing tasks or initialize empty array
    const tasksJSON = localStorage.getItem('tasks');
    const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
    
    // Add new task
    tasks.push(newTask);
    
    // Save back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Redirect to task list
    window.location.href = 'task_list.html';
  });
});

function populateStudentSelect(users) {
  const studentSelect = document.getElementById('student');
  const students = users.filter(user => user.userType === 'student');
  
  students.forEach(student => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = student.name;
    studentSelect.appendChild(option);
  });
}
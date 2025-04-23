document.addEventListener('DOMContentLoaded', () => {
  const taskId = new URLSearchParams(window.location.search).get('taskId');
  if (!taskId) {
    window.location.href = 'task_list.html';
    return;
  }

  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '../auth/login.html';
    return;
  }

  // Get data from localStorage
  const usersJSON = localStorage.getItem('users');
  const tasksJSON = localStorage.getItem('tasks');
  
  if (!usersJSON || !tasksJSON) {
    document.querySelector(".task-details").innerHTML = "<p>No data available. Please contact administrator.</p>";
    return;
  }

  const data = {
    users: JSON.parse(usersJSON),
    tasks: JSON.parse(tasksJSON)
  };

  const task = data.tasks.find(t => t.id === parseInt(taskId));
  if (!task) {
    document.querySelector(".task-details").innerHTML = "<p>Task not found.</p>";
    return;
  }

  displayTaskDetails(task, data.users);
});

function displayTaskDetails(task, users) {
  const taskDetailsContainer = document.querySelector('.task-details');
  taskDetailsContainer.innerHTML = `
    <h2>${task.title}</h2>
    <p>${task.description}</p>
    <p>Assigned to: ${getUserName(task.assignedTo, users)}</p>
    <p>Status: ${task.status}</p>
  `;
}

function getUserName(userId, users) {
  const user = users.find(u => u.id === userId);
  return user ? user.name : 'Unknown';
}
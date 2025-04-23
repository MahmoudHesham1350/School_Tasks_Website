const AUTHOR_ID = new URLSearchParams(window.location.search).get('authorId');

document.addEventListener('DOMContentLoaded', () => {
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
    document.querySelector(".task-list").innerHTML = "<p>No data available. Please contact administrator.</p>";
    return;
  }

  const data = {
    users: JSON.parse(usersJSON),
    tasks: JSON.parse(tasksJSON)
  };

  displayTasks(data, currentUser);
});

function getUserByID(id, users) {
  return users.find(user => user.id === id);
}

function viewTaskDetails(taskID){
  window.location.href = `${URL}pages/tasks/Task_Details.html?taskId=${taskID}`;
}

function createTaskCard(task, users){
  const item = document.createElement("div");
  item.className = "task_card";
  const created_by = getUserByID(task.assigned_by, users)?.name || 'Unknown';
  item.addEventListener('click', () => viewTaskDetails(task.id));

  item.innerHTML = `
      <div class="title">
          <h3>${task.title}</h3>
      </div>
      <div class="card_details">
          <div class="description">
              <p>${task.description}</p>
          </div>
          <div class="card_footer">
              <div class="due_date">Due: ${task.due_date}</div>
              <div class="created_by">By: ${created_by}</div>
          </div>
      </div>`;

    return item;
}

function displayTasks(data, currentUser) {
  const tasks = data.tasks;
  const users = data.users;
  const list = document.getElementById("tasks-list");

  console.log(AUTHOR_ID);
  
  tasks.forEach(task => {
    if(AUTHOR_ID !== null && task.assigned_by != AUTHOR_ID) return;
    const item = createTaskCard(task, users)
    list.appendChild(item);
  });
}

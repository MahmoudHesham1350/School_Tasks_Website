document.addEventListener('DOMContentLoaded', () => {
  const TASK_ID = new URLSearchParams(window.location.search).get('taskId');
  const database = new Database();

  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '/pages/login.html';
    return;
  }

  if (!TASK_ID) {
    window.location.href = '/pages/404.html';
    return;
  }

  const task = database.getTaskByID(TASK_ID);

  if (!task) {
    window.location.href = '/pages/404.html';
    return;
  }

  displayTaskDetails(task);
});


function displayTaskDetails(task) {
  const taskDetailsContainer = document.querySelector(".task-container");
  
  // Create attachments HTML
  const attachmentsHTML = task.Attachment.length > 0 
    ? task.Attachment.map(file => `
        <div class="attachment">
            📄 <a href="#">${file.name}</a>
        </div>
    `).join('')
    : '<div class="attachment">No attachments</div>';

  taskDetailsContainer.innerHTML = `
    <h2 class="task-title">${task.title}</h2>
    <p><strong>Author:</strong> ${task.assigned_by}</p>
    <div class="task-details">
        <p><strong>Description:</strong></p>
        <p class="description">
            ${task.description}
        </p>

        <p><strong>Subject:</strong> ${task.subject}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Status:</strong> ${task.status}</p>

        <p><strong>Attachments:</strong></p>
        <div class="attachments">
            ${attachmentsHTML}
        </div>

        <p><strong>Created Date:</strong> ${task.createdAt}</p>
        <p><strong>Due Date:</strong> ${task.due_date}</p>
    </div>

    <div class="buttons">
        <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
    </div>
  `;
}

function editTask(taskId) {
    window.location.href = "/pages/tasks/taskCreate.html" + `?taskId=${taskId}`;
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const database = new Database();
        database.deleteTask(taskId);
        window.location.href = "/pages/tasks/taskList.html";
    }
}

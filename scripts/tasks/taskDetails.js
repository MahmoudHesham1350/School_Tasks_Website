document.addEventListener('DOMContentLoaded', () => {
  const TASK_ID = new URLSearchParams(window.location.search).get('taskId');
  const database = new Database();

  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '/pages/auth/login.html';
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

  displayTaskDetails(task, currentUser);
});

function displayTaskDetails(task, currentUser) {
  const taskDetailsContainer = document.querySelector(".task-container");
  
  // Create attachments HTML
  const attachmentsHTML = task.Attachment && task.Attachment.length > 0 
    ? task.Attachment.map(file => `
        <div class="attachment">
            📄 <a href="#">${file.name}</a>
        </div>
    `).join('')
    : '<div class="attachment">No attachments</div>';

  // Check if the current teacher has completed this task
  const isCompleted = task.completed_by && task.completed_by.includes(currentUser.username);
  
  // Get completion status text
  let completionStatus = '';
  if (task.completed_by && task.completed_by.length > 0) {
    completionStatus = `
      <div class="completion-status">
        <p><strong>Completed by:</strong></p>
        <ul>
          ${task.completed_by.map(teacher => `<li>${teacher}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  taskDetailsContainer.innerHTML = `
    <h2 class="task-title">${task.title}</h2>
    <div class="task-meta">
      <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
      <span class="status-badge">${isCompleted ? 'Completed' : 'Pending'}</span>
    </div>
    <p><strong>Created by:</strong> ${task.assigned_by}</p>
    <div class="task-details">
        <p><strong>Description:</strong></p>
        <p class="description">
            ${task.description}
        </p>

        <p><strong>Subject:</strong> ${task.subject}</p>
        
        ${task.assigned_to === 'all' 
          ? '<p><strong>Assigned to:</strong> All Teachers</p>'
          : `<p><strong>Assigned to:</strong> ${Array.isArray(task.assigned_to) ? task.assigned_to.join(', ') : task.assigned_to}</p>`
        }

        <p><strong>Attachments:</strong></p>
        <div class="attachments">
            ${attachmentsHTML}
        </div>

        <p><strong>Created Date:</strong> ${task.createdAt}</p>
        <p><strong>Due Date:</strong> ${task.due_date}</p>

        ${completionStatus}
    </div>

    <div class="buttons">
      ${getActionButtons(task, currentUser, isCompleted)}
    </div>
  `;

  // Add event listeners after rendering
  addButtonEventListeners(task, currentUser);
}

function getActionButtons(task, currentUser, isCompleted) {
  if (currentUser.role === 'admin') {
    return `
      <button class="edit-btn" data-task-id="${task.id}">Edit</button>
      <button class="delete-btn" data-task-id="${task.id}">Delete</button>
    `;
  } else if (currentUser.role === 'teacher') {
    // Check if the task is assigned to this teacher or all teachers
    const isAssigned = task.assigned_to === 'all' || 
      (Array.isArray(task.assigned_to) && task.assigned_to.includes(currentUser.username));
    
    if (isAssigned) {
      return `
        <button class="complete-btn ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
          ${isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
      `;
    }
  }
  return ''; // No buttons for unauthorized users
}

function addButtonEventListeners(task, currentUser) {
  if (currentUser.role === 'admin') {
    // Add edit button listener
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => editTask(task.id));
    }

    // Add delete button listener
    const deleteBtn = document.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => deleteTask(task.id));
    }
  } else if (currentUser.role === 'teacher') {
    // Add complete button listener
    const completeBtn = document.querySelector('.complete-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id, currentUser.username));
    }
  }
}

function editTask(taskId) {
  window.location.href = "/pages/tasks/taskCreate.html" + `?taskId=${taskId}`;
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    const database = new Database();
    database.deleteTask(taskId);
    window.location.href = "/pages/dashboard/adminDashboard.html";
  }
}

function toggleTaskCompletion(taskId, teacherUsername) {
  const database = new Database();
  const task = database.getTaskByID(taskId);
  
  if (!task) return;
  
  if (!task.completed_by) {
    task.completed_by = [];
  }
  
  const completionIndex = task.completed_by.indexOf(teacherUsername);
  if (completionIndex === -1) {
    // Mark as completed
    task.completed_by.push(teacherUsername);
  } else {
    // Mark as incomplete
    task.completed_by.splice(completionIndex, 1);
  }
  
  // Update task in database
  database.updateTask(task);
  
  // Refresh the page to show updated status
  location.reload();
}

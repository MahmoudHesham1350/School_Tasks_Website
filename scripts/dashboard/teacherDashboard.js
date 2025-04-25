document.addEventListener("DOMContentLoaded", function () {
  // Get current teacher from session storage
  const currentTeacher = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentTeacher) {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  // Get data from localStorage
  const database = new Database();
  
  if (!database.users || !database.tasks || database.users.length === 0) {
    document.querySelector(".container").innerHTML += 
      "<p class='error-message'>No data available. Please contact administrator.</p>";
    return;
  }

  displayTeacherData(currentTeacher);
  displayTeacherTasks(database.tasks, currentTeacher.username);
});

function displayTeacherData(teacher) {
  // Update profile information
  const profileName = document.querySelector(".profile-name");
  const profileBio = document.querySelector(".profile-bio");
  
  if (profileName) profileName.textContent = teacher.username || "Teacher";
  if (profileBio) profileBio.textContent = teacher.role || "Teacher";
}

function displayTeacherTasks(tasks, teacherUsername) {
  // Find task list container
  const taskListContainer = document.querySelector(".task_list");
  
  // If no container exists, exit the function
  if (!taskListContainer) return;
  
  // Clear existing content
  taskListContainer.innerHTML = "";

  // Filter tasks created by the current teacher
  const teacherTasks = tasks.filter(task => task.assigned_by === teacherUsername);

  // Check if there are any tasks
  if (!teacherTasks || teacherTasks.length === 0) {
    taskListContainer.innerHTML = `
      <div class="no-tasks-message">
        <p>You haven't created any tasks yet. Click "Create New Task" to get started!</p>
      </div>
    `;
    return;
  }

  // Display each task
  teacherTasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task_card";
    
    // Add status-based class if status is available
    if (task.status) {
      taskCard.classList.add(`status-${task.status.replace(/\s+/g, "-").toLowerCase()}`);
    }

    // Set priority class if available
    const priorityClass = task.priority ? task.priority.toLowerCase() : '';

    taskCard.innerHTML = `
      <div class="title">
        <h3>${task.title || "Untitled Task"}</h3>
        ${task.priority ? `<span class="priority-badge ${priorityClass}">${task.priority}</span>` : ''}
      </div>
      <div class="card_details">
        <div class="description">
          <p>${task.description || "No description provided."}</p>
        </div>
        ${task.subject ? `
        <div class="task-meta">
          <p><strong>Subject:</strong> ${task.subject}</p>
          ${task.status ? `<p><strong>Status:</strong> ${task.status}</p>` : ''}
        </div>
        ` : ''}
        <div class="card_footer">
          <div class="due_date">Due: ${task.due_date || "No deadline"}</div>
          <div class="assigned_to">${task.assigned_to ? `To: ${task.assigned_to}` : 'To: All Students'}</div>
        </div>
      </div>
    `;

    // Add click handler to view task details
    taskCard.addEventListener('click', () => {
      window.location.href = `/pages/tasks/taskDetails.html?taskId=${task.id}`;
    });

    taskListContainer.appendChild(taskCard);
  });
}

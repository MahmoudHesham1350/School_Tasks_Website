document.addEventListener("DOMContentLoaded", function () {
  // Get current admin from session storage
  const currentAdmin = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentAdmin || currentAdmin.role !== "admin") {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  // Get data from localStorage
  const database = new Database();
  
  if (!database.users || !database.tasks || database.users.length === 0) {
    document.querySelector(".dashboard").innerHTML =
      "<p>No data available. Please initialize the system.</p>";
    return;
  }

  displayAdminData(currentAdmin);
  displayAdminTasks(database.tasks, currentAdmin.username);
});

function displayAdminData(admin) {
  // Update profile information
  const profileName = document.querySelector(".profile-name");
  const profileBio = document.querySelector(".profile-bio");
  
  if (profileName) profileName.textContent = admin.username || "Administrator";
  if (profileBio) profileBio.textContent = admin.email;
}

function displayAdminTasks(tasks, adminUsername) {
  // Find task list container
  const taskListContainer = document.querySelector(".task_list");
  
  // If no container exists, exit the function
  if (!taskListContainer) return;
  
  // Clear existing content
  taskListContainer.innerHTML = "";

  // Filter tasks created by the current admin
  const adminTasks = tasks.filter(task => task.assigned_by === adminUsername);

  // Check if there are any tasks
  if (!adminTasks || adminTasks.length === 0) {
    taskListContainer.innerHTML = `
      <div class="no-tasks-message">
        <p>You haven't created any tasks yet. Click "Create Task" to get started!</p>
      </div>
    `;
    return;
  }

  // Display each task
  adminTasks.forEach((task) => {
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
          <div class="completion_status">
            Completed by: ${task.completed_by ? task.completed_by.join(", ") : "None"}
          </div>
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

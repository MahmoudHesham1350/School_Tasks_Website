document.addEventListener("DOMContentLoaded", function () {
  // Get current admin from session storage
  const currentAdmin = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentAdmin || currentAdmin.role !== "admin") {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  // Get data from Database class
  const database = new Database();
  
  if (!database.users || !database.tasks || database.users.length === 0) {
    document.querySelector(".task_list").innerHTML =
      "<p class='error-message'>No data available. Please contact system administrator.</p>";
    return;
  }

  // Display admin profile
  displayAdminData(currentAdmin);
  // Display all tasks in the system
  displayAllTasks(database);
});

function displayAdminData(admin) {
  const profileName = document.querySelector(".profile-name");
  if (profileName) {
    profileName.textContent = admin.username || "Admin";
  }
}

function displayAllTasks(database) {
  const taskList = document.querySelector(".task_list");
  if (!taskList) return;
  
  taskList.innerHTML = ""; // Clear existing content

  if (!database.tasks || database.tasks.length === 0) {
    taskList.innerHTML = "<p class='no-tasks-message'>No tasks found in the system.</p>";
    return;
  }

  // Create task statistics summary
  const statsSummary = document.createElement("div");
  statsSummary.className = "admin-stats";

  const totalTasks = database.tasks.length;
  const completedTasks = database.tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const notStartedTasks = database.tasks.filter(
    (task) => task.status === "Not Started"
  ).length;
  const inProgressTasks = database.tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  statsSummary.innerHTML = `
    <h3>System Overview</h3>
    <div class="stats-container">
        <div class="stat-item">
            <span class="stat-count">${totalTasks}</span>
            <span class="stat-label">Total Tasks</span>
        </div>
        <div class="stat-item">
            <span class="stat-count">${completedTasks}</span>
            <span class="stat-label">Completed</span>
        </div>
        <div class="stat-item">
            <span class="stat-count">${notStartedTasks}</span>
            <span class="stat-label">Not Started</span>
        </div>
        <div class="stat-item">
            <span class="stat-count">${inProgressTasks}</span>
            <span class="stat-label">In Progress</span>
        </div>
    </div>
  `;

  taskList.appendChild(statsSummary);

  // Create task list header
  const tasksHeader = document.createElement("h3");
  tasksHeader.textContent = "All Tasks";
  tasksHeader.className = "tasks-header";
  taskList.appendChild(tasksHeader);

  // Create tasks container
  const tasksContainer = document.createElement("div");
  tasksContainer.className = "tasks-container";
  taskList.appendChild(tasksContainer);

  // Sort tasks by due date (most recent first)
  const sortedTasks = [...database.tasks].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  sortedTasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task_card";

    // Add status class to the task card
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
        <div class="admin-task-details">
          ${task.subject ? `<p><strong>Subject:</strong> ${task.subject}</p>` : ''}
          ${task.status ? `<p><strong>Status:</strong> ${task.status}</p>` : ''}
        </div>
        <div class="card_footer">
          <div class="due_date">Due: ${task.due_date || "No deadline"}</div>
          <div class="created_by">By: ${task.assigned_by || "Unknown"}</div>
        </div>
      </div>
    `;

    // Add click handler to view task details
    taskCard.addEventListener('click', () => {
      window.location.href = `/pages/tasks/taskDetails.html?taskId=${task.id}`;
    });

    tasksContainer.appendChild(taskCard);
  });
}

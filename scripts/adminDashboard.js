document.addEventListener("DOMContentLoaded", function () {
  // Fetch the data from the JSON file
  fetch("../../data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Display admin profile (using first admin for demo purposes)
      displayAdminData(data);

      // Display all tasks in the system
      displayAllTasks(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.querySelector(".task_list").innerHTML =
        "<p>Failed to load dashboard data. Please try again later.</p>";
    });
});

function displayAdminData(data) {
  // For demo purposes, we'll just set admin name
  document.querySelector(".profile-name").textContent = "Admin User";
}

function displayAllTasks(data) {
  const taskList = document.querySelector(".task_list");
  taskList.innerHTML = ""; // Clear existing content

  if (!data.tasks || data.tasks.length === 0) {
    taskList.innerHTML = "<p>No tasks found in the system.</p>";
    return;
  }

  // Create task statistics summary
  const statsSummary = document.createElement("div");
  statsSummary.className = "admin-stats";

  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = data.tasks.filter(
    (task) => task.status === "pending"
  ).length;
  const inProgressTasks = data.tasks.filter(
    (task) => task.status === "in progress"
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
                <span class="stat-count">${pendingTasks}</span>
                <span class="stat-label">Pending</span>
            </div>
            <div class="stat-item">
                <span class="stat-count">${inProgressTasks}</span>
                <span class="stat-label">In Progress</span>
            </div>
        </div>
    `;

  taskList.appendChild(statsSummary);

  // Create task list with assigned student and teacher information
  const tasksHeader = document.createElement("h3");
  tasksHeader.textContent = "All Tasks";
  taskList.appendChild(tasksHeader);

  data.tasks.forEach((task) => {
    // Find the teacher who assigned this task
    const teacher = data.users.find((user) => user.id === task.assigned_by);

    // Find the student assigned to this task
    const student = data.users.find((user) => user.id === task.assigned_to);

    const taskCard = document.createElement("div");
    taskCard.className = "task_card";

    // Add status class to the task card
    taskCard.classList.add(`status-${task.status.replace(" ", "-")}`);

    taskCard.innerHTML = `
            <div class="title">
                <h3>${task.title}</h3>
                <span class="priority-badge ${task.priority}">${
      task.priority
    }</span>
            </div>
            <div class="card_details">
                <div class="description">
                    <p>${task.description}</p>
                </div>
                <div class="admin-task-details">
                    <p><strong>Subject:</strong> ${task.subject}</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                    <p><strong>Assigned to:</strong> ${
                      student ? student.name : "Unknown"
                    } (${student ? student.grade : "N/A"})</p>
                </div>
                <div class="card_footer">
                    <div class="due_date">Due: ${task.due_date}</div>
                    <div class="created_by">By: ${
                      teacher ? teacher.name : "Unknown"
                    }</div>
                </div>
            </div>
        `;

    taskList.appendChild(taskCard);
  });
}

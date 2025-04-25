document.addEventListener("DOMContentLoaded", function () {
  // Get current student from session storage
  const currentStudent = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentStudent) {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  // Get data from localStorage
  const database = new Database();
  
  if (!database.users || !database.tasks || database.users.length === 0) {
    document.querySelector(".dashboard").innerHTML =
      "<p>No data available. Please contact administrator.</p>";
    return;
  }

  displayStudentData(currentStudent);
  displayStudentTasks(database.tasks, currentStudent.username);
});

function displayStudentData(student) {
  // Update profile information
  const profileName = document.querySelector(".profile-name");
  const profileBio = document.querySelector(".profile-bio");
  
  if (profileName) profileName.textContent = student.username || "Student";
  if (profileBio) profileBio.textContent = student.role || "Student";
}

function displayStudentTasks(tasks, studentUsername) {
  // Find task list container
  const taskListContainer = document.querySelector(".task_list");
  
  // If no container exists, exit the function
  if (!taskListContainer) return;
  
  // Clear existing content
  taskListContainer.innerHTML = "";

  // Filter tasks assigned to the current student
  const studentTasks = tasks.filter(task => 
    task.assigned_to === studentUsername || 
    task.assigned_to === "all" || 
    !task.assigned_to // Tasks with no specific assignee are shown to all
  );

  // Check if there are any tasks
  if (!studentTasks || studentTasks.length === 0) {
    taskListContainer.innerHTML = `
      <div class="no-tasks-message">
        <p>No tasks assigned to you yet. Check back later!</p>
      </div>
    `;
    return;
  }

  // Display each task
  studentTasks.forEach((task) => {
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
          <div class="created_by">By: ${task.assigned_by || "Unknown"}</div>
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

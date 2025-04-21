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
      // For demo purposes, we'll use the first teacher (ID: 1)
      const teacherId = 1; // Ms. Taylor
      displayTeacherData(data, teacherId);
      displayTeacherTasks(data, teacherId);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.querySelector(".dashboard").innerHTML =
        "<p>Failed to load dashboard data. Please try again later.</p>";
    });
});

function displayTeacherData(data, teacherId) {
  // Find the teacher in the users array
  const teacher = data.users.find(
    (user) => user.id === teacherId && user.role === "teacher"
  );

  if (teacher) {
    // Update the profile information
    document.querySelector(".profile-name").textContent = teacher.name;
    document.querySelector(
      ".profile-bio"
    ).textContent = `${teacher.subject} Teacher`;
  }
}

function displayTeacherTasks(data, teacherId) {
  // Filter tasks assigned by this teacher
  const teacherTasks = data.tasks.filter(
    (task) => task.assigned_by === teacherId
  );

  // Get the container for tasks
  const taskList = document.querySelector(".task_list");
  taskList.innerHTML = "";

  // Add task summary information
  const taskSummary = document.createElement("div");
  taskSummary.className = "task-summary";

  const totalTasks = teacherTasks.length;
  const completedTasks = teacherTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = teacherTasks.filter(
    (task) => task.status === "pending"
  ).length;

  taskSummary.innerHTML = `
        <h3>Task Overview</h3>
        <div class="summary-details">
            <p>Total Tasks Assigned: <strong>${totalTasks}</strong></p>
            <p>Completed: <strong>${completedTasks}</strong></p>
            <p>Pending: <strong>${pendingTasks}</strong></p>
        </div>
        <button class="create-task-btn">Create New Task</button>
    `;

  taskList.appendChild(taskSummary);

  // If no tasks, display a message
  if (teacherTasks.length === 0) {
    const noTasksMsg = document.createElement("div");
    noTasksMsg.className = "no-tasks-message";
    noTasksMsg.textContent = "You have not assigned any tasks yet.";
    taskList.appendChild(noTasksMsg);
    return;
  }

  // Add a header for the tasks section
  const tasksHeader = document.createElement("h3");
  tasksHeader.textContent = "Your Assigned Tasks";
  taskList.appendChild(tasksHeader);

  // Display each task
  teacherTasks.forEach((task) => {
    // Find the student this task is assigned to
    const student = data.users.find((user) => user.id === task.assigned_to);

    const taskCard = document.createElement("div");
    taskCard.className = "task_card";

    // Add status class
    taskCard.classList.add(`status-${task.status.replace(" ", "-")}`);

    taskCard.innerHTML = `
            <div class="title">
                <h3>${task.title}</h3>
                <div class="task-actions">
                    <button class="edit-btn" data-task-id="${
                      task.id
                    }">Edit</button>
                    <button class="delete-btn" data-task-id="${
                      task.id
                    }">Delete</button>
                </div>
            </div>
            <div class="card_details">
                <div class="description">
                    <p>${task.description}</p>
                </div>
                <div class="task-meta">
                    <p><strong>Assigned to:</strong> ${
                      student ? student.name : "Unknown"
                    }</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                    <p><strong>Priority:</strong> ${task.priority}</p>
                </div>
                <div class="card_footer">
                    <div class="due_date">Due: ${task.due_date}</div>
                    <div class="status-indicator status-${task.status.replace(
                      " ",
                      "-"
                    )}">
                        ${task.status.toUpperCase()}
                    </div>
                </div>
            </div>
        `;

    taskList.appendChild(taskCard);
  });

  // Add event listeners for edit and delete buttons
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const taskId = parseInt(this.getAttribute("data-task-id"));
      alert(`Edit task ${taskId} - Feature coming soon!`);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const taskId = parseInt(this.getAttribute("data-task-id"));
      alert(`Delete task ${taskId} - Feature coming soon!`);
    });
  });

  // Event listener for create task button
  document
    .querySelector(".create-task-btn")
    .addEventListener("click", function () {
      alert("Create new task - Feature coming soon!");
    });
}

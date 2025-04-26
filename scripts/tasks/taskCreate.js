document.addEventListener("DOMContentLoaded", () => {
  const currentUser = checkAdminAccess();
  if (!currentUser) return;

  // Populate teacher list for assignment
  populateTeacherList();

  // Set minimum date for due date input to today
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  document.getElementById("due_date").setAttribute("min", today);

  // Check if we're in edit mode by looking for taskId in URL
  const taskId = new URLSearchParams(window.location.search).get("taskId");
  let currentTask = null;

  if (taskId) {
    // We're in edit mode - load the task
    const database = new Database();
    currentTask = database.getTaskByID(taskId);

    if (currentTask) {
      // Update page title and button text
      document.querySelector("h2").textContent = "Edit Task";
      document.querySelector('input[type="submit"]').value = "Update Task";

      // Fill form with task data
      fillFormWithTaskData(currentTask);
    } else {
      // Task not found - show error
      showError("Task not found", "title");
    }
  }

  document.getElementById("taskForm").addEventListener("submit", (event) => {
    handleSubmit(event, taskId, currentTask);
  });

  // Add event listeners to clear error messages when input changes
  const formElements = document.querySelectorAll(
    "#taskForm input, #taskForm select, #taskForm textarea"
  );
  formElements.forEach((element) => {
    element.addEventListener("input", () => {
      clearErrorMessages();
    });
  });
});

function checkAdminAccess() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "/pages/auth/login.html";
    return null;
  }

  if (currentUser.role !== "admin") {
    // Hide form and show access denied message
    document.getElementById("taskForm").style.display = "none";
    document.getElementById("admin-only-notice").style.display = "block";
    return null;
  }

  // Hide admin notice for admins
  document.getElementById("admin-only-notice").style.display = "none";
  return currentUser;
}

function populateTeacherList() {
  const database = new Database();
  const teachers = database.users.filter((user) => user.role === "teacher");
  const assignedToSelect = document.getElementById("assigned_to");

  teachers.forEach((teacher) => {
    const option = document.createElement("option");
    option.value = teacher.username;
    option.textContent = teacher.username;
    assignedToSelect.appendChild(option);
  });
}

function showError(message, elementId) {
  clearErrorMessages();

  const element = document.getElementById(elementId);
  const existingError = element.nextElementSibling;

  if (existingError && existingError.classList.contains("error-message")) {
    existingError.textContent = message;
  } else {
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    element.parentNode.insertBefore(errorElement, element.nextSibling);
  }

  element.focus();
}

function clearErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((element) => element.remove());
}

function handleSubmit(event, taskId, currentTask) {
  event.preventDefault();

  const database = new Database();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  // Get form values and trim whitespace
  const title = document.getElementById("title").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();
  const due_date = document.getElementById("due_date").value;
  const assignedTo = Array.from(
    document.getElementById("assigned_to").selectedOptions
  ).map((option) => option.value);
  const attachmentInput = document.getElementById("attachment");

  // Validate each field
  let isValid = true;

  if (!title) {
    showError("Title cannot be empty", "title");
    isValid = false;
  }

  if (!subject) {
    showError("Subject cannot be empty", "subject");
    isValid = false;
  }

  if (!priority) {
    showError("Please select a priority", "priority");
    isValid = false;
  }

  if (!description) {
    showError("Description cannot be empty", "description");
    isValid = false;
  }

  if (!due_date) {
    showError("Due date cannot be empty", "due_date");
    isValid = false;
  } else {
    // Check if due date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of the current day

    const selectedDate = new Date(due_date);

    if (selectedDate < today) {
      showError("Due date cannot be in the past", "due_date");
      isValid = false;
    }
  }

  if (assignedTo.length === 0) {
    showError(
      'Please select at least one teacher or "All Teachers"',
      "assigned_to"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    let task;
    let successMessage;

    if (taskId && currentTask) {
      // Update existing task
      task = currentTask;
      task.title = title;
      task.description = description;
      task.due_date = due_date;
      task.priority = priority;
      task.subject = subject;
      task.assigned_to = assignedTo.includes("all") ? "all" : assignedTo;
      task.status = "pending"; // Reset status for edited tasks
      task.completed_by = []; // Reset completion status

      // If there are new attachments, add them
      if (attachmentInput.files && attachmentInput.files.length > 0) {
        Array.from(attachmentInput.files).forEach((file) => {
          const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
          };
          task.addAttachment(fileInfo);
        });
      }

      // Update the task in the database
      database.updateTask(task);
      successMessage = "Task updated successfully!";
    } else {
      // Create new task
      const uniqueId = Date.now().toString();
      task = new Task(
        uniqueId,
        title,
        description,
        currentUser.username, // assigned_by (admin's username)
        due_date,
        priority,
        "pending", // Initial status
        subject
      );

      task.assigned_to = assignedTo.includes("all") ? "all" : assignedTo;
      task.completed_by = []; // Initialize empty completion list
      task.createdAt = new Date().toISOString().split("T")[0];

      // Handle file attachments (optional)
      if (attachmentInput.files && attachmentInput.files.length > 0) {
        Array.from(attachmentInput.files).forEach((file) => {
          const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
          };
          task.addAttachment(fileInfo);
        });
      }

      // Add task to database
      database.addTask(task);
      successMessage = "Task created successfully!";
    }

    // Show success message
    const form = document.getElementById("taskForm");
    const successElement = document.createElement("div");
    successElement.className = "success-message";
    successElement.textContent = successMessage;
    form.prepend(successElement);

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = "/pages/dashboard/adminDashboard.html";
    }, 1500);
  } catch (error) {
    showError(
      "An error occurred while saving the task. Please try again.",
      "title"
    );
    console.error("Error saving task:", error);
  }
}

function fillFormWithTaskData(task) {
  document.getElementById("title").value = task.title || "";
  document.getElementById("subject").value = task.subject || "";
  document.getElementById("priority").value = task.priority || "";
  document.getElementById("description").value = task.description || "";
  document.getElementById("due_date").value = task.due_date || "";

  // Handle assigned teachers
  const assignedToSelect = document.getElementById("assigned_to");
  if (task.assigned_to === "all") {
    assignedToSelect.querySelector('option[value="all"]').selected = true;
  } else if (Array.isArray(task.assigned_to)) {
    task.assigned_to.forEach((username) => {
      const option = assignedToSelect.querySelector(
        `option[value="${username}"]`
      );
      if (option) option.selected = true;
    });
  }
}

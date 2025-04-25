document.addEventListener('DOMContentLoaded', () => {
    checkUser();
    
    // Check if we're in edit mode by looking for taskId in URL
    const taskId = new URLSearchParams(window.location.search).get('taskId');
    let currentTask = null;
    
    if (taskId) {
        // We're in edit mode - load the task
        const database = new Database();
        currentTask = database.getTaskByID(taskId);
        
        if (currentTask) {
            // Update page title and button text
            document.querySelector('h2').textContent = "Edit Task";
            document.querySelector('input[type="submit"]').value = "Update Task";
            
            // Fill form with task data
            fillFormWithTaskData(currentTask);
        } else {
            // Task not found - show error
            showError('Task not found', 'title');
        }
    }
    
    document.getElementById('taskForm').addEventListener('submit', (event) => {
        handleSubmit(event, taskId, currentTask);
    });
    
    // Add event listeners to clear error messages when input changes
    const formElements = document.querySelectorAll('#taskForm input, #taskForm select, #taskForm textarea');
    formElements.forEach(element => {
        element.addEventListener('input', () => {
            clearErrorMessages();
        });
    });
});

function checkUser() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "/pages/auth/login.html";
        return;
    }
}

// Add this new function to display error messages with CSS styling
function showError(message, elementId) {
    clearErrorMessages(); // Clear any existing error messages first
    
    const element = document.getElementById(elementId);
    const existingError = element.nextElementSibling;
    
    if (existingError && existingError.classList.contains('error-message')) {
        existingError.textContent = message;
    } else {
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
    }
    
    element.focus();
}

// Add this function to clear all error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => element.remove());
}

function handleSubmit(event, taskId, currentTask) {
    event.preventDefault();
    
    const database = new Database();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = "/pages/auth/login.html";
        return;
    }
    
    // Get form values and trim whitespace
    const title = document.getElementById('title').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const description = document.getElementById('description').value.trim();
    const due_date = document.getElementById('due_date').value;
    const attachmentInput = document.getElementById('attachment');

    // Validate each field and show appropriate error messages
    let isValid = true;
    
    if (!title) {
        showError('Title cannot be empty', 'title');
        isValid = false;
    }
    
    if (!subject) {
        showError('Subject cannot be empty', 'subject');
        isValid = false;
    }
    
    if (!priority) {
        showError('Please select a priority', 'priority');
        isValid = false;
    }
    
    if (!status) {
        showError('Please select a status', 'status');
        isValid = false;
    }
    
    if (!description) {
        showError('Description cannot be empty', 'description');
        isValid = false;
    }
    
    if (!due_date) {
        showError('Due date cannot be empty', 'due_date');
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
            task.status = status;
            task.subject = subject;
            
            // If there are new attachments, add them
            if (attachmentInput.files && attachmentInput.files.length > 0) {
                Array.from(attachmentInput.files).forEach(file => {
                    const fileInfo = {
                        name: file.name,
                        type: file.type,
                        size: file.size
                    };
                    task.addAttachment(fileInfo);
                });
            }
            
            // Update the task in the database
            database.updateTask(task);
            successMessage = 'Task updated successfully!';
        } else {
            // Create new task
            const uniqueId = Date.now().toString();
            task = new Task(
                uniqueId,
                title,
                description,
                currentUser.username, // Use current user's username
                due_date,
                priority,
                status,
                subject
            );
            task.createdAt = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
            // Handle file attachments (optional)
            if (attachmentInput.files && attachmentInput.files.length > 0) {
                Array.from(attachmentInput.files).forEach(file => {
                    const fileInfo = {
                        name: file.name,
                        type: file.type,
                        size: file.size
                    };
                    task.addAttachment(fileInfo);
                });
            }
        
            // Add task to database
            database.addTask(task);
            successMessage = 'Task created successfully!';
        }
        
        // Show success message
        const form = document.getElementById('taskForm');
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = successMessage;
        form.prepend(successElement);
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = "/pages/tasks/taskList.html";
        }, 1500);
    } catch (error) {
        console.error('Error handling task:', error);
        showError('Error: ' + (error.message || 'Unknown error occurred'), 'title');
    }
}

function clearLocalStorage() {
    const form = document.getElementById('taskForm');
    form.reset();
    
    // Clear file input separately since reset doesn't always work for files
    const fileInput = document.getElementById('attachment');
    fileInput.value = '';
    
    // Clear any error messages
    clearErrorMessages();
    
    // Remove current attachments display if it exists
    const currentAttachments = document.querySelector('.current-attachments');
    if (currentAttachments) {
        currentAttachments.remove();
    }
}

// Function to fill the form with existing task data
function fillFormWithTaskData(task) {
    document.getElementById('title').value = task.title;
    document.getElementById('subject').value = task.subject;
    document.getElementById('priority').value = task.priority;
    document.getElementById('status').value = task.status;
    document.getElementById('description').value = task.description;
    document.getElementById('due_date').value = task.due_date;
    
    // Note: We can't pre-fill file inputs for security reasons
    // If you want to show the current attachments, you'd need to add a display section
    if (task.Attachment && task.Attachment.length > 0) {
        const fileInput = document.getElementById('attachment');
        const fileContainer = fileInput.parentElement;
        
        const attachmentsList = document.createElement('div');
        attachmentsList.className = 'current-attachments';
        attachmentsList.innerHTML = '<p>Current attachments:</p>';
        
        task.Attachment.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'attachment-item';
            fileItem.innerHTML = `📄 ${file.name}`;
            attachmentsList.appendChild(fileItem);
        });
        
        // Insert the attachments list after the file input container
        fileContainer.parentNode.insertBefore(attachmentsList, fileContainer.nextSibling);
    }
}
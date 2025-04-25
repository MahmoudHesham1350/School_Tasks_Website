document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(sessionStorage.getItem("currentUser")); // whole user object

    if (userData && userData.userType === "teacher") {
        const teacherName = userData.name;
        const rows = document.querySelectorAll(".task-table tbody tr");

        rows.forEach(row=>{
            const assignedBy = row.cells[3]?.textContent.trim();
            if (assignedBy != teacherName) {
                row.style.display = "none";
            }
        });
    }

    if (userData) {
        const allCards = document.querySelectorAll(".user-card");
        allCards.forEach(card => {
            const roleText = card.querySelector("h1").innerText.toLowerCase();
            if (roleText !== userData.role) card.style.display = "none";
        });

        const wayHeader = document.querySelector(".way-header");
        if (wayHeader) {
            wayHeader.innerText = `Welcome, ${userData.name}!`;
        }
    }

    // Load tasks from localStorage
    displayRecentTasks();
});

function displayRecentTasks() {
    try {
        // Get tasks from localStorage
        const tasksJson = localStorage.getItem('tasks');
        const taskTableBody = document.querySelector('.task-table tbody');
        
        // Clear existing hardcoded rows
        taskTableBody.innerHTML = '';
        
        // If no tasks exist, show a message
        if (!tasksJson || !taskTableBody) {
            const noTasksRow = document.createElement('tr');
            noTasksRow.innerHTML = `
                <td colspan="5" class="no-tasks-message">
                    <p>No tasks available yet. Check back later!</p>
                </td>
            `;
            taskTableBody.appendChild(noTasksRow);
            return;
        }
        
        // Parse tasks
        const tasks = JSON.parse(tasksJson);
        
        // Sort tasks by createdAt date (newest first)
        const sortedTasks = tasks.sort((a, b) => {
            // Use due_date if createdAt is not available
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.due_date);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.due_date);
            return dateB - dateA;
        });
        
        // Take only the 5 most recent tasks
        const recentTasks = sortedTasks.slice(0, 5);
        
        // If no tasks after filtering, show message
        if (recentTasks.length === 0) {
            const noTasksRow = document.createElement('tr');
            noTasksRow.innerHTML = `
                <td colspan="5" class="no-tasks-message">
                    <p>No tasks available yet. Check back later!</p>
                </td>
            `;
            taskTableBody.appendChild(noTasksRow);
            return;
        }
        
        // Add each task to the table
        recentTasks.forEach(task => {
            const row = document.createElement('tr');
            
            // Format the date
            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const formattedDate = dueDate ? 
                dueDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'No deadline';
            
            row.innerHTML = `
                <td>${task.title || 'Untitled Task'}</td>
                <td>${task.subject || 'General'}</td>
                <td>${formattedDate}</td>
                <td>${task.assigned_by || 'Unknown'}</td>
                <td><a href="/pages/tasks/taskDetails.html?taskId=${task.id}">View</a></td>
            `;
            
            taskTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying recent tasks:', error);
        
        // Show error message if something went wrong
        const taskTableBody = document.querySelector('.task-table tbody');
        if (taskTableBody) {
            taskTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="error-message">
                        <p>Unable to load tasks. Please try again later.</p>
                    </td>
                </tr>
            `;
        }
    }
}
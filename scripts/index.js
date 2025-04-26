document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(sessionStorage.getItem("currentUser"));

    // Update UI based on authentication status
    updateUIForUser(userData);

    // Load tasks from localStorage
    displayRecentTasks();
});

function updateUIForUser(userData) {
    // Handle quick links visibility
    const quickLinks = document.querySelector('.quick-links');
    if (quickLinks) {
        quickLinks.style.display = userData ? 'none' : 'block';
    }

    // Update user cards visibility
    const allCards = document.querySelectorAll(".user-card");
    allCards.forEach(card => {
        if (userData) {
            const roleText = card.querySelector("h1").innerText.toLowerCase();
            card.style.display = roleText === userData.role ? 'block' : 'none';
        } else {
            card.style.display = 'block';
            // Update button text for non-logged in users
            const btn = card.querySelector('.btn');
            if (btn) {
                const role = card.querySelector("h1").innerText.toLowerCase();
                btn.href = '/pages/auth/login.html';
                btn.textContent = `Login as ${role}`;
            }
        }
    });

    // Update welcome message
    const wayHeader = document.querySelector(".way-header");
    if (wayHeader) {
        wayHeader.innerText = userData ? `Welcome, ${userData.username}!` : 'Who Are You?';
    }
}

function displayRecentTasks() {
    try {
        const tasksJson = localStorage.getItem('tasks');
        const taskTableBody = document.querySelector('.task-table tbody');
        
        if (!taskTableBody) return;
        taskTableBody.innerHTML = '';
        
        if (!tasksJson) {
            showNoTasksMessage(taskTableBody);
            return;
        }
        
        const tasks = JSON.parse(tasksJson);
        const sortedTasks = tasks.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.due_date);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.due_date);
            return dateB - dateA;
        });
        
        const recentTasks = sortedTasks.slice(0, 5);
        
        if (recentTasks.length === 0) {
            showNoTasksMessage(taskTableBody);
            return;
        }
        
        recentTasks.forEach(task => {
            const row = document.createElement('tr');
            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const formattedDate = dueDate ? 
                dueDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
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
        showErrorMessage(document.querySelector('.task-table tbody'));
    }
}

function showNoTasksMessage(tableBody) {
    if (!tableBody) return;
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="no-tasks-message">
                <p>No tasks available yet. Check back later!</p>
            </td>
        </tr>
    `;
}

function showErrorMessage(tableBody) {
    if (!tableBody) return;
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="error-message">
                <p>Unable to load tasks. Please try again later.</p>
            </td>
        </tr>
    `;
}
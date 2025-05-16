document.addEventListener("DOMContentLoaded", function () {
    displayTasks();
});

function displayTasks() {
    const taskListContainer = document.querySelector(".task_list");
    
    if (!taskListContainer) return;

    const taskCards = document.querySelectorAll('.task_card');
    
    if (!taskCards || taskCards.length === 0) {
        taskListContainer.innerHTML = `
            <div class="no-tasks-message">
                <p>You haven't created any tasks yet. Click "Create Task" to get started!</p>
            </div>
        `;
        return;
    }

    taskCards.forEach(function(taskCard) {
        const taskId = taskCard.getAttribute('data-task-id');
        
        taskCard.addEventListener('click', () => {
            window.location.href = `/tasks/${taskId}/`;
        });
        
        const status = taskCard.getAttribute('data-status');
        if (status) {
            taskCard.classList.add(`status-${status.toLowerCase().replace(/\s+/g, "-")}`);
        }

        const priority = taskCard.getAttribute('data-priority');
        if (priority) {
            const priorityBadge = taskCard.querySelector('.priority-badge');
            if (priorityBadge) {
                priorityBadge.classList.add(`priority-${priority.toLowerCase()}`);
            }
        }
    });
}
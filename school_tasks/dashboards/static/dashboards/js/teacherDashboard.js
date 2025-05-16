document.addEventListener("DOMContentLoaded", function () {
    initializeTaskCards();
    initializeSubmissionCards();
});

function initializeTaskCards() {
    const taskCards = document.querySelectorAll('.task_card');
    if (!taskCards || taskCards.length === 0) {
        const taskList = document.querySelector('.task_list');
        if (taskList) {
            taskList.innerHTML = '<p>No tasks available.</p>';
        }
        return;
    }

    taskCards.forEach(function(card) {
        const taskId = card.getAttribute('data-task-id');
        
        // Add click handler to view task details
        card.addEventListener('click', () => {
            window.location.href = `/tasks/${taskId}/`;
        });

        // Add status-based styling
        const status = card.getAttribute('data-status');
        if (status) {
            card.classList.add(`status-${status.toLowerCase().replace(/\s+/g, "-")}`);
        }

        // Add priority-based styling
        const priority = card.getAttribute('data-priority');
        if (priority) {
            const priorityBadge = card.querySelector('.priority-badge');
            if (priorityBadge) {
                priorityBadge.classList.add(`priority-${priority.toLowerCase()}`);
            }
        }
    });
}

function initializeSubmissionCards() {
    const submissionCards = document.querySelectorAll('.submission_card');
    
    submissionCards.forEach(function(card) {
        const submissionId = card.getAttribute('data-submission-id');
        
        // Add click handler to view submission details
        card.addEventListener('click', () => {
            window.location.href = `/submissions/${submissionId}/`;
        });

        // Add status-based styling
        const status = card.getAttribute('data-status');
        if (status) {
            card.classList.add(`status-${status.toLowerCase().replace(/\s+/g, "-")}`);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const priorityFilter = document.getElementById('priority-filter');
    const tasksList = document.getElementById('tasks-list');

    // Convert HTMLCollection to Array and add click listeners
    Array.from(tasksList.getElementsByClassName('task_card')).forEach(card => {
        card.addEventListener('click', () => {
            const taskId = card.getAttribute('data-task-id');
            window.location.href = `/tasks/${taskId}/`;
        });
    });

    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const priority = priorityFilter.value;
        const taskCards = tasksList.getElementsByClassName('task_card');

        Array.from(taskCards).forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.description p').textContent.toLowerCase();
            const taskPriority = card.querySelector('.priority').textContent.split(': ')[1];
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesPriority = !priority || taskPriority === priority;

            card.style.display = matchesSearch && matchesPriority ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', filterTasks);
    priorityFilter.addEventListener('change', filterTasks);
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const rightSec = document.getElementById('rightSec');
    
    if (menuToggle && rightSec) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            rightSec.classList.toggle('active');
        });
    }
}); 
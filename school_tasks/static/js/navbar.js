/**
 * Navbar mobile menu functionality for Classroom of FCAI
 * This script handles the mobile menu toggle behavior
 */

document.addEventListener('DOMContentLoaded', function() {

  // Set up event listener for mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const rightSec = document.getElementById('rightSec');


  if (menuToggle && rightSec) {
    menuToggle.addEventListener('click', function() {
      rightSec.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

});


  
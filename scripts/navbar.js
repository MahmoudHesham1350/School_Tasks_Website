/**
 * Navbar component for Classroom of FCAI
 * This script dynamically generates and inserts the navbar into each page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Create and insert the navbar
  createNavbar();
  
  // Set up event listener for mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const rightSec = document.getElementById('rightSec');
  
  if (menuToggle && rightSec) {
    menuToggle.addEventListener('click', function() {
      rightSec.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  const userData = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!userData) return;

  // Update welcome message if it exists
  const wayHeader = document.querySelector(".way-header");
  if (wayHeader) {
    wayHeader.innerText = `Welcome, ${userData.name}!`;
  }
});

/**
 * Creates and inserts the navbar into the page
 */
function createNavbar() {
  // Find navbar placeholder or create one if it doesn't exist
  let navbarContainer = document.getElementById('navbar-container');
  if (!navbarContainer) {
    const firstChild = document.body.firstChild;
    navbarContainer = document.createElement('div');
    navbarContainer.id = 'navbar-container';
    document.body.insertBefore(navbarContainer, firstChild);
  }
  
  // Get current page path to determine active links
  const currentPath = window.location.pathname;
  
  // Check if user is logged in and get role
  const isLoggedIn = sessionStorage.getItem('currentUser') !== null;
  let userRole = '';
  
  if (isLoggedIn) {
    try {
      const userData = JSON.parse(sessionStorage.getItem('currentUser'));
      userRole = userData.role || '';
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  // Generate navbar links based on authentication state and user role
  let navLinks = '';
  
  if (isLoggedIn) {
    // Links for logged-in users
    navLinks = `
      <a class="links" href="/index.html">Home</a>
    `;
    
    // Role-specific dashboard links
    if (userRole === 'admin') {
      navLinks += `<a class="links" href="/pages/dashboard/adminDashboard.html">Dashboard</a>`;
    } else if (userRole === 'teacher') {
      navLinks += `<a class="links" href="/pages/dashboard/teacherDashboard.html">Dashboard</a>`;
    }
    // Logout link for all logged-in users
    navLinks += `<a class="links" href="#" id="logout-link">Logout</a>`;
  } else {
    // Links for non-logged-in users
    navLinks = `
      <a class="links" href="/pages/auth/signup.html">Sign Up</a>
      <a class="links" href="/pages/auth/login.html">Login</a>
      <a class="links" href="/index.html">Home</a>
    `;
  }
  
  // Create navbar HTML
  const navbarHTML = `
    <div class="navbar" id="navbar">
      <div class="nav sizer">
        <div class="logo" id="logo">
          <h1>Classroom of FCAI</h1>
        </div>
        <button class="menu-toggle" id="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="rightSec" id="rightSec">
          ${navLinks}
        </div>
      </div>
    </div>
  `;
  
  // Insert the navbar
  navbarContainer.innerHTML = navbarHTML;
  
  // Set up logout functionality
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      sessionStorage.removeItem('currentUser');
      window.location.href = '/index.html';
    });
  }
}
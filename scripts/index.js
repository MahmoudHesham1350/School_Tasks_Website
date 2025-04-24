document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(sessionStorage.getItem("currentUser")); // whole user object
    const allCards = document.querySelectorAll(".user-card");
    const wayHeader = document.querySelector(".way-header");
    const rightSec = document.getElementById("rightSec");
    const quickLinksSection = document.querySelector(".quick-links");
  
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
        const { role, name } = userData;
    
        allCards.forEach(card => {
            const roleText = card.querySelector("h1").innerText.toLowerCase();
            if (roleText !== role) card.style.display = "none";
        });
    
        wayHeader.innerText = `Welcome, ${name}!`;
    
        document.querySelectorAll(".links").forEach(link => {
            const text = link.innerText.toLowerCase();
            if (text.includes("login") || text.includes("sign up")) {
            link.style.display = "none";
            }
        });
    
        if (quickLinksSection) {
            quickLinksSection.style.display = "none";
        }
    
        const dashboardLink = document.createElement("a");
        dashboardLink.className = "links";
        dashboardLink.href = `/pages/dashboard/${role}/Dashboard.html`;
        dashboardLink.innerText = "Dashboard";
        rightSec.appendChild(dashboardLink);
    
        const logout = document.createElement("a");
        logout.className = "links";
        logout.href = "#";
        logout.innerText = "Logout";
        logout.addEventListener("click", () => {
            sessionStorage.clear();
            location.reload();
        });
        rightSec.appendChild(logout);
    }
    

});
  
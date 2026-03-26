// ============================================================
//  CYSE 411 Q4 Starter Code
//  Employee Directory Application


function loadSession() {
   try {
        const sessionStr = sessionStorage.getItem('userSession');
        if (!sessionStr) return null;
        const session = JSON.parse(sessionStr);

        const hasUserId = typeof session.userId === 'string' && session.userId.trim() !== '';
        const hasRole = typeof session.role === 'string' && session.role.trim() !== '';
        const hasDisplayName = typeof session.displayName === 'string' && session.displayName.trim() !== '';
    if (hasUserId && hasRole && hasDisplayName) {
            return session; 
        } else {
            console.error("Session missing required fields.");
            return null; 
        }
    } catch (e) {
        console.error("Failed to parse session data:", e);
        return null;
    }
} 


//  Q4.A  Status Message Rendering
//  Displays an employee's status message on their profile card.
//  VULNERABILITY: The message is inserted via innerHTML,
//  allowing any HTML or script tags in the message to
//  execute in the viewer's browser (stored XSS).


function renderStatusMessage(containerElement, message) {
    containerElement.textContent = '';
    const p = document.createElement('p');
    p.textContent = message; // Append the safe paragraph to the container instead of the unsafe one 
    containerElement.appendChild(p);
}



//  Q4.B  Search Query Sanitization
//  Builds a display label from the user's search input.
//  VULNERABILITY: The raw input is used directly with no
//  character filtering, no length limit, and no trimming.


function sanitizeSearchQuery(input) {
    let sanitized = input.trim();
    sanitized = sanitized.replace(/[^a-zA-Z0-9 \-_]/g, '');
    if (sanitized.length === 0) {
        return null;
    }

    return sanitized.substring(0, 40);
}



function performSearch(query) {
    const sanitized = sanitizeSearchQuery(query);
    const label = document.getElementById("search-label");
    //After changing the inner HTML 
    if (sanitized) {
        label.textContent = "Showing results for: " + sanitized;
    } else {
        label.textContent = ""; 
    }
}




//  Application Bootstrap
//  Runs when the page finishes loading.


document.addEventListener("DOMContentLoaded", function () {

    // Load session
    const session = loadSession();
    if (session) {
        document.getElementById("welcome-msg").textContent =
            "Welcome, " + session.displayName;
    }

    // Simulate receiving a profile card with a status message
    // In production this would come from an API response.
    const simulatedProfiles = [
        {
            name: "Alice Johnson",
            department: "Engineering",
            status: "Working from home today"
        },
        {
            name: "Bob Martinez",
            department: "Security",
            // Attacker-controlled payload – should NOT execute
            status: "<img src=x onerror=\"alert('XSS: session stolen')\">"
        },
        {
            name: "Carol Lee",
            department: "HR",
            status: "Out of office until Friday"
        }
    ];

    const directory = document.getElementById("directory");

    simulatedProfiles.forEach(function (profile) {
        const card = document.createElement("div");
        card.className = "profile-card";

        const nameEl = document.createElement("h3");
        nameEl.textContent = profile.name;

        const deptEl = document.createElement("p");
        deptEl.textContent = "Department: " + profile.department;

        const statusContainer = document.createElement("div");
        statusContainer.className = "status";

        // Q4.A – fix this call
        renderStatusMessage(statusContainer, profile.status);

        card.appendChild(nameEl);
        card.appendChild(deptEl);
        card.appendChild(statusContainer);
        directory.appendChild(card);
    });

    // Search button handler
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.getElementById("search-input").value;
        performSearch(query);
    });

});

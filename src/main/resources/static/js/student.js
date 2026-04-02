const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

window.onload = function () {
    setStudentInfo();
    loadDashboardCounts();
    showDashboard();
};

function setStudentInfo() {
    const studentNameEl = document.getElementById("studentName");
    const userInitialEl = document.getElementById("userInitial");

    if (studentNameEl) {
        studentNameEl.textContent = user.username || "Student";
    }

    if (userInitialEl) {
        userInitialEl.textContent = (user.username || "S").charAt(0).toUpperCase();
    }
}

function setActiveNav(clickedItem) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (clickedItem) {
        clickedItem.classList.add("active");
    }
}

function showDashboard(event) {
    if (event) {
        event.preventDefault();
        setActiveNav(event.currentTarget);
    } else {
        const dashboardNav = document.querySelector('.nav-item[data-page="dashboard"]');
        if (dashboardNav) {
            setActiveNav(dashboardNav);
        }
    }

    document.getElementById("pageTitle").textContent = "Dashboard";
    document.getElementById("pageSubtitle").textContent = "Welcome back! View your request summary here.";

    document.getElementById("dashboardSection").classList.remove("hidden");
    document.getElementById("iframeSection").classList.add("hidden");
    document.getElementById("contentFrame").src = "";

    loadDashboardCounts();
}

function loadPage(event, pageUrl, title) {
    event.preventDefault();
    setActiveNav(event.currentTarget);

    document.getElementById("pageTitle").textContent = title;
    document.getElementById("pageSubtitle").textContent = "Manage your student requests from this section.";

    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("iframeSection").classList.remove("hidden");

    const frame = document.getElementById("contentFrame");
    const resolvedPageUrl = new URL(pageUrl, window.location.href);

    frame.onerror = function () {
        alert("Unable to load " + title + " right now.");
    };

    frame.src = resolvedPageUrl.pathname + "?t=" + new Date().getTime();
}

function loadDashboardCounts() {
    fetch(`http://localhost:8080/request/student/${user.id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to load dashboard data");
            }
            return res.json();
        })
        .then(data => {
            let approved = 0;
            let pending = 0;
            let certificatePending = 0;
            let total = data.length;

            data.forEach(req => {
                if (req.status === "APPROVED") {
                    approved++;
                    if (!req.certificate) {
                        certificatePending++;
                    }
                } else if (req.status === "PENDING") {
                    pending++;
                }
            });

            document.getElementById("approvedCount").textContent = approved;
            document.getElementById("pendingCount").textContent = pending;
            document.getElementById("certificateCount").textContent = certificatePending;
            document.getElementById("totalCount").textContent = total;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("approvedCount").textContent = "0";
            document.getElementById("pendingCount").textContent = "0";
            document.getElementById("certificateCount").textContent = "0";
            document.getElementById("totalCount").textContent = "0";
        });
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

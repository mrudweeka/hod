const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.top.location.href = "index.html";
}

window.onload = function () {
    loadRequests();
};

function loadRequests() {
    fetch(`http://localhost:8080/request/student/${user.id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to load requests");
            }
            return res.json();
        })
        .then(data => {
            const table = document.getElementById("requestTable");
            table.innerHTML = "";

            if (data.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-row">No requests found.</td>
                    </tr>
                `;
                return;
            }

            data.forEach(req => {
                let statusBadge = "";
                if (req.status === "APPROVED") {
                    statusBadge = `<span class="status-badge approved">APPROVED</span>`;
                } else if (req.status === "PENDING") {
                    statusBadge = `<span class="status-badge pending">PENDING</span>`;
                } else {
                    statusBadge = `<span class="status-badge rejected">REJECTED</span>`;
                }

                const hodName = req.hod && req.hod.username ? req.hod.username : "—";
                const endDate = req.endDate || "—";
                const dueDate = req.certificateDueDate || "—";
                const certificateStatus = req.certificate
                    ? `<span class="certificate-badge">Uploaded</span>`
                    : "Not Uploaded";

                const row = `
                    <tr>
                        <td>${req.reason || "—"}</td>
                        <td>${hodName}</td>
                        <td>${statusBadge}</td>
                        <td>${endDate}</td>
                        <td>${dueDate}</td>
                        <td>${certificateStatus}</td>
                    </tr>
                `;

                table.innerHTML += row;
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById("requestTable").innerHTML = `
                <tr>
                    <td colspan="6" class="empty-row">Unable to load requests.</td>
                </tr>
            `;
        });
}
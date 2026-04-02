const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.top.location.href = "index.html";
}

window.onload = function () {
    loadCertificateRequests();
};

function loadCertificateRequests() {
    fetch(`http://localhost:8080/request/student/${user.id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to load requests");
            }
            return res.json();
        })
        .then(data => {
            const table = document.getElementById("certificateTable");
            table.innerHTML = "";

            const approvedRequests = data.filter(req => req.status === "APPROVED");

            if (approvedRequests.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-row">No approved requests found for certificate upload.</td>
                    </tr>
                `;
                return;
            }

            approvedRequests.forEach(req => {
                const hodName = req.hod && req.hod.username ? req.hod.username : "—";
                const endDate = req.endDate || "—";
                const dueDate = req.certificateDueDate || "—";

                let actionHtml = "";
                if (req.certificate) {
                    actionHtml = `<span class="uploaded-badge">Already Uploaded</span>`;
                } else {
                    actionHtml = `
                        <input type="text" class="file-input" placeholder="Enter file path" id="file-${req.id}">
                    `;
                }

                const buttonHtml = req.certificate
                    ? "—"
                    : `<button class="upload-btn" onclick="uploadCertificate(${req.id})">Upload</button>`;

                const row = `
                    <tr>
                        <td>${req.reason || "—"}</td>
                        <td>${hodName}</td>
                        <td>${endDate}</td>
                        <td>${dueDate}</td>
                        <td>${actionHtml}</td>
                        <td>${buttonHtml}</td>
                    </tr>
                `;

                table.innerHTML += row;
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById("certificateTable").innerHTML = `
                <tr>
                    <td colspan="6" class="empty-row">Unable to load certificate requests.</td>
                </tr>
            `;
        });
}

function uploadCertificate(requestId) {
    const filePath = document.getElementById(`file-${requestId}`).value.trim();

    if (!filePath) {
        alert("Please enter certificate file path.");
        return;
    }

    fetch(`http://localhost:8080/certificate/upload?requestId=${requestId}&filePath=${encodeURIComponent(filePath)}`, {
        method: "POST"
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to upload certificate");
            }
            return res.json();
        })
        .then(() => {
            alert("Certificate uploaded successfully!");
            loadCertificateRequests();
        })
        .catch(err => {
            console.error(err);
            alert("Error while uploading certificate.");
        });
}
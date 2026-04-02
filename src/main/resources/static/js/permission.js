const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.top.location.href = "index.html";
}

window.onload = function () {
    loadHods();
};

function loadHods() {
    fetch("http://localhost:8080/request/hods")
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to load HOD list");
            }
            return res.json();
        })
        .then(data => {
            const hodSelect = document.getElementById("hodSelect");
            hodSelect.innerHTML = `<option value="">-- Select HOD --</option>`;

            data.forEach(hod => {
                hodSelect.innerHTML += `<option value="${hod.id}">${hod.username}</option>`;
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById("hodSelect").innerHTML = `<option value="">Unable to load HODs</option>`;
        });
}

function createRequest() {
    const hodId = document.getElementById("hodSelect").value;
    const reason = document.getElementById("reason").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("description").value.trim();

    if (!hodId) {
        alert("Please select an HOD.");
        return;
    }

    if (!reason || !startDate || !endDate || !description) {
        alert("Please fill all fields.");
        return;
    }

    if (startDate > endDate) {
        alert("Start date cannot be greater than end date.");
        return;
    }

    const requestData = {
        reason: reason,
        description: description,
        startDate: startDate,
        endDate: endDate,
        student: { id: user.id },
        hod: { id: Number(hodId) }
    };

    fetch("http://localhost:8080/request/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(message => {
                    throw new Error(message || "Failed to create request");
                });
            }
            return res.json();
        })
        .then(() => {
            alert("Request submitted successfully!");
            clearForm();
        })
        .catch(err => {
            console.error(err);
            alert(err.message || "Error while submitting request.");
        });
}

function clearForm() {
    document.getElementById("hodSelect").value = "";
    document.getElementById("reason").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("description").value = "";
}
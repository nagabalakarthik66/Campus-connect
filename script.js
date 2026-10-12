/* =====================================================
   CAMPUSCONNECT
   College Complaint Management System
   ===================================================== */


/* ================= DATA ================= */

let complaints =
    JSON.parse(localStorage.getItem("campusComplaints")) || [];


/* ================= LOGIN ================= */

const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const role =
        document.getElementById("loginRole").value;


    if (!email || !password) {

        showToast("Please enter email and password.");

        return;
    }


    document
        .getElementById("loginPage")
        .classList.add("hidden");


    if (role === "student") {

        document
            .getElementById("studentApp")
            .classList.remove("hidden");

        updateStudentDashboard();

    } else {

        document
            .getElementById("adminApp")
            .classList.remove("hidden");

        updateAdminDashboard();

    }

});


/* ================= LOGOUT ================= */

function logout() {

    document
        .getElementById("studentApp")
        .classList.add("hidden");

    document
        .getElementById("adminApp")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");


    document
        .getElementById("loginForm")
        .reset();

}


/* ================= STUDENT NAVIGATION ================= */

document
    .querySelectorAll("#studentApp .nav-btn")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            const section =
                button.dataset.section;

            openSection(section);

        });

    });


function openSection(sectionId) {

    document
        .querySelectorAll("#studentApp .content-section")
        .forEach(function (section) {

            section.classList.add("hidden");

        });


    const selected =
        document.getElementById(sectionId);

    if (selected) {

        selected.classList.remove("hidden");

    }


    document
        .querySelectorAll("#studentApp .nav-btn")
        .forEach(function (button) {

            button.classList.remove("active");

            if (
                button.dataset.section === sectionId
            ) {

                button.classList.add("active");

            }

        });


    const titles = {

        studentDashboard: "Dashboard",

        submitComplaint: "Submit Complaint",

        myComplaints: "My Complaints"

    };


    document.getElementById("pageTitle").textContent =
        titles[sectionId] || "Dashboard";


    if (sectionId === "studentDashboard") {

        updateStudentDashboard();

    }


    if (sectionId === "myComplaints") {

        renderStudentComplaints();

    }

}


/* ================= ADMIN NAVIGATION ================= */

document
    .querySelectorAll("#adminApp .nav-btn")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            const section =
                button.dataset.section;

            openAdminSection(section);

        });

    });


function openAdminSection(sectionId) {

    document
        .querySelectorAll("#adminApp .content-section")
        .forEach(function (section) {

            section.classList.add("hidden");

        });


    const selected =
        document.getElementById(sectionId);

    if (selected) {

        selected.classList.remove("hidden");

    }


    document
        .querySelectorAll("#adminApp .nav-btn")
        .forEach(function (button) {

            button.classList.remove("active");

            if (
                button.dataset.section === sectionId
            ) {

                button.classList.add("active");

            }

        });


    if (sectionId === "adminDashboard") {

        updateAdminDashboard();

    }


    if (sectionId === "adminComplaints") {

        renderAdminComplaints();

    }

}


/* ================= COMPLAINT FORM ================= */

document
    .getElementById("complaintForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById("complaintTitle")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value;


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const priority =
            document
                .getElementById("priority")
                .value;


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        if (
            !title ||
            !category ||
            !location ||
            !description
        ) {

            showToast(
                "Please fill in all required fields."
            );

            return;

        }


        const complaint = {

            id: generateComplaintId(),

            title: title,

            category: category,

            location: location,

            priority: priority,

            description: description,

            status: "Submitted",

            date: new Date().toLocaleDateString(),

            student: "Student"

        };


        complaints.unshift(complaint);


        saveComplaints();


        document
            .getElementById("complaintForm")
            .reset();


        clearAIResult();


        showToast(
            `Complaint ${complaint.id} submitted successfully!`
        );


        openSection("myComplaints");

    });


/* ================= GENERATE COMPLAINT ID ================= */

function generateComplaintId() {

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `CMP${randomNumber}`;

}


/* ================= LOCAL STORAGE ================= */

function saveComplaints() {

    localStorage.setItem(
        "campusComplaints",
        JSON.stringify(complaints)
    );

}


/* ================= STUDENT DASHBOARD ================= */

function updateStudentDashboard() {

    const total =
        complaints.length;


    const pending =
        complaints.filter(
            complaint =>
                complaint.status === "Submitted" ||
                complaint.status === "Under Review"
        ).length;


    const progress =
        complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length;


    const resolved =
        complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length;


    document.getElementById("studentTotal").textContent =
        total;

    document.getElementById("studentPending").textContent =
        pending;

    document.getElementById("studentProgress").textContent =
        progress;

    document.getElementById("studentResolved").textContent =
        resolved;


    renderRecentComplaints();

}


/* ================= RECENT STUDENT COMPLAINTS ================= */

function renderRecentComplaints() {

    const container =
        document.getElementById(
            "recentComplaints"
        );


    if (complaints.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    You have not submitted any complaints yet.
                </p>

            </div>

        `;

        return;

    }


    const recent =
        complaints.slice(0, 5);


    container.innerHTML =
        recent
            .map(createComplaintHTML)
            .join("");

}


/* ================= ALL STUDENT COMPLAINTS ================= */

function renderStudentComplaints() {

    const container =
        document.getElementById(
            "allStudentComplaints"
        );


    if (complaints.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    No complaints found.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        complaints
            .map(createComplaintHTML)
            .join("");

}


/* ================= COMPLAINT HTML ================= */

function createComplaintHTML(complaint) {

    return `

        <div class="complaint-item">

            <div class="complaint-info">

                <h4>
                    ${escapeHTML(complaint.title)}
                </h4>

                <p class="complaint-id">
                    ${complaint.id}
                </p>

                <p>
                    Category:
                    ${escapeHTML(complaint.category)}
                </p>

                <p>
                    Location:
                    ${escapeHTML(complaint.location)}
                </p>

                <p>
                    Date:
                    ${complaint.date}
                </p>

            </div>


            <div>

                <span
                    class="status
                    ${getStatusClass(complaint.status)}"
                >
                    ${complaint.status}
                </span>

                <p
                    style="
                    margin-top:8px;
                    font-size:12px;
                    color:#6b7280;
                    "
                >
                    Priority:
                    ${complaint.priority}
                </p>

            </div>

        </div>

    `;

}


/* ================= STATUS CLASS ================= */

function getStatusClass(status) {

    if (status === "Submitted") {

        return "status-submitted";

    }

    if (status === "Under Review") {

        return "status-review";

    }

    if (status === "In Progress") {

        return "status-progress";

    }

    if (status === "Resolved") {

        return "status-resolved";

    }

    return "status-submitted";

}


/* ================= ADMIN DASHBOARD ================= */

function updateAdminDashboard() {

    const total =
        complaints.length;


    const pending =
        complaints.filter(
            complaint =>
                complaint.status === "Submitted" ||
                complaint.status === "Under Review"
        ).length;


    const progress =
        complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length;


    const resolved =
        complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length;


    document.getElementById("adminTotal").textContent =
        total;

    document.getElementById("adminPending").textContent =
        pending;

    document.getElementById("adminProgress").textContent =
        progress;

    document.getElementById("adminResolved").textContent =
        resolved;


    renderAdminRecentComplaints();

}


/* ================= ADMIN RECENT ================= */

function renderAdminRecentComplaints() {

    const container =
        document.getElementById(
            "adminRecentComplaints"
        );


    if (complaints.length === 0) {

        container.innerHTML = `
            <p>No complaints available.</p>
        `;

        return;

    }


    container.innerHTML =
        complaints
            .slice(0, 5)
            .map(function (complaint) {

                return `

                    <div class="complaint-item">

                        <div class="complaint-info">

                            <h4>
                                ${escapeHTML(
                                    complaint.title
                                )}
                            </h4>

                            <p class="complaint-id">
                                ${complaint.id}
                            </p>

                            <p>
                                Category:
                                ${escapeHTML(
                                    complaint.category
                                )}
                            </p>

                        </div>

                        <span
                            class="status
                            ${getStatusClass(
                                complaint.status
                            )}"
                        >
                            ${complaint.status}
                        </span>

                    </div>

                `;

            })
            .join("");

}


/* ================= ADMIN COMPLAINT LIST ================= */

function renderAdminComplaints() {

    const container =
        document.getElementById(
            "adminComplaintsList"
        );


    const search =
        document
            .getElementById("searchComplaint")
            .value
            .toLowerCase();


    const filter =
        document
            .getElementById("statusFilter")
            .value;


    let filtered =
        complaints.filter(function (complaint) {

            const matchesSearch =

                complaint.title
                    .toLowerCase()
                    .includes(search)

                ||

                complaint.id
                    .toLowerCase()
                    .includes(search)

                ||

                complaint.category
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                filter === "All"

                ||

                complaint.status === filter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <p>No complaints found.</p>
        `;

        return;

    }


    container.innerHTML =

        filtered
            .map(function (complaint) {

                return `

                    <div class="admin-complaint">

                        <div>

                            <strong>
                                ${complaint.id}
                            </strong>

                            <br>

                            <span>
                                ${complaint.date}
                            </span>

                        </div>


                        <div>

                            <strong>
                                ${escapeHTML(
                                    complaint.title
                                )}
                            </strong>

                            <br>

                            <span>
                                ${escapeHTML(
                                    complaint.category
                                )}
                            </span>

                        </div>


                        <div>

                            <select
                                class="admin-status"
                                onchange="
                                    updateComplaintStatus(
                                        '${complaint.id}',
                                        this.value
                                    )
                                "
                            >

                                <option
                                    ${
                                        complaint.status ===
                                        "Submitted"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    Submitted
                                </option>

                                <option
                                    ${
                                        complaint.status ===
                                        "Under Review"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    Under Review
                                </option>

                                <option
                                    ${
                                        complaint.status ===
                                        "In Progress"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    In Progress
                                </option>

                                <option
                                    ${
                                        complaint.status ===
                                        "Resolved"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    Resolved
                                </option>

                            </select>

                        </div>


                        <div>

                            <span
                                class="status
                                ${getStatusClass(
                                    complaint.status
                                )}"
                            >
                                ${complaint.status}
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ================= UPDATE STATUS ================= */

function updateComplaintStatus(
    complaintId,
    newStatus
) {

    const complaint =
        complaints.find(
            item =>
                item.id === complaintId
        );


    if (!complaint) {

        return;

    }


    complaint.status =
        newStatus;


    saveComplaints();


    showToast(
        `${complaintId} updated to ${newStatus}`
    );


    renderAdminComplaints();

    updateAdminDashboard();

}


/* ================= AI COMPLAINT ASSISTANT ================= */

function analyzeComplaint() {

    const title =
        document
            .getElementById("complaintTitle")
            .value
            .toLowerCase();


    const description =
        document
            .getElementById("description")
            .value
            .toLowerCase();


    const text =
        title + " " + description;


    if (!text.trim()) {

        showToast(
            "Enter a complaint title or description first."
        );

        return;

    }


    let suggestedCategory =
        "Other";


    let department =
        "General Administration";


    let suggestedPriority =
        "Medium";


    /* Infrastructure */

    if (
        text.includes("projector") ||
        text.includes("bench") ||
        text.includes("classroom") ||
        text.includes("building") ||
        text.includes("chair") ||
        text.includes("door")
    ) {

        suggestedCategory =
            "Infrastructure";

        department =
            "Maintenance";

    }


    /* Internet */

    else if (
        text.includes("wifi") ||
        text.includes("wi-fi") ||
        text.includes("internet") ||
        text.includes("network")
    ) {

        suggestedCategory =
            "Internet / Wi-Fi";

        department =
            "IT Department";

    }


    /* Electricity */

    else if (
        text.includes("fan") ||
        text.includes("light") ||
        text.includes("electricity") ||
        text.includes("power")
    ) {

        suggestedCategory =
            "Electricity";

        department =
            "Electrical Maintenance";

    }


    /* Water */

    else if (
        text.includes("water") ||
        text.includes("tap") ||
        text.includes("leakage")
    ) {

        suggestedCategory =
            "Water";

        department =
            "Maintenance";

    }


    /* Hostel */

    else if (
        text.includes("hostel") ||
        text.includes("room")
    ) {

        suggestedCategory =
            "Hostel";

        department =
            "Hostel Administration";

    }


    /* Canteen */

    else if (
        text.includes("food") ||
        text.includes("canteen") ||
        text.includes("mess")
    ) {

        suggestedCategory =
            "Canteen";

        department =
            "Canteen Management";

    }


    /* Priority */

    if (
        text.includes("emergency") ||
        text.includes("danger") ||
        text.includes("fire") ||
        text.includes("short circuit")
    ) {

        suggestedPriority =
            "High";

    }


    if (
        text.includes("minor") ||
        text.includes("small") ||
        text.includes("slightly")
    ) {

        suggestedPriority =
            "Low";

    }


    const result =
        document.getElementById("aiResult");


    result.innerHTML = `

        <strong>AI Analysis Result</strong>

        <br><br>

        <strong>Suggested Category:</strong>
        ${suggestedCategory}

        <br>

        <strong>Suggested Department:</strong>
        ${department}

        <br>

        <strong>Suggested Priority:</strong>
        ${suggestedPriority}

        <br><br>

        <small>
            This prototype uses rule-based analysis
            to simulate AI-assisted complaint classification.
        </small>

    `;


    result.classList.remove("hidden");

}


/* ================= CLEAR AI RESULT ================= */

function clearAIResult() {

    const result =
        document.getElementById("aiResult");

    result.classList.add("hidden");

    result.innerHTML = "";

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* ================= SECURITY ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* ================= INITIAL DATA ================= */

/*
   Add sample complaints only when
   localStorage has no complaints.
*/

if (complaints.length === 0) {

    complaints = [

        {
            id: "CMP1024",

            title: "Projector not working",

            category: "Infrastructure",

            location: "Block A - Room 204",

            priority: "Medium",

            description:
                "The classroom projector is not displaying anything.",

            status: "In Progress",

            date: new Date().toLocaleDateString(),

            student: "Student"

        },

        {
            id: "CMP1023",

            title: "Wi-Fi connection issue",

            category: "Internet / Wi-Fi",

            location: "Library",

            priority: "High",

            description:
                "Internet connection is not working properly.",

            status: "Under Review",

            date: new Date().toLocaleDateString(),

            student: "Student"

        },

        {
            id: "CMP1022",

            title: "Water leakage",

            category: "Water",

            location: "Hostel Block B",

            priority: "Medium",

            description:
                "There is water leakage near the hostel washroom.",

            status: "Resolved",

            date: new Date().toLocaleDateString(),

            student: "Student"

        }

    ];


    saveComplaints();

}
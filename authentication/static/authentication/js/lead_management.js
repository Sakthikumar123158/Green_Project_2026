/* =====================================================
   LEAD MANAGEMENT - DJANGO VERSION
===================================================== */

let leads = [
    {
        id: 1,
        name: "Priya S",
        phone: "+91 98765 43210",
        email: "priya@gmail.com",
        course: "Data Engineering",
        source: "Instagram",
        status: "New",
        followUp: "25 Sep 2026",
        assignedTo: "Ramesh",
        avatar: "PS"
    },
    {
        id: 2,
        name: "Karthik M",
        phone: "+91 91234 56789",
        email: "karthik@gmail.com",
        course: "Python Full Stack",
        source: "Website",
        status: "Contacted",
        followUp: "24 Sep 2026",
        assignedTo: "Arun",
        avatar: "KM"
    },
    {
        id: 3,
        name: "Divya R",
        phone: "+91 90000 12345",
        email: "divya@gmail.com",
        course: "Data Analytics",
        source: "Referral",
        status: "Interested",
        followUp: "26 Sep 2026",
        assignedTo: "Priya",
        avatar: "DR"
    },
    {
        id: 4,
        name: "Rahul K",
        phone: "+91 98765 11111",
        email: "rahul@gmail.com",
        course: "AWS & DevOps",
        source: "Google",
        status: "Demo Scheduled",
        followUp: "27 Sep 2026",
        assignedTo: "Ramesh",
        avatar: "RK"
    },
    {
        id: 5,
        name: "Aaditya P",
        phone: "+91 98765 22222",
        email: "aaditya@gmail.com",
        course: "Software Testing",
        source: "Instagram",
        status: "Follow-up",
        followUp: "28 Sep 2026",
        assignedTo: "Arun",
        avatar: "AP"
    },
    {
        id: 6,
        name: "Kumar S",
        phone: "+91 98765 33333",
        email: "kumar@gmail.com",
        course: "SQL & PL/SQL",
        source: "Website",
        status: "Converted",
        followUp: "30 Sep 2026",
        assignedTo: "Priya",
        avatar: "KS"
    },
    {
        id: 7,
        name: "Arun Kumar",
        phone: "+91 98765 44444",
        email: "arun@gmail.com",
        course: "Power BI",
        source: "Walk-in",
        status: "Interested",
        followUp: "29 Sep 2026",
        assignedTo: "Ramesh",
        avatar: "AK"
    },
    {
        id: 8,
        name: "Priya R",
        phone: "+91 98765 55555",
        email: "priyar@gmail.com",
        course: "Java Full Stack",
        source: "Referral",
        status: "New",
        followUp: "01 Oct 2026",
        assignedTo: "Arun",
        avatar: "PR"
    }
];

let selectedLead = leads[0];
let selectedStatus = "All";


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    renderLeads();

    setupSearch();

    setupStatusTabs();

    setupFilters();

    setupSort();

    setupAddLeadForm();

    updateStats();

    showLeadDetails(selectedLead);

});


/* =====================================================
   RENDER LEADS
===================================================== */

function renderLeads() {

    const tableBody =
        document.getElementById("leadTableBody");

    if (!tableBody) {
        return;
    }

    const searchValue =
        document
            .getElementById("tableSearch")
            ?.value
            .toLowerCase()
            .trim() || "";

    const course =
        document
            .getElementById("courseFilter")
            ?.value || "All";

    const status =
        document
            .getElementById("statusFilter")
            ?.value || "All";

    const source =
        document
            .getElementById("sourceFilter")
            ?.value || "All";

    const assigned =
        document
            .getElementById("assignedFilter")
            ?.value || "All";


    let filteredLeads = leads.filter(function (lead) {

        const searchMatch =
            !searchValue ||
            lead.name.toLowerCase().includes(searchValue) ||
            lead.phone.toLowerCase().includes(searchValue) ||
            lead.email.toLowerCase().includes(searchValue) ||
            lead.course.toLowerCase().includes(searchValue);

        const tabMatch =
            selectedStatus === "All" ||
            lead.status === selectedStatus;

        const courseMatch =
            course === "All" ||
            lead.course === course;

        const statusMatch =
            status === "All" ||
            lead.status === status;

        const sourceMatch =
            source === "All" ||
            lead.source === source;

        const assignedMatch =
            assigned === "All" ||
            lead.assignedTo === assigned;


        return (
            searchMatch &&
            tabMatch &&
            courseMatch &&
            statusMatch &&
            sourceMatch &&
            assignedMatch
        );

    });


    const sortValue =
        document.getElementById("sortOrder")?.value;


    if (sortValue === "Name A-Z") {

        filteredLeads.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    }

    if (sortValue === "Name Z-A") {

        filteredLeads.sort(function (a, b) {
            return b.name.localeCompare(a.name);
        });

    }


    tableBody.innerHTML = "";


    filteredLeads.forEach(function (lead, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <input type="checkbox">
            </td>

            <td>
                ${index + 1}
            </td>

            <td>
                <div class="lead-name-cell">

                    <div class="table-avatar">
                        ${lead.avatar}
                    </div>

                    <strong>
                        ${lead.name}
                    </strong>

                </div>
            </td>

            <td>
                ${lead.phone}
            </td>

            <td>
                ${lead.course}
            </td>

            <td>
                <span class="status-badge ${getStatusClass(lead.status)}">
                    ${lead.status}
                </span>
            </td>

            <td>
                ${lead.source}
            </td>

            <td>
                ${lead.followUp}
            </td>

            <td>
                ${lead.assignedTo}
            </td>

            <td>

                <button
                    type="button"
                    class="table-action"
                    onclick="selectLead(${lead.id})">
                    View
                </button>

            </td>
        `;


        row.addEventListener("click", function (event) {

            if (
                event.target.tagName !== "BUTTON" &&
                event.target.tagName !== "INPUT"
            ) {

                selectLead(lead.id);

            }

        });


        tableBody.appendChild(row);

    });


    const summary =
        document.getElementById("tableSummary");

    if (summary) {

        summary.textContent =
            `Showing ${filteredLeads.length} of ${leads.length} leads`;

    }

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(" ", "-");

}


/* =====================================================
   SELECT LEAD
===================================================== */

function selectLead(id) {

    selectedLead =
        leads.find(function (lead) {
            return lead.id === id;
        });


    if (!selectedLead) {
        return;
    }


    showLeadDetails(selectedLead);

}


/* =====================================================
   SHOW LEAD DETAILS
===================================================== */

function showLeadDetails(lead) {

    document.getElementById("detailAvatar").textContent =
        lead.avatar;

    document.getElementById("detailName").textContent =
        lead.name;

    document.getElementById("detailPhone").textContent =
        lead.phone;

    document.getElementById("detailEmail").textContent =
        lead.email;

    document.getElementById("detailCourse").textContent =
        lead.course;

    document.getElementById("detailSource").textContent =
        lead.source;


    const statusElement =
        document.getElementById("detailStatus");


    statusElement.textContent =
        lead.status;

    statusElement.className =
        "detail-status " +
        getStatusClass(lead.status);

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const search =
        document.getElementById("tableSearch");

    if (search) {

        search.addEventListener(
            "input",
            renderLeads
        );

    }


    const globalSearch =
        document.getElementById("globalSearch");

    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            function () {

                const tableSearch =
                    document.getElementById("tableSearch");

                if (tableSearch) {

                    tableSearch.value =
                        globalSearch.value;

                    renderLeads();

                }

            }
        );

    }

}


/* =====================================================
   STATUS TABS
===================================================== */

function setupStatusTabs() {

    const tabs =
        document.querySelectorAll(".status-tab");


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                tabs.forEach(function (item) {
                    item.classList.remove("active");
                });

                tab.classList.add("active");

                selectedStatus =
                    tab.dataset.status;

                renderLeads();

            }
        );

    });

}


/* =====================================================
   FILTERS
===================================================== */

function setupFilters() {

    const filters = [

        "courseFilter",
        "statusFilter",
        "sourceFilter",
        "assignedFilter"

    ];


    filters.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "change",
                renderLeads
            );

        }

    });

}


/* =====================================================
   SORT
===================================================== */

function setupSort() {

    const sort =
        document.getElementById("sortOrder");

    if (sort) {

        sort.addEventListener(
            "change",
            renderLeads
        );

    }

}


/* =====================================================
   CLEAR FILTERS
===================================================== */

function clearFilters() {

    document.getElementById("courseFilter").value =
        "All";

    document.getElementById("statusFilter").value =
        "All";

    document.getElementById("sourceFilter").value =
        "All";

    document.getElementById("assignedFilter").value =
        "All";


    selectedStatus = "All";


    document
        .querySelectorAll(".status-tab")
        .forEach(function (tab) {

            tab.classList.remove("active");

        });


    const firstTab =
        document.querySelector(
            '.status-tab[data-status="All"]'
        );


    if (firstTab) {
        firstTab.classList.add("active");
    }


    renderLeads();

}


/* =====================================================
   FILTER SCROLL
===================================================== */

function scrollToFilters() {

    const filterPanel =
        document.getElementById("filterPanel");

    if (filterPanel) {

        filterPanel.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   ADD LEAD MODAL
===================================================== */

function openAddLead() {

    document.getElementById("addLeadModal").style.display =
        "flex";

}


function closeAddLead() {

    document.getElementById("addLeadModal").style.display =
        "none";

}


/* =====================================================
   ADD LEAD FORM
===================================================== */

function setupAddLeadForm() {

    const form =
        document.getElementById("addLeadForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("leadName").value.trim();

            const phone =
                document.getElementById("leadPhone").value.trim();

            const email =
                document.getElementById("leadEmail").value.trim();

            const course =
                document.getElementById("leadCourse").value;

            const source =
                document.getElementById("leadSource").value;

            const status =
                document.getElementById("leadStatus").value;


            const newLead = {

                id:
                    leads.length
                    ? Math.max(...leads.map(l => l.id)) + 1
                    : 1,

                name: name,

                phone: phone,

                email: email,

                course: course,

                source: source,

                status: status,

                followUp: "Not Scheduled",

                assignedTo: "Ramesh",

                avatar:
                    name
                        .substring(0, 2)
                        .toUpperCase()

            };


            leads.unshift(newLead);

            selectedLead = newLead;


            form.reset();

            closeAddLead();

            updateStats();

            renderLeads();

            showLeadDetails(newLead);


            alert("Lead added successfully.");

        }
    );

}


/* =====================================================
   UPDATE STATS
===================================================== */

function updateStats() {

    const total =
        document.getElementById("totalLeads");

    const newLeads =
        document.getElementById("newLeads");

    const converted =
        document.getElementById("convertedLeads");


    if (total) {
        total.textContent = leads.length;
    }


    if (newLeads) {

        newLeads.textContent =
            leads.filter(function (lead) {
                return lead.status === "New";
            }).length;

    }


    if (converted) {

        converted.textContent =
            leads.filter(function (lead) {
                return lead.status === "Converted";
            }).length;

    }

}


/* =====================================================
   FOLLOW-UP
===================================================== */

function openFollowup() {

    if (!selectedLead) {
        return;
    }

    document.getElementById("followupModal").style.display =
        "flex";

}


function closeFollowup() {

    document.getElementById("followupModal").style.display =
        "none";

}


function saveFollowup() {

    const text =
        document.getElementById("followupText").value.trim();


    if (!text) {

        alert("Please enter follow-up details.");

        return;

    }


    closeFollowup();

    document.getElementById("followupText").value = "";

    alert(
        "Follow-up saved for " +
        selectedLead.name
    );

}


/* =====================================================
   UPDATE STATUS
===================================================== */

function toggleLeadStatus() {

    if (!selectedLead) {
        return;
    }


    const statuses = [

        "New",
        "Contacted",
        "Interested",
        "Demo Scheduled",
        "Follow-up",
        "Converted",
        "Lost"

    ];


    const currentIndex =
        statuses.indexOf(selectedLead.status);


    const nextIndex =
        (currentIndex + 1) % statuses.length;


    selectedLead.status =
        statuses[nextIndex];


    renderLeads();

    updateStats();

    showLeadDetails(selectedLead);

}


/* =====================================================
   EXPORT
===================================================== */

function exportLeads() {

    if (!leads.length) {

        alert("There are no leads to export.");

        return;

    }


    const headers = [

        "Name",
        "Phone",
        "Email",
        "Course",
        "Source",
        "Status",
        "Follow-up",
        "Assigned To"

    ];


    const rows =
        leads.map(function (lead) {

            return [

                lead.name,
                lead.phone,
                lead.email,
                lead.course,
                lead.source,
                lead.status,
                lead.followUp,
                lead.assignedTo

            ];

        });


    const csv = [

        headers,

        ...rows

    ]
        .map(function (row) {

            return row
                .map(function (value) {

                    return `"${String(value).replaceAll('"', '""')}"`;

                })
                .join(",");

        })
        .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "greens_technology_leads.csv";


    link.click();


    URL.revokeObjectURL(url);

}


/* =====================================================
   REPORT
===================================================== */

function openReport() {

    const total =
        document.getElementById("reportTotal");

    const newCount =
        document.getElementById("reportNew");

    const interested =
        document.getElementById("reportInterested");

    const converted =
        document.getElementById("reportConverted");


    if (total) {
        total.textContent = leads.length;
    }


    if (newCount) {

        newCount.textContent =
            leads.filter(
                lead => lead.status === "New"
            ).length;

    }


    if (interested) {

        interested.textContent =
            leads.filter(
                lead => lead.status === "Interested"
            ).length;

    }


    if (converted) {

        converted.textContent =
            leads.filter(
                lead => lead.status === "Converted"
            ).length;

    }


    document.getElementById("reportModal").style.display =
        "flex";

}


function closeReport() {

    document.getElementById("reportModal").style.display =
        "none";

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function showNotifications() {

    alert(
        "You have 3 new notifications."
    );

}


/* =====================================================
   HOME
===================================================== */

function goHome() {

    window.location.href = "/";

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    window.location.href = "/logout/";

}
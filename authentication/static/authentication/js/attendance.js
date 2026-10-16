/* =====================================================
   STUDENT + ADMIN ATTENDANCE JAVASCRIPT
   ===================================================== */


/* =====================================================
   SAMPLE ATTENDANCE DATA
   ===================================================== */

const attendanceData = {

    "2026-8-1": "present",
    "2026-8-2": "present",
    "2026-8-3": "present",
    "2026-8-4": "present",
    "2026-8-5": "absent",
    "2026-8-6": "present",
    "2026-8-7": "present",
    "2026-8-8": "present",
    "2026-8-9": "present",
    "2026-8-10": "present",
    "2026-8-11": "present",
    "2026-8-12": "absent",
    "2026-8-13": "present",
    "2026-8-14": "present",
    "2026-8-15": "present",
    "2026-8-16": "present",
    "2026-8-17": "leave",
    "2026-8-18": "present",
    "2026-8-19": "present",
    "2026-8-20": "absent",
    "2026-8-21": "present",
    "2026-8-22": "present",
    "2026-8-23": "present",
    "2026-8-24": "present",
    "2026-8-25": "absent",
    "2026-8-26": "present",
    "2026-8-27": "present",
    "2026-8-28": "present",
    "2026-8-29": "present",
    "2026-8-30": "present"
};


/* =====================================================
   CALENDAR
   ===================================================== */

let currentDate = new Date(2026, 8, 1);


function renderCalendar() {

    const calendar =
        document.getElementById("calendar");

    const monthName =
        document.getElementById("monthName");

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    monthName.textContent =
        currentDate.toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    /* Week days */

    const weekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    weekdays.forEach(function(day) {

        const element =
            document.createElement("div");

        element.className = "weekday";

        element.textContent = day;

        calendar.appendChild(element);

    });


    /* First day */

    const firstDay =
        new Date(year, month, 1).getDay();


    /* Total days */

    const totalDays =
        new Date(year, month + 1, 0).getDate();


    /* Empty spaces */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "day empty";

        calendar.appendChild(empty);
    }


    /* Days */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const element =
            document.createElement("div");

        element.className = "day";

        element.textContent = day;


        const key =
            year + "-" +
            month + "-" +
            day;


        if (attendanceData[key]) {

            element.classList.add(
                attendanceData[key]
            );

        }


        /* September 25 as demo today */

        if (
            year === 2026 &&
            month === 8 &&
            day === 25
        ) {

            element.classList.add("today");

        }


        element.onclick = function() {

            showDay(day);

        };


        calendar.appendChild(element);

    }

}


/* =====================================================
   CHANGE MONTH
   ===================================================== */

function changeMonth(amount) {

    currentDate.setMonth(
        currentDate.getMonth() + amount
    );

    renderCalendar();
}


/* =====================================================
   SHOW DAY
   ===================================================== */

function showDay(day) {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const key =
        year + "-" +
        month + "-" +
        day;


    let status =
        attendanceData[key];


    if (!status) {

        status =
            "No attendance record";

    }


    status =
        status.charAt(0).toUpperCase() +
        status.slice(1);


    alert(
        day + " " +
        currentDate.toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ) +
        "\nStatus: " +
        status
    );
}


/* =====================================================
   TODAY DATE
   ===================================================== */

function loadTodayDate() {

    const today =
        new Date();


    const options = {

        day: "2-digit",
        month: "short",
        year: "numeric"

    };


    document.getElementById(
        "todayDate"
    ).textContent =
        today.toLocaleDateString(
            "en-GB",
            options
        );
}


/* =====================================================
   STUDENT ATTENDANCE MARK
   ===================================================== */

function markAttendance(status) {

    const message =
        document.getElementById(
            "attendanceMessage"
        );


    const now =
        new Date();


    const hour =
        now.getHours();


    /*
       Attendance allowed only until 11 AM.
    */

    if (hour > 11) {

        message.textContent =
            "❌ Attendance time is over. You cannot mark attendance now.";

        message.style.color =
            "#dc2626";

        return;
    }


    if (status === "Present") {

        message.textContent =
            "✓ Attendance marked as Present.";

        message.style.color =
            "#15803d";

    }


    if (status === "Absent") {

        message.textContent =
            "✕ Attendance marked as Absent.";

        message.style.color =
            "#dc2626";

    }

}


/* =====================================================
   STUDENT / ADMIN SWITCH
   ===================================================== */
function showStudent() {

    document
        .getElementById("studentDashboard")
        .classList.remove("hidden");

    document
        .getElementById("adminDashboard")
        .classList.add("hidden");

   const userName = window.USER_NAME || "Student";

document
    .getElementById("profileName")
    .textContent = userName;

document
    .getElementById("profileRole")
    .textContent = "Student";

document
    .getElementById("avatar")
    .textContent = userName
        .substring(0, 2)
        .toUpperCase();

}
/* =====================================================
   ADMIN DASHBOARD
   ===================================================== */

function showStudent() {

    document
        .getElementById("studentDashboard")
        .classList.remove("hidden");

    document
        .getElementById("adminDashboard")
        .classList.add("hidden");

    document
        .getElementById("studentBtn")
        .classList.add("active-role");

    document
        .getElementById("adminBtn")
        .classList.remove("active-role");

    const userName = window.USER_NAME || "Student";

    document
        .getElementById("profileName")
        .textContent = userName;

    document
        .getElementById("profileRole")
        .textContent = "Student";

    document
        .getElementById("avatar")
        .textContent = userName
            .substring(0, 2)
            .toUpperCase();
}

/* =====================================================
   ADMIN VIEW ATTENDANCE
   ===================================================== */

function viewAdminAttendance() {

    const date =
        document.getElementById(
            "adminDate"
        ).value;


    const className =
        document.getElementById(
            "adminClass"
        ).value;


    const section =
        document.getElementById(
            "adminSection"
        ).value;


    const subject =
        document.getElementById(
            "adminSubject"
        ).value;


    if (date === "") {

        alert(
            "Please select a date."
        );

        return;
    }


    document.getElementById(
        "selectedDetails"
    ).textContent =

        "Date: " + date +
        " | Class: " + className +
        " | Section: " + section +
        " | Subject: " + subject;

}


/* =====================================================
   ADMIN SEARCH
   ===================================================== */

function searchAdminStudents() {

    const input =
        document.getElementById(
            "adminSearch"
        );


    const filter =
        input.value.toLowerCase();


    const table =
        document.getElementById(
            "adminTable"
        );


    const rows =
        table.getElementsByTagName(
            "tr"
        );


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const nameCell =
            rows[i]
                .getElementsByTagName("td")[1];


        if (nameCell) {

            const name =
                nameCell.textContent
                    .toLowerCase();


            if (
                name.includes(filter)
            ) {

                rows[i].style.display =
                    "";

            } else {

                rows[i].style.display =
                    "none";

            }

        }

    }

}


/* =====================================================
   GENERAL NAVIGATION
   ===================================================== */

function go(page) {

    event.preventDefault();


    if (page === "Attendance") {

        return;

    }


    alert(
        page +
        " page navigation will be connected to Django later."
    );

}


/* =====================================================
   LEAD MANAGEMENT
   ===================================================== */


/* =====================================================
   LOGOUT
   ===================================================== */

function logout(event) {

    event.preventDefault();


    alert(
        "Logout will be connected to Django authentication later."
    );

}


/* =====================================================
   NOTIFICATION
   ===================================================== */

function showNotification() {

    alert(
        "You have new attendance notifications."
    );

}


/* =====================================================
   MOBILE SIDEBAR
   ===================================================== */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("open");

}


/* =====================================================
   GLOBAL SEARCH
   ===================================================== */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function() {

            const value =
                this.value.toLowerCase();


            document
                .querySelectorAll("tbody tr")
                .forEach(function(row) {

                    row.style.display =
                        row.innerText
                            .toLowerCase()
                            .includes(value)
                            ? ""
                            : "none";

                });

        }
    );


function showAdmin() {
    document.getElementById("studentDashboard").classList.add("hidden");
    document.getElementById("adminDashboard").classList.remove("hidden");

    const studentBtn = document.getElementById("studentBtn");
    const adminBtn = document.getElementById("adminBtn");

    if (studentBtn) studentBtn.classList.remove("active-role");
    if (adminBtn) adminBtn.classList.add("active-role");

    const userName = window.USER_NAME || "Admin";

    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");
    const avatar = document.getElementById("avatar");

    if (profileName) profileName.textContent = userName;
    if (profileRole) profileRole.textContent = "Admin";
    if (avatar) avatar.textContent = userName.substring(0, 2).toUpperCase();
}


/* =====================================================
   INITIAL LOAD
   ===================================================== */

/* =====================================================
   INITIAL LOAD
   ===================================================== */

renderCalendar();



loadTodayDate();

if (window.USER_ROLE === "admin") {
    showAdmin();
} else {
    showStudent();
}

console.log("ATTENDANCE JS LOADED");
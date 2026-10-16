
/* =====================================================
   PAGE NAVIGATION
===================================================== */

function go(page){
  event.preventDefault();

  if(page === "Attendance"){
    return;
  }

  if(page === "Quiz"){
    window.location.href = "/quiz/";
    return;
  }

  alert(page + " page navigation will be connected to Django later.");
}

/* =====================================================
   LEAD MANAGEMENT
===================================================== */
function leadManagement(event) {
    if (event) {
        event.preventDefault();
    }

    window.location.href = "/lead-management/";
}
/* =====================================================
   LOGOUT
===================================================== */


/* =====================================================
   LOGOUT
===================================================== */

function logout(event) {
    if (event) {
        event.preventDefault();
    }

    const logoutModal = document.getElementById("logoutModal");

    if (logoutModal) {
        logoutModal.hidden = false;
    }
}


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification() {

    alert(
        "You have 3 new notifications."
    );
}


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const value =
            this.value.toLowerCase().trim();

        const cards =
            document.querySelectorAll(".quick-card");

        cards.forEach(card => {

            const text =
                card.innerText.toLowerCase();

            if (text.includes(value)) {
                card.style.display = "";
            }
            else {
                card.style.display = "none";
            }

        });

    });


/* =====================================================
   QUICK ACTIONS
===================================================== */

function startQuiz() {

    alert(
        "Python Quiz - Module 2 will open here."
    );
}


function viewDetails() {

    alert(
        "Data Engineering Class details will open here."
    );
}


function prepareResume() {

    alert(
        "Resume preparation will open here."
    );
}


function exploreAll() {

    alert(
        "Explore All will show all available modules."
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

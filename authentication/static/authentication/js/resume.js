/* =====================================================
   RESUME DATA
===================================================== */

let resumeData = {

    personal:{
        name:"",
        email:"",
        phone:"",
        location:"",
        linkedin:""
    },

    education:[],

    skills:[],

    experience:[],

    projects:[],

    certifications:[],

    summary:""

};


/* =====================================================
   CURRENT STEP
===================================================== */

let currentStep = 1;


/* =====================================================
   ADMIN SAMPLE DATA
===================================================== */

let adminResumes = [

    {
        id:1,
        name:"Arun Kumar",
        course:"B.Tech CSE",
        updated:"27 Sep 2026",
        score:82,
        status:"Pending",
        email:"arun@gmail.com",
        skills:["Java","Python","React","SQL"],
        summary:"Computer Science student interested in software development."
    },

    {
        id:2,
        name:"Priya Sharma",
        course:"B.E CSE",
        updated:"26 Sep 2026",
        score:91,
        status:"Approved",
        email:"priya@gmail.com",
        skills:["JavaScript","React","Node.js","MongoDB"],
        summary:"Frontend developer with strong React and JavaScript skills."
    },

    {
        id:3,
        name:"Rahul Kumar",
        course:"B.Sc IT",
        updated:"25 Sep 2026",
        score:58,
        status:"Need Update",
        email:"rahul@gmail.com",
        skills:["HTML","CSS","Java"],
        summary:"IT student looking for software development opportunities."
    },

    {
        id:4,
        name:"Divya S",
        course:"B.Tech IT",
        updated:"24 Sep 2026",
        score:76,
        status:"Pending",
        email:"divya@gmail.com",
        skills:["Python","Django","SQL"],
        summary:"IT student interested in backend development."
    }

];


let selectedAdminResumeId = null;


/* =====================================================
   ROLE SWITCH
===================================================== */

function switchRole(role){

    const studentView =
        document.getElementById("studentView");

    const adminView =
        document.getElementById("adminView");

    const profileName =
        document.getElementById("profileName");

    const profileRole =
        document.getElementById("profileRole");

    const profileAvatar =
        document.getElementById("profileAvatar");


    if(role === "admin"){

        studentView.style.display = "none";
        adminView.style.display = "block";
profileName.textContent = "Admin";
profileRole.textContent = "Admin";
profileAvatar.textContent = "AD";

        renderAdminTable();

    }else{

        studentView.style.display = "block";
        adminView.style.display = "none";

        profileName.textContent =
            window.USER_NAME || "Student";

        profileRole.textContent =
            window.USER_ROLE || "Student";

        profileAvatar.textContent =
            (window.USER_NAME || "Student")
                .substring(0, 2)
                .toUpperCase();
    }
}


/* =====================================================
   SHOW STEP
===================================================== */

function showStep(step){

    currentStep = step;


    document
        .querySelectorAll(".step-content")
        .forEach(function(el){

            el.style.display = "none";

        });


    const selectedStep =
        document.getElementById("step" + step);


    if(selectedStep){

        selectedStep.style.display = "block";

    }


    document
        .querySelectorAll(".step")
        .forEach(function(btn,index){

            btn.classList.toggle(
                "active",
                index + 1 === step
            );

        });

}


/* =====================================================
   NEXT
===================================================== */

function nextStep(){

    if(currentStep < 7){

        currentStep++;

        showStep(currentStep);

    }

}


/* =====================================================
   PREVIOUS
===================================================== */

function previousStep(){

    if(currentStep > 1){

        currentStep--;

        showStep(currentStep);

    }

}


/* =====================================================
   PERSONAL DATA
===================================================== */

function updatePersonalData(){

    resumeData.personal.name =
        document.getElementById("name").value;

    resumeData.personal.email =
        document.getElementById("email").value;

    resumeData.personal.phone =
        document.getElementById("phone").value;

    resumeData.personal.location =
        document.getElementById("location").value;

    resumeData.personal.linkedin =
        document.getElementById("linkedin").value;

}


/* =====================================================
   UPDATE PREVIEW
===================================================== */

function updatePreview(){

    updatePersonalData();


    resumeData.summary =
        document.getElementById("summary").value;


    document.getElementById("previewName").textContent =
        resumeData.personal.name || "Your Name";


    let contact = [];


    if(resumeData.personal.email){
        contact.push(resumeData.personal.email);
    }

    if(resumeData.personal.phone){
        contact.push(resumeData.personal.phone);
    }

    if(resumeData.personal.location){
        contact.push(resumeData.personal.location);
    }

    if(resumeData.personal.linkedin){
        contact.push(resumeData.personal.linkedin);
    }


    document.getElementById("previewContact").textContent =
        contact.length
            ? contact.join(" | ")
            : "Email | Phone | Location | LinkedIn";


    /* SUMMARY */

    const summarySection =
        document.getElementById(
            "previewSummarySection"
        );


    if(resumeData.summary.trim()){

        summarySection.style.display = "block";

        document.getElementById(
            "previewSummary"
        ).textContent = resumeData.summary;

    }else{

        summarySection.style.display = "none";

    }


    /* SKILLS */

    const skillsSection =
        document.getElementById(
            "previewSkillsSection"
        );


    if(resumeData.skills.length){

        skillsSection.style.display = "block";

        document.getElementById(
            "previewSkills"
        ).textContent =
            resumeData.skills.join(" • ");

    }else{

        skillsSection.style.display = "none";

    }


    renderPreviewEducation();

    renderPreviewExperience();

    renderPreviewProjects();

    renderPreviewCertifications();

}


/* =====================================================
   EDUCATION
===================================================== */

function addEducation(){

    const degree =
        document.getElementById("degree").value.trim();

    const institution =
        document.getElementById("institution").value.trim();

    const field =
        document.getElementById("field").value.trim();

    const score =
        document.getElementById("score").value.trim();

    const start =
        document.getElementById("eduStart").value.trim();

    const end =
        document.getElementById("eduEnd").value.trim();


    if(!degree && !institution){

        alert("Please enter Degree and Institution.");

        return;

    }


    resumeData.education.push({

        degree,
        institution,
        field,
        score,
        start,
        end

    });


    document.getElementById("degree").value = "";

    document.getElementById("institution").value = "";

    document.getElementById("field").value = "";

    document.getElementById("score").value = "";

    document.getElementById("eduStart").value = "";

    document.getElementById("eduEnd").value = "";


    renderEducation();

    updatePreview();

}


function renderEducation(){

    const list =
        document.getElementById(
            "educationList"
        );

    list.innerHTML = "";


    resumeData.education.forEach(
        function(item,index){

            const div =
                document.createElement("div");

            div.className = "resume-item";


            div.innerHTML = `

                <div class="resume-item-top">

                    <div>

                        <div class="item-title">
                            ${escapeHTML(item.degree)}
                        </div>

                        <div class="item-small">
                            ${escapeHTML(item.institution)}
                            ${item.field ? " • " + escapeHTML(item.field) : ""}
                            ${item.score ? " • " + escapeHTML(item.score) : ""}
                        </div>

                        <div class="item-small">
                            ${escapeHTML(item.start)}
                            ${item.end ? " - " + escapeHTML(item.end) : ""}
                        </div>

                    </div>

                    <button
                        class="danger-btn"
                        onclick="deleteEducation(${index})">

                        Delete

                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}


function deleteEducation(index){

    resumeData.education.splice(index,1);

    renderEducation();

    updatePreview();

}


/* =====================================================
   SKILLS
===================================================== */

function addSkill(){

    const input =
        document.getElementById("skillInput");

    const skill =
        input.value.trim();


    if(!skill){

        alert("Please enter a skill.");

        return;

    }


    resumeData.skills.push(skill);

    input.value = "";


    renderSkills();

    updatePreview();

}


function renderSkills(){

    const list =
        document.getElementById("skillsList");

    list.innerHTML = "";


    resumeData.skills.forEach(
        function(skill,index){

            const div =
                document.createElement("div");

            div.className = "resume-item";


            div.innerHTML = `

                <div class="resume-item-top">

                    <div class="item-title">
                        ${escapeHTML(skill)}
                    </div>

                    <button
                        class="danger-btn"
                        onclick="deleteSkill(${index})">

                        Delete

                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}


function deleteSkill(index){

    resumeData.skills.splice(index,1);

    renderSkills();

    updatePreview();

}


/* =====================================================
   EXPERIENCE
===================================================== */

function addExperience(){

    const role =
        document.getElementById("jobRole").value.trim();

    const company =
        document.getElementById("company").value.trim();

    const location =
        document.getElementById("jobLocation").value.trim();

    const start =
        document.getElementById("jobStart").value.trim();

    const end =
        document.getElementById("jobEnd").value.trim();

    const description =
        document.getElementById("jobDescription").value.trim();


    if(!role && !company){

        alert("Please enter Job Role and Company.");

        return;

    }


    resumeData.experience.push({

        role,
        company,
        location,
        start,
        end,
        description

    });


    document.getElementById("jobRole").value = "";

    document.getElementById("company").value = "";

    document.getElementById("jobLocation").value = "";

    document.getElementById("jobStart").value = "";

    document.getElementById("jobEnd").value = "";

    document.getElementById("jobDescription").value = "";


    renderExperience();

    updatePreview();

}


function renderExperience(){

    const list =
        document.getElementById(
            "experienceList"
        );

    list.innerHTML = "";


    resumeData.experience.forEach(
        function(item,index){

            const div =
                document.createElement("div");

            div.className = "resume-item";


            div.innerHTML = `

                <div class="resume-item-top">

                    <div>

                        <div class="item-title">
                            ${escapeHTML(item.role)}
                        </div>

                        <div class="item-small">
                            ${escapeHTML(item.company)}
                            ${item.location ? " • " + escapeHTML(item.location) : ""}
                        </div>

                        <div class="item-small">
                            ${escapeHTML(item.start)}
                            ${item.end ? " - " + escapeHTML(item.end) : ""}
                        </div>

                        ${
                            item.description
                                ? `<div class="item-small">${escapeHTML(item.description)}</div>`
                                : ""
                        }

                    </div>

                    <button
                        class="danger-btn"
                        onclick="deleteExperience(${index})">

                        Delete

                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}


function deleteExperience(index){

    resumeData.experience.splice(index,1);

    renderExperience();

    updatePreview();

}


/* =====================================================
   PROJECTS
===================================================== */

function addProject(){

    const name =
        document.getElementById("projectName").value.trim();

    const tech =
        document.getElementById("projectTech").value.trim();

    const description =
        document.getElementById("projectDescription").value.trim();


    if(!name){

        alert("Please enter Project Name.");

        return;

    }


    resumeData.projects.push({

        name,
        tech,
        description

    });


    document.getElementById("projectName").value = "";

    document.getElementById("projectTech").value = "";

    document.getElementById("projectDescription").value = "";


    renderProjects();

    updatePreview();

}


function renderProjects(){

    const list =
        document.getElementById("projectsList");

    list.innerHTML = "";


    resumeData.projects.forEach(
        function(item,index){

            const div =
                document.createElement("div");

            div.className = "resume-item";


            div.innerHTML = `

                <div class="resume-item-top">

                    <div>

                        <div class="item-title">
                            ${escapeHTML(item.name)}
                        </div>

                        <div class="item-small">
                            ${escapeHTML(item.tech)}
                        </div>

                        ${
                            item.description
                                ? `<div class="item-small">${escapeHTML(item.description)}</div>`
                                : ""
                        }

                    </div>

                    <button
                        class="danger-btn"
                        onclick="deleteProject(${index})">

                        Delete

                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}


function deleteProject(index){

    resumeData.projects.splice(index,1);

    renderProjects();

    updatePreview();

}


/* =====================================================
   CERTIFICATIONS
===================================================== */

function addCertification(){

    const name =
        document.getElementById("certName").value.trim();

    const issuer =
        document.getElementById("certIssuer").value.trim();

    const date =
        document.getElementById("certDate").value.trim();


    if(!name){

        alert("Please enter Certification Name.");

        return;

    }


    resumeData.certifications.push({

        name,
        issuer,
        date

    });


    document.getElementById("certName").value = "";

    document.getElementById("certIssuer").value = "";

    document.getElementById("certDate").value = "";


    renderCertifications();

    updatePreview();

}


function renderCertifications(){

    const list =
        document.getElementById(
            "certificationsList"
        );

    list.innerHTML = "";


    resumeData.certifications.forEach(
        function(item,index){

            const div =
                document.createElement("div");

            div.className = "resume-item";


            div.innerHTML = `

                <div class="resume-item-top">

                    <div>

                        <div class="item-title">
                            ${escapeHTML(item.name)}
                        </div>

                        <div class="item-small">
                            ${escapeHTML(item.issuer)}
                            ${item.date ? " • " + escapeHTML(item.date) : ""}
                        </div>

                    </div>

                    <button
                        class="danger-btn"
                        onclick="deleteCertification(${index})">

                        Delete

                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}


function deleteCertification(index){

    resumeData.certifications.splice(index,1);

    renderCertifications();

    updatePreview();

}


/* =====================================================
   PREVIEW EDUCATION
===================================================== */

function renderPreviewEducation(){

    const section =
        document.getElementById(
            "previewEducationSection"
        );

    const container =
        document.getElementById(
            "previewEducation"
        );


    if(!resumeData.education.length){

        section.style.display = "none";

        return;

    }


    section.style.display = "block";

    container.innerHTML = "";


    resumeData.education.forEach(
        function(item){

            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(item.degree)}
                </strong>

                <span>
                    ${escapeHTML(item.institution)}
                    ${item.field ? " • " + escapeHTML(item.field) : ""}
                    ${item.score ? " • " + escapeHTML(item.score) : ""}
                </span>

                <span>
                    ${escapeHTML(item.start)}
                    ${item.end ? " - " + escapeHTML(item.end) : ""}
                </span>

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================================
   PREVIEW EXPERIENCE
===================================================== */

function renderPreviewExperience(){

    const section =
        document.getElementById(
            "previewExperienceSection"
        );

    const container =
        document.getElementById(
            "previewExperience"
        );


    if(!resumeData.experience.length){

        section.style.display = "none";

        return;

    }


    section.style.display = "block";

    container.innerHTML = "";


    resumeData.experience.forEach(
        function(item){

            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(item.role)}
                </strong>

                <span>
                    ${escapeHTML(item.company)}
                    ${item.location ? " • " + escapeHTML(item.location) : ""}
                </span>

                <span>
                    ${escapeHTML(item.start)}
                    ${item.end ? " - " + escapeHTML(item.end) : ""}
                </span>

                ${
                    item.description
                        ? `<span>${escapeHTML(item.description)}</span>`
                        : ""
                }

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================================
   PREVIEW PROJECTS
===================================================== */

function renderPreviewProjects(){

    const section =
        document.getElementById(
            "previewProjectsSection"
        );

    const container =
        document.getElementById(
            "previewProjects"
        );


    if(!resumeData.projects.length){

        section.style.display = "none";

        return;

    }


    section.style.display = "block";

    container.innerHTML = "";


    resumeData.projects.forEach(
        function(item){

            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <span>
                    ${escapeHTML(item.tech)}
                </span>

                ${
                    item.description
                        ? `<span>${escapeHTML(item.description)}</span>`
                        : ""
                }

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================================
   PREVIEW CERTIFICATIONS
===================================================== */

function renderPreviewCertifications(){

    const section =
        document.getElementById(
            "previewCertificationsSection"
        );

    const container =
        document.getElementById(
            "previewCertifications"
        );


    if(!resumeData.certifications.length){

        section.style.display = "none";

        return;

    }


    section.style.display = "block";

    container.innerHTML = "";


    resumeData.certifications.forEach(
        function(item){

            const div =
                document.createElement("div");

            div.className = "preview-item";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <span>
                    ${escapeHTML(item.issuer)}
                    ${item.date ? " • " + escapeHTML(item.date) : ""}
                </span>

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================================
   SAVE DRAFT
===================================================== */

function saveDraft(){

    updatePreview();


    localStorage.setItem(
        "greens_resume_data",
        JSON.stringify(resumeData)
    );


    alert("Resume draft saved successfully.");

}


/* =====================================================
   LOAD DRAFT
===================================================== */

function loadDraft(){

    const saved =
        localStorage.getItem(
            "greens_resume_data"
        );


    if(!saved){

        alert("No saved resume found.");

        return;

    }


    try{

        resumeData = JSON.parse(saved);


        resumeData.personal =
            resumeData.personal || {};

        resumeData.education =
            Array.isArray(resumeData.education)
                ? resumeData.education
                : [];

        resumeData.skills =
            Array.isArray(resumeData.skills)
                ? resumeData.skills
                : [];

        resumeData.experience =
            Array.isArray(resumeData.experience)
                ? resumeData.experience
                : [];

        resumeData.projects =
            Array.isArray(resumeData.projects)
                ? resumeData.projects
                : [];

        resumeData.certifications =
            Array.isArray(resumeData.certifications)
                ? resumeData.certifications
                : [];


        fillFormFromData();

        renderEducation();

        renderSkills();

        renderExperience();

        renderProjects();

        renderCertifications();

        updatePreview();


        alert("Resume draft loaded successfully.");

    }catch(error){

        console.error(error);

        alert("Unable to load saved resume.");

    }

}


/* =====================================================
   FILL FORM
===================================================== */

function fillFormFromData(){

    document.getElementById("name").value =
        resumeData.personal.name || "";

    document.getElementById("email").value =
        resumeData.personal.email || "";

    document.getElementById("phone").value =
        resumeData.personal.phone || "";

    document.getElementById("location").value =
        resumeData.personal.location || "";

    document.getElementById("linkedin").value =
        resumeData.personal.linkedin || "";

    document.getElementById("summary").value =
        resumeData.summary || "";

}


/* =====================================================
   CLEAR DRAFT
===================================================== */

function clearDraft(){

    if(!confirm(
        "Clear the complete resume draft?"
    )){

        return;

    }


    localStorage.removeItem(
        "greens_resume_data"
    );


    resumeData = {

        personal:{
            name:"",
            email:"",
            phone:"",
            location:"",
            linkedin:""
        },

        education:[],
        skills:[],
        experience:[],
        projects:[],
        certifications:[],
        summary:""

    };


    fillFormFromData();

    renderEducation();

    renderSkills();

    renderExperience();

    renderProjects();

    renderCertifications();

    updatePreview();


    /*
       IMPORTANT:
       Clear button also resets match score.
    */

    document.getElementById(
        "matchScore"
    ).textContent = "0%";


    document.getElementById(
        "jobDescriptionBox"
    ).value = "";


    alert("Resume draft cleared.");

}


/* =====================================================
   ANALYZE RESUME

   IMPORTANT:
   SCORE CHANGES ONLY WHEN THIS FUNCTION RUNS.
   THIS FUNCTION IS CALLED ONLY BY:
   Analyze Resume BUTTON.
===================================================== */

function analyzeResume() {
    // Current form values sync
    updatePreview();

   const jobDescription = document
    .getElementById("jobDescriptionBox")
    .value
    .trim()
    .toLowerCase();

    if (!jobDescription) {
        alert("Please enter a Job Description first.");
        return;
    }

    // Get all resume content
    let resumeText = "";

    resumeText += " " + (resumeData.personal?.name || "");
    resumeText += " " + (resumeData.personal?.email || "");
    resumeText += " " + (resumeData.personal?.phone || "");

    // Education
    resumeData.education.forEach(item => {
        if (typeof item === "string") {
            resumeText += " " + item;
        } else {
            resumeText += " " + Object.values(item).join(" ");
        }
    });

    // Skills
    resumeData.skills.forEach(item => {
        if (typeof item === "string") {
            resumeText += " " + item;
        } else if (item && typeof item === "object") {
            resumeText += " " + Object.values(item).join(" ");
        }
    });

    // Experience
    resumeData.experience.forEach(item => {
        if (typeof item === "string") {
            resumeText += " " + item;
        } else {
            resumeText += " " + Object.values(item).join(" ");
        }
    });

    // Projects
    resumeData.projects.forEach(item => {
        if (typeof item === "string") {
            resumeText += " " + item;
        } else {
            resumeText += " " + Object.values(item).join(" ");
        }
    });

    // Certifications
    resumeData.certifications.forEach(item => {
        if (typeof item === "string") {
            resumeText += " " + item;
        } else {
            resumeText += " " + Object.values(item).join(" ");
        }
    });

    // Summary
    resumeText += " " + (resumeData.summary || "");

    resumeText = resumeText.toLowerCase();

    // Common words - don't count these as keywords
    const stopWords = new Set([
        "the", "and", "for", "with", "that", "this",
        "are", "you", "your", "our", "from", "will",
        "have", "has", "can", "who", "what", "where",
        "when", "into", "using", "use", "work",
        "working", "experience", "required", "looking",
        "job", "role", "candidate", "should", "must",
        "good", "strong", "knowledge", "ability",
        "years", "year", "team", "skills"
    ]);

    // Extract useful words
    const jobWords = jobDescription
        .replace(/[^a-zA-Z0-9+#.]/g, " ")
        .split(/\s+/)
        .filter(word =>
            word.length >= 2 &&
            !stopWords.has(word)
        );

    // Remove duplicate keywords
    const uniqueJobWords = [...new Set(jobWords)];

    if (uniqueJobWords.length === 0) {
        alert("Please enter a proper Job Description.");
        return;
    }

    // Find matching keywords
    const matchedWords = uniqueJobWords.filter(word =>
        resumeText.includes(word)
    );

    const score = Math.round(
        (matchedWords.length / uniqueJobWords.length) * 100
    );

    // Show score
    const scoreElement = document.getElementById("matchScore");

    if (scoreElement) {
        scoreElement.textContent = score + "%";
    }

    // Show analysis message
    const messageElement = document.getElementById("analysisMessage");

    if (messageElement) {
        messageElement.textContent =
            `Matched ${matchedWords.length} out of ${uniqueJobWords.length} important keywords.`;
    }

    // Optional console information
    console.log("Job Keywords:", uniqueJobWords);
    console.log("Matched Keywords:", matchedWords);
    console.log("Match Score:", score + "%");
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value){

    return String(value || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =====================================================
   SIDEBAR
===================================================== */

function toggleSidebar(){

    document
        .getElementById("sidebar")
        .classList.toggle("open");

}


/* =====================================================
   NAVIGATION
===================================================== */

function goPage(event,page){

    event.preventDefault();


    alert(
        page +
        " page navigation will be connected to Django later."
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logout(event){

    event.preventDefault();


    alert(
        "Logout will be connected to Django authentication later."
    );

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(){

    alert(
        "Your resume draft is ready to continue."
    );

}


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function(){

            const value =
                this.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(".step")
                .forEach(
                    function(button){

                        button.style.display =
                            !value ||
                            button.innerText
                                .toLowerCase()
                                .includes(value)
                                ? ""
                                : "none";

                    }
                );

        }
    );


/* =====================================================
   ADMIN SEARCH
===================================================== */

document
    .getElementById("adminSearch")
    .addEventListener(
        "input",
        function(){

            renderAdminTable();

        }
    );


/* =====================================================
   ADMIN STATUS FILTER
===================================================== */

document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        function(){

            renderAdminTable();

        }
    );


/* =====================================================
   ADMIN TABLE
===================================================== */

function renderAdminTable(){

    const tbody =
        document.getElementById(
            "adminTableBody"
        );


    const search =
        document.getElementById(
            "adminSearch"
        ).value
        .toLowerCase()
        .trim();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        adminResumes.filter(
            function(item){

                const matchesSearch =
                    !search ||
                    item.name
                        .toLowerCase()
                        .includes(search) ||
                    item.course
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    status === "all" ||
                    item.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    tbody.innerHTML = "";


    if(!filtered.length){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;color:#9ca3af">

                    No resumes found.

                </td>

            </tr>

        `;

    }else{

        filtered.forEach(
            function(item){

                const row =
                    document.createElement("tr");


                let statusClass =
                    "status-pending";


                if(item.status === "Approved"){

                    statusClass =
                        "status-approved";

                }

                if(item.status === "Need Update"){

                    statusClass =
                        "status-update";

                }


                row.innerHTML = `

                    <td>

                        <div class="student-name">
                            ${escapeHTML(item.name)}
                        </div>

                    </td>

                    <td>
                        ${escapeHTML(item.course)}
                    </td>

                    <td>
                        ${escapeHTML(item.updated)}
                    </td>

                    <td>

                        <span class="score-badge">
                            ${item.score}%
                        </span>

                    </td>

                    <td>

                        <span
                            class="status-badge ${statusClass}">

                            ${escapeHTML(item.status)}

                        </span>

                    </td>

                    <td>

                        <button
                            class="view-btn"
                            onclick="viewAdminResume(${item.id})">

                            Review

                        </button>

                    </td>

                `;


                tbody.appendChild(row);

            }
        );

    }


    updateAdminStats();

}


/* =====================================================
   ADMIN STATS
===================================================== */

function updateAdminStats(){

    const total =
        adminResumes.length;


    const pending =
        adminResumes.filter(
            function(item){
                return item.status === "Pending";
            }
        ).length;


    const approved =
        adminResumes.filter(
            function(item){
                return item.status === "Approved";
            }
        ).length;


    const needUpdate =
        adminResumes.filter(
            function(item){
                return item.status === "Need Update";
            }
        ).length;


    document.getElementById(
        "totalResumes"
    ).textContent = total;


    document.getElementById(
        "pendingResumes"
    ).textContent = pending;


    document.getElementById(
        "approvedResumes"
    ).textContent = approved;


    document.getElementById(
        "updateResumes"
    ).textContent = needUpdate;

}


/* =====================================================
   VIEW ADMIN RESUME
===================================================== */

function viewAdminResume(id){

    selectedAdminResumeId = id;


    const item =
        adminResumes.find(
            function(resume){

                return resume.id === id;

            }
        );


    if(!item){

        return;

    }


    const modalBody =
        document.getElementById(
            "modalBody"
        );


    modalBody.innerHTML = `

        <div class="modal-section">

            <h4>
                STUDENT
            </h4>

            <p>
                <strong>${escapeHTML(item.name)}</strong>
            </p>

            <p>
                ${escapeHTML(item.course)}
            </p>

        </div>


        <div class="modal-section">

            <h4>
                EMAIL
            </h4>

            <p>
                ${escapeHTML(item.email)}
            </p>

        </div>


        <div class="modal-section">

            <h4>
                RESUME SCORE
            </h4>

            <p>
                <strong>${item.score}%</strong>
            </p>

        </div>


        <div class="modal-section">

            <h4>
                SKILLS
            </h4>

            <p>
                ${item.skills.map(escapeHTML).join(" • ")}
            </p>

        </div>


        <div class="modal-section">

            <h4>
                PROFESSIONAL SUMMARY
            </h4>

            <p>
                ${escapeHTML(item.summary)}
            </p>

        </div>


        <div class="modal-section">

            <h4>
                CURRENT STATUS
            </h4>

            <p>
                ${escapeHTML(item.status)}
            </p>

        </div>

    `;


    document.getElementById(
        "adminModal"
    ).style.display = "flex";

}


/* =====================================================
   CLOSE ADMIN MODAL
===================================================== */

function closeAdminModal(){

    document.getElementById(
        "adminModal"
    ).style.display = "none";


    selectedAdminResumeId = null;

}


/* =====================================================
   APPROVE RESUME
===================================================== */

function approveResume(){

    if(!selectedAdminResumeId){

        return;

    }


    const item =
        adminResumes.find(
            function(resume){

                return resume.id ===
                    selectedAdminResumeId;

            }
        );


    if(item){

        item.status = "Approved";

        item.updated = "Just now";

    }


    renderAdminTable();

    closeAdminModal();


    alert(
        "Resume approved successfully."
    );

}


/* =====================================================
   REQUEST UPDATE
===================================================== */

function requestUpdate(){

    if(!selectedAdminResumeId){

        return;

    }


    const item =
        adminResumes.find(
            function(resume){

                return resume.id ===
                    selectedAdminResumeId;

            }
        );


    if(item){

        item.status = "Need Update";

        item.updated = "Just now";

    }


    renderAdminTable();

    closeAdminModal();


    alert(
        "Student resume marked as Need Update."
    );

}


/* =====================================================
   INITIAL LOAD
===================================================== */


/* =====================================================
   INITIAL LOAD
===================================================== */

switchRole(
    window.USER_ROLE === "admin"
        ? "admin"
        : "student"
);

renderEducation();
renderSkills();
renderExperience();
renderProjects();
renderCertifications();
updatePreview();
showStep(1);
updateAdminStats();
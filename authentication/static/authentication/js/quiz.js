/* Quiz UI and demo persistence. Replace QuizStore methods with Django API calls for integration. */
(() => {

    'use strict';

    const STUDENT = window.STUDENT || {
        name: 'User',
        id: ''
    };

    const KEYS = {
        attempts: 'greensFrontendQuizAttemptsV1',
        session: 'greensFrontendQuizSessionV1'
    };
  const QUIZZES = {
    frontend: { name:'Frontend Development Assessment', bank:window.QUESTION_BANK || [] },
    'python-backend': { name:'Python Backend Assessment', bank:window.PYTHON_BACKEND_QUESTION_BANK || [] }
  };
  const QUIZ_MINUTES = 20;
  const PASS_PERCENT = 70;
  
  const demoAttempts = [
    { id:'demo-1', studentName:'Priya S', studentId:'GT2026-0108', quiz:'Frontend Development Assessment', submittedAt:'2026-09-25T10:18:00', score:18, total:20, percent:90, timeSeconds:748, status:'Passed' },
    { id:'demo-2', studentName:'Karthik M', studentId:'GT2026-0114', quiz:'Frontend Development Assessment', submittedAt:'2026-09-24T14:05:00', score:14, total:20, percent:70, timeSeconds:963, status:'Passed' },
    { id:'demo-3', studentName:'Divya R', studentId:'GT2026-0120', quiz:'Frontend Development Assessment', submittedAt:'2026-09-23T11:42:00', score:12, total:20, percent:60, timeSeconds:1102, status:'Needs improvement' },
    { id:'demo-4', studentName:'Suresh K', studentId:'GT2026-0097', quiz:'Frontend Development Assessment', submittedAt:'2026-09-22T09:30:00', score:16, total:20, percent:80, timeSeconds:835, status:'Passed' },
    { id:'demo-5', studentName:'Meena T', studentId:'GT2026-0132', quiz:'Frontend Development Assessment', submittedAt:'2026-09-20T15:17:00', score:13, total:20, percent:65, timeSeconds:1050, status:'Needs improvement' },
    { id:'demo-6', studentName:'Arun Kumar', studentId:STUDENT.id, quiz:'Frontend Development Assessment', submittedAt:'2026-09-19T12:27:00', score:16, total:20, percent:80, timeSeconds:921, status:'Passed' }
  ];

  const QuizStore = {
    getAttempts() {
      try { return JSON.parse(localStorage.getItem(KEYS.attempts) || '[]'); }
      catch { return []; }
    },
    saveAttempt(attempt) {
      const attempts = this.getAttempts();
      attempts.unshift(attempt);
      localStorage.setItem(KEYS.attempts, JSON.stringify(attempts));
    },
    getSession() {
      try { return JSON.parse(localStorage.getItem(KEYS.session) || 'null'); }
      catch { return null; }
    },
    saveSession(session) { localStorage.setItem(KEYS.session, JSON.stringify(session)); },
    clearSession() { localStorage.removeItem(KEYS.session); }
  };

  const $ = (id) => document.getElementById(id);
  const state = {
    role: window.USER_ROLE === 'admin' ? 'admin' : 'student',
    panel: 'availablePanel',
    quizKey: 'frontend',
    session: null,
    timer: null,
    toastTimer: null
};
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatDate = (date) => new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(date));
  const formatTime = (seconds) => `${Math.floor(seconds/60)}m ${String(seconds%60).padStart(2,'0')}s`;
  const allAttempts = () => [...QuizStore.getAttempts(), ...demoAttempts];
  const realStudentAttempts = () => QuizStore.getAttempts().filter(a => a.studentId === STUDENT.id);

  function toast(message) {
    const box = $('toast'); box.textContent = message; box.classList.add('visible');
    clearTimeout(state.toastTimer); state.toastTimer = setTimeout(() => box.classList.remove('visible'), 2800);
  }
  function showModal(html, onOpen) {
    $('modalContent').innerHTML = html; $('modalBackdrop').hidden = false;
    $('modalClose').focus(); if (onOpen) onOpen();
  }
  function closeModal() { $('modalBackdrop').hidden = true; }
  function showPanel(id) {
    state.panel = id;
    document.querySelectorAll('.tab').forEach(tab => {
      const active = tab.dataset.panel === id;
      tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('#studentView .panel').forEach(panel => panel.classList.toggle('active', panel.id === id));
    if (id === 'attemptsPanel') renderMyAttempts();
    if (id === 'performancePanel') renderStudentPerformance();
    if (id === 'topicsPanel') renderTopics();
  }
  function setRole(role) {

    state.role = role;

    $('studentView').classList.toggle('hidden', role !== 'student');
    $('adminView').classList.toggle('hidden', role !== 'admin');
    //$('demoBanner').classList.toggle('hidden', role !== 'student');
    const demoBanner = $('demoBanner');
if (demoBanner) {
    demoBanner.classList.toggle('hidden', role !== 'student');
}

//     $('userName').textContent =
//         role === 'admin' ? 'Admin' : STUDENT.name;

//     $('userRole').textContent =
//         role === 'admin' ? 'Admin' : 'Student';

//     $('avatar').textContent =
//         role === 'admin' ? 'AD' : 'AK';

//     if (role === 'admin') {
//         renderAdmin();
//     }

//     $('sidebar').classList.remove('open');
//     $('menuToggle').setAttribute('aria-expanded', 'false');
// }

const userName = $('userName');
if (userName) {
    userName.textContent = role === 'admin' ? 'Admin' : STUDENT.name;
}

const userRole = $('userRole');
if (userRole) {
    userRole.textContent = role === 'admin' ? 'Admin' : 'Student';
}

const avatar = $('avatar');
if (avatar) {
    avatar.textContent = role === 'admin' ? 'AD' : 'AK';
}

if (role === 'admin') {
    renderAdmin();
}

const sidebar = $('sidebar');
if (sidebar) {
    sidebar.classList.remove('open');
}

const menuToggle = $('menuToggle');
if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
}
}
  function openInstructions() {
    const saved = QuizStore.getSession();
    const hasActive = saved && saved.endsAt > Date.now();
    const existing = hasActive ? saved : null;
    const resume = Boolean(existing && (existing.quizKey || 'frontend') === state.quizKey);
    const otherActive = Boolean(existing && !resume);
    const selectedQuiz = QUIZZES[state.quizKey];
    showModal(`<h2 id="modalTitle">${resume||otherActive?'Resume your saved quiz?':'Before you begin'}</h2>
      <p>${resume?'An in-progress attempt was saved in this browser. Continue with the time remaining or end it.':otherActive?`You already have an active ${escapeHtml(existing.quiz)} attempt. Resume it or end it before starting another quiz.`:`You are about to start the ${escapeHtml(selectedQuiz.name)}.`}</p>
      <ul class="modal-list"><li>20 questions randomly selected from a bank of 100 unique questions.</li><li>20 minutes from the moment you start. The quiz submits automatically at zero.</li><li>Use question navigation and mark items to review.</li><li>Submit manually when you are ready. Unanswered questions count as incorrect.</li></ul>
      <div class="modal-actions">${existing?'<button class="button outline" id="discardSession">End saved attempt</button>':''}<button class="button primary" id="beginQuiz">${resume||otherActive?'Resume saved quiz':'Start 20-minute quiz'}</button></div>`, () => {
        $('beginQuiz').onclick = () => { closeModal(); if (existing) restoreSession(existing); else startQuiz(); };
        const discard = $('discardSession'); if (discard) discard.onclick = () => { QuizStore.clearSession(); state.session=null; closeModal(); startQuiz(); };
      });
  }
  function sampleQuestions(bank) {
    const pool = [...bank];
    for (let i=pool.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
    return pool.slice(0,20);
  }
  function startQuiz() {
    const quiz = QUIZZES[state.quizKey];
    if (!quiz || quiz.bank.length < 100) { toast(`Question bank error for ${quiz?.name || 'this quiz'}: expected 100 questions, found ${quiz?.bank.length || 0}.`); return; }
    const now = Date.now();
    state.session = { id:`attempt-${now}`, quizKey:state.quizKey, studentName:STUDENT.name, studentId:STUDENT.id, quiz:quiz.name,
      questionIds:sampleQuestions(quiz.bank).map(q=>q.id), answers:{}, visited:[0], review:[], current:0,
      startedAt:now, endsAt:now+QUIZ_MINUTES*60*1000 };
    QuizStore.saveSession(state.session); renderQuiz(); startTimer();
  }
  function restoreSession(session) {
    state.session = session;
    state.quizKey = session.quizKey || 'frontend';
    if (session.endsAt <= Date.now()) { submitQuiz(true); return; }
    renderQuiz(); startTimer(); toast('Your saved quiz has been restored.');
  }
  function questionAt(index) { const id=state.session.questionIds[index]; return QUIZZES[state.session.quizKey || 'frontend'].bank.find(q=>q.id===id); }
  function renderQuiz() {
    const s=state.session, current=s.current, q=questionAt(current);
    if (!q) { toast('This saved attempt could not be loaded.'); QuizStore.clearSession(); state.session=null; return; }
    const answered=Object.keys(s.answers).length, flagged=s.review.length;
    const navigation=s.questionIds.map((_,i)=>{
      const classes=['question-number']; if(i===current)classes.push('current'); else if(s.answers[s.questionIds[i]]!==undefined)classes.push('answered'); else if(s.visited.includes(i))classes.push('visited'); else classes.push('unvisited'); if(s.review.includes(i))classes.push('review');
      return `<button class="${classes.join(' ')}" data-question-index="${i}" aria-label="Question ${i+1}${s.answers[s.questionIds[i]]!==undefined?', answered':''}${s.review.includes(i)?', marked for review':''}${i===current?', current':''}">${i+1}</button>`;
    }).join('');
    const selected=s.answers[q.id];
    const choices=q.a.map((answer,i)=>`<button class="answer-option ${selected===i?'selected':''}" data-choice="${i}" aria-pressed="${selected===i}"><span class="answer-radio" aria-hidden="true"></span><span>${escapeHtml(answer)}</span></button>`).join('');
    $('availablePanel').innerHTML=`<article class="quiz-card card"><span class="quiz-icon">&lt;/&gt;</span><div class="quiz-description"><h2>${escapeHtml(s.quiz)}</h2><div class="quiz-facts"><span>▤ 20 Questions</span><span>◷ 20 Minutes</span><span>${escapeHtml(q.topic)}</span><span class="tag">In progress</span></div></div><span class="badge">Attempt in progress</span></article>
      <div class="quiz-layout" style="margin-top:14px"><section class="card question-nav"><h3>Question Navigation</h3><div class="number-grid">${navigation}</div><div class="question-legend"><span><i class="legend-dot green"></i>Current question</span><span><i class="legend-dot"></i>Not answered</span><span><i class="legend-dot blue"></i>Answered</span><span><i class="legend-dot red"></i>Marked for review</span></div><p class="muted" style="margin-top:16px">${answered} answered · ${20-answered} unanswered · ${flagged} for review</p></section>
      <section class="card question-card"><div class="quiz-question-head"><span>Question ${current+1} of 20 <span class="muted">· ${escapeHtml(q.topic)}</span></span><button class="review-toggle ${s.review.includes(current)?'on':''}" id="reviewQuestion">${s.review.includes(current)?'⚑ Marked for Review':'♧ Mark for Review'}</button></div><h2>${escapeHtml(q.q)}</h2><div class="answers" role="group" aria-label="Answer choices">${choices}</div><div class="quiz-controls"><button class="button outline" id="previousQuestion" ${current===0?'disabled':''}>← &nbsp;Previous</button><button class="button primary" id="nextQuestion">${current===19?'Review & Submit':'Next &nbsp;→'}</button></div></section>
      <div class="quiz-side-stack"><section class="card quiz-side-card"><div class="timer-flex"><div class="timer-icon">◷</div><div><div class="timer-label">Time Remaining</div><div class="timer-value" id="timerValue">20:00</div></div></div><div class="progress-line"><i id="timerBar" style="width:100%"></i></div><div class="auto-hint">This quiz submits automatically when the timer reaches zero.</div></section><section class="card quiz-side-card"><h3>Quiz Progress <span style="float:right;font-weight:500" id="answeredCount">${answered} / 20</span></h3><div class="progress-line"><i id="answerProgress" style="width:${answered*5}%"></i></div><div class="progress-info"><span id="answerPercent">${answered*5}% complete</span><span>${flagged} for review</span></div><button class="button outline submit-small" id="submitQuiz">Submit quiz</button></section></div></div>`;
    $('availablePanel').querySelectorAll('[data-question-index]').forEach(button=>button.onclick=()=>{s.current=Number(button.dataset.questionIndex);if(!s.visited.includes(s.current))s.visited.push(s.current);persistAndRender();});
    $('availablePanel').querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{s.answers[q.id]=Number(button.dataset.choice);persistAndRender();});
    $('reviewQuestion').onclick=()=>{s.review=s.review.includes(current)?s.review.filter(i=>i!==current):[...s.review,current];persistAndRender();};
    $('previousQuestion').onclick=()=>{if(s.current>0){s.current--;if(!s.visited.includes(s.current))s.visited.push(s.current);persistAndRender();}};
    $('nextQuestion').onclick=()=>{if(s.current<19){s.current++;if(!s.visited.includes(s.current))s.visited.push(s.current);persistAndRender();}else openSubmitConfirmation();};
    $('submitQuiz').onclick=openSubmitConfirmation;
    updateTimerDisplay();
  }
  function persistAndRender(){QuizStore.saveSession(state.session);renderQuiz();}
  function openSubmitConfirmation(){
    const unanswered=20-Object.keys(state.session.answers).length;
    showModal(`<h2 id="modalTitle">Submit your quiz?</h2><p>${unanswered?`You have <b>${unanswered} unanswered question${unanswered===1?'':'s'}</b>. Unanswered questions count as incorrect.`:'You have answered all 20 questions.'} Your score will be saved once you submit.</p><div class="modal-actions"><button class="button outline" id="keepQuiz">Keep working</button><button class="button primary" id="confirmSubmit">Submit quiz</button></div>`,()=>{$('keepQuiz').onclick=closeModal;$('confirmSubmit').onclick=()=>{closeModal();submitQuiz(false);};});
  }
  function startTimer(){clearInterval(state.timer);state.timer=setInterval(()=>{if(!state.session)return;const left=state.session.endsAt-Date.now();if(left<=0){submitQuiz(true);return;}updateTimerDisplay();},250);}
  function updateTimerDisplay(){
    if(!state.session)return;const left=Math.max(0,state.session.endsAt-Date.now()),total=QUIZ_MINUTES*60;
    const minutes=Math.floor(left/60000),seconds=Math.floor((left%60000)/1000),timer=$('timerValue');
    if(timer){timer.textContent=`${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;timer.classList.toggle('warning',left<=60000);$('timerBar').style.width=`${Math.max(0,left/total*100)}%`;}
  }
  function submitQuiz(automatic){
    if(!state.session)return;clearInterval(state.timer);state.timer=null;
    const s=state.session, bank=QUIZZES[s.quizKey || 'frontend'].bank, questionRecords=s.questionIds.map(id=>{const q=bank.find(item=>item.id===id);const chosen=s.answers[id]??null;return {questionId:id,topic:q.topic,question:q.q,options:q.a,selected:chosen,correctIndex:q.c,isCorrect:chosen===q.c};});
    const score=questionRecords.filter(q=>q.isCorrect).length, percent=Math.round(score/20*100), elapsed=Math.max(0,QUIZ_MINUTES*60-Math.ceil(Math.max(0,s.endsAt-Date.now())/1000));
    const attempt={id:s.id,studentName:s.studentName,studentId:s.studentId,quiz:s.quiz,submittedAt:new Date().toISOString(),score,total:20,percent,timeSeconds:elapsed,status:percent>=PASS_PERCENT?'Passed':'Needs improvement',automatic,questions:questionRecords};
    QuizStore.saveAttempt(attempt);QuizStore.clearSession();state.session=null;
    $('availablePanel').innerHTML=`<div class="card instructions"><h2>Attempt submitted</h2><p class="muted">${automatic?'Time expired. Your quiz was submitted automatically.':'Your answers have been submitted and saved.'}</p><div class="modal-actions" style="justify-content:flex-start"><button class="button primary" id="retakeQuiz">Start another attempt</button><button class="button outline" id="viewMyAttempts">View my attempts</button></div></div>`;
    $('viewMyAttempts').onclick=()=>showPanel('attemptsPanel');$('retakeQuiz').onclick=openInstructions;
    showModal(`<div class="result-icon" style="width:54px;height:54px;display:grid;place-items:center;border-radius:50%;background:#e8f6ed;color:#087442;font-size:27px;margin-bottom:13px">${percent>=PASS_PERCENT?'✓':'!'}</div><h2 id="modalTitle">${automatic?'Time is up — quiz submitted':'Quiz submitted'}</h2><p>${attempt.status}. Your result has been saved to My Attempts.</p><div class="result-number">${score} / 20</div><p>${percent}% · ${formatTime(elapsed)} taken</p><div class="result-stats"><div><b>${score}</b><small>Correct</small></div><div><b>${20-score}</b><small>Incorrect or unanswered</small></div><div><b>${Object.keys(s.answers).length}</b><small>Answered</small></div></div><div class="modal-actions"><button class="button primary" id="resultDone">Done</button></div>`,()=>{$('resultDone').onclick=()=>{closeModal();showPanel('attemptsPanel');};});
    renderAdmin();
  }

  function renderMyAttempts(){
    const attempts=realStudentAttempts(), filter=$('myAttemptFilter').value;
    const rows=attempts.filter(a=>filter==='all'||(filter==='pass'?a.percent>=PASS_PERCENT:a.percent<PASS_PERCENT));
    $('myAttemptsBody').innerHTML=rows.length?rows.map(a=>`<tr><td><b>${escapeHtml(a.quiz)}</b></td><td>${formatDate(a.submittedAt)}</td><td>${a.score} / ${a.total}</td><td>${formatTime(a.timeSeconds)}</td><td><span class="result-pill ${a.percent<PASS_PERCENT?'fail':''}">${escapeHtml(a.status)}</span></td></tr>`).join(''):'<tr><td class="empty-cell" colspan="5">No attempts yet. Start the available quiz to see your results here.</td></tr>';
  }
  function renderStudentPerformance(){
    const attempts=realStudentAttempts(), avg=attempts.length?Math.round(attempts.reduce((n,a)=>n+a.percent,0)/attempts.length):0, best=attempts.length?Math.max(...attempts.map(a=>a.percent)):0;
    $('studentStats').innerHTML=`<article class="card stat-card"><small>Average score</small><strong>${avg}%</strong><em>${attempts.length?`${attempts.length} completed attempt${attempts.length===1?'':'s'}`:'No attempts yet'}</em></article><article class="card stat-card"><small>Quizzes completed</small><strong>${attempts.length}</strong><em>Frontend Development</em></article><article class="card stat-card"><small>Best score</small><strong>${best}%</strong><em>${attempts.length?'Keep building your skills':'Take a quiz to get started'}</em></article>`;
    $('studentPerformance').innerHTML=attempts.length?attempts.slice(0,5).map(a=>`<div class="score-bar"><b>${a.percent}%</b><i style="height:${Math.max(5,a.percent)}%"></i><small>${formatDate(a.submittedAt)}</small></div>`).join(''):'<p class="muted">Your submitted quiz scores will appear here.</p>';
  }
  function renderTopics(){
    const attempts=realStudentAttempts(), totals={};
    attempts.forEach(a=>(a.questions||[]).forEach(q=>{totals[q.topic]??={answered:0,correct:0};if(q.selected!==null){totals[q.topic].answered++;if(q.isCorrect)totals[q.topic].correct++;}}));
    const rows=Object.entries(totals).map(([topic,x])=>{const pct=x.answered?Math.round(x.correct/x.answered*100):0;const advice=pct>=85?'Excellent work':pct>=70?'Keep practicing':'Review fundamentals';return `<tr><td>${escapeHtml(topic)}</td><td>${x.answered}</td><td>${x.correct}</td><td>${pct}%</td><td>${advice}</td></tr>`;});
    $('topicRows').innerHTML=rows.length?rows.join(''):'<tr><td colspan="5" class="empty-cell">Topic analysis will appear after you submit a quiz.</td></tr>';
  }

  function filteredAdminAttempts(){
    const search=$('adminSearch').value.trim().toLowerCase(), status=$('statusFilter').value, quiz=$('quizFilter').value, from=$('dateFrom').value, to=$('dateTo').value;
    return allAttempts().filter(a=>{
      const text=`${a.studentName} ${a.studentId} ${a.quiz}`.toLowerCase();const day=new Date(a.submittedAt).toISOString().slice(0,10);
      return (!search||text.includes(search))&&(quiz==='all'||a.quiz===quiz)&&(status==='all'||(status==='pass'?a.percent>=PASS_PERCENT:a.percent<PASS_PERCENT))&&(!from||day>=from)&&(!to||day<=to);
    }).sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));
  }
  function renderAdmin(){
    const attempts=allAttempts(), filtered=filteredAdminAttempts(), avg=attempts.length?Math.round(attempts.reduce((n,a)=>n+a.percent,0)/attempts.length):0, passed=attempts.filter(a=>a.percent>=PASS_PERCENT).length, passRate=attempts.length?Math.round(passed/attempts.length*100):0;
    $('adminStats').innerHTML=`<article class="card stat-card"><small>Total attempts</small><strong>${attempts.length}</strong><em>Across all students</em></article><article class="card stat-card"><small>Average score</small><strong>${avg}%</strong><em>All recorded attempts</em></article><article class="card stat-card"><small>Pass rate</small><strong>${passRate}%</strong><em>Pass mark: ${PASS_PERCENT}%</em></article>`;
    $('adminRows').innerHTML=filtered.length?filtered.map(a=>`<tr><td><b>${escapeHtml(a.studentName)}</b><br><span class="muted">${escapeHtml(a.studentId)}</span></td><td>${escapeHtml(a.quiz)}</td><td>${formatDate(a.submittedAt)}</td><td>${a.score} / ${a.total}</td><td>${a.percent}%</td><td>${formatTime(a.timeSeconds)}</td><td><span class="result-pill ${a.percent<PASS_PERCENT?'fail':''}">${escapeHtml(a.status)}</span></td><td><button class="detail-button" data-attempt="${escapeHtml(a.id)}">View details</button></td></tr>`).join(''):'<tr><td class="empty-cell" colspan="8">No student results match these filters.</td></tr>';
    $('resultCount').textContent=`Showing ${filtered.length} of ${attempts.length} attempts`;
    document.querySelectorAll('[data-attempt]').forEach(button=>button.onclick=()=>showAttemptDetails(button.dataset.attempt));
  }
  function showAttemptDetails(id){
    const attempt=allAttempts().find(a=>a.id===id);if(!attempt)return;
    const questions=attempt.questions||[];
    const detail=questions.length?questions.map((q,i)=>{const given=q.selected===null?'Unanswered':q.options[q.selected];const correct=q.options[q.correctIndex];return `<div class="question-review"><b>${i+1}. ${escapeHtml(q.question)}</b><span class="${q.isCorrect?'correct-answer':'wrong-answer'}">Student: ${escapeHtml(given)} ${q.isCorrect?'✓':'✗'}</span><br><span class="correct-answer">Correct answer: ${escapeHtml(correct)}</span></div>`;}).join(''):'<p class="muted">This sample record contains score summary only. Detailed responses are available for attempts submitted in this browser.</p>';
    showModal(`<h2 id="modalTitle">Attempt details</h2><p><b>${escapeHtml(attempt.studentName)}</b> · ${escapeHtml(attempt.studentId)}<br>${escapeHtml(attempt.quiz)} · ${formatDate(attempt.submittedAt)} · ${attempt.score}/${attempt.total} (${attempt.percent}%)</p><div style="max-height:48vh;overflow:auto">${detail}</div><div class="modal-actions"><button class="button outline" id="closeDetails">Close</button></div>`,()=>{$('closeDetails').onclick=closeModal;});
  }
  function exportCsv(){
    const rows=filteredAdminAttempts();if(!rows.length){toast('There are no filtered results to export.');return;}
    const headers=['Student name','Student ID','Quiz','Submitted','Score','Total','Percentage','Time taken (seconds)','Status'];
    const csv=[headers,...rows.map(a=>[a.studentName,a.studentId,a.quiz,a.submittedAt,a.score,a.total,a.percent,a.timeSeconds,a.status])].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='greens-frontend-quiz-results.csv';link.click();URL.revokeObjectURL(url);toast('Results exported as CSV.');
  }

  function bindEvents(){
    document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>showPanel(tab.dataset.panel)));
const roleSelect = $('roleSelect');

if (roleSelect) {
    roleSelect.addEventListener('change', e => setRole(e.target.value));
}
    document.querySelectorAll('.start-button').forEach(button=>button.onclick=()=>{state.quizKey=button.dataset.quiz || 'frontend';openInstructions();});
    $('instructionsStart').onclick=()=>{state.quizKey='frontend';openInstructions();};
    $('myAttemptFilter').onchange=renderMyAttempts;
    ['adminSearch','quizFilter','statusFilter','dateFrom','dateTo'].forEach(id=>$(id).addEventListener('input',renderAdmin));
    $('clearFilters').onclick=()=>{['adminSearch','dateFrom','dateTo'].forEach(id=>$(id).value='');$('quizFilter').value='all';$('statusFilter').value='all';renderAdmin();};
    $('exportCsv').onclick=exportCsv;
    $('modalClose').onclick=closeModal;$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('modalBackdrop').hidden)closeModal();});
    // $('menuToggle').onclick=()=>{const open=$('sidebar').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(open));};
    const menuToggle = $('menuToggle');
if (menuToggle) menuToggle.onclick = () => {const open=$('sidebar').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(open));};

    document.querySelectorAll('[data-placeholder]').forEach(link=>link.onclick=e=>{e.preventDefault();toast(`${link.dataset.placeholder} connects to its platform module.`);$('sidebar').classList.remove('open');});
   
    const notificationBtn = $('notificationBtn');
if (notificationBtn) {
    notificationBtn.onclick = () => toast('You are all caught up.');
}
    
const globalSearch = $('globalSearch');

if (globalSearch) {
    globalSearch.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;

        const query = e.target.value.trim().toLowerCase();

        if (state.role === 'admin') {
            $('adminSearch').value = query;
            renderAdmin();
            return;
        }

        if (!query) {
            toast('Enter a topic to search.');
            return;
        }

        const found = Object.values(QUIZZES)
            .flatMap(quiz => quiz.bank)
            .find(q =>
                q.topic.toLowerCase().includes(query) ||
                q.q.toLowerCase().includes(query)
            );

        if (found) {
            showPanel('availablePanel');
            toast(`Question bank topic: ${found.topic}.`);
        } else {
            toast('No matching quiz topic found.');
        }
    });
}

    window.addEventListener('beforeunload',e=>{if(state.session){e.preventDefault();e.returnValue='';}});
  }
 function init(){

    bindEvents();

  setRole(
    String(window.USER_ROLE || '').trim().toLowerCase() === 'admin'
        ? 'admin'
        : 'student'
);

    Object.values(QUIZZES).forEach(quiz=>{
        if(quiz.bank.length!==100)
            console.error(`Expected 100 questions for ${quiz.name}; loaded ${quiz.bank.length}.`);
    });

    const saved=QuizStore.getSession();

    if(saved&&saved.endsAt>Date.now()){
        state.session=saved;
        openInstructions();
    }
    else if(saved){QuizStore.saveSession(saved);state.session=saved;submitQuiz(true);}
    renderMyAttempts();renderStudentPerformance();renderTopics();renderAdmin();
  }
  init();
})();

/**
 * HPProcessServerPapers (HPPSP) - JavaScript Examination Engine
 * Simulates the official 50-question, 60-minute Screening Test
 * Strictly client-side, zero backend required, offline resilient.
 */
(function(window, document) {
  'use strict';

  class HPPSPExamEngine {
    constructor(options) {
      this.containerId = options.containerId || 'exam-app';
      this.dataFile = options.dataFile || 'data/questions/hp-process-server-2022.json';
      this.totalQuestions = options.totalQuestions || 50;
      this.durationMinutes = options.durationMinutes || 60;
      this.testTitle = options.testTitle || 'HP High Court Process Server Screening Test';
      
      this.questions = [];
      this.currentIndex = 0;
      this.userAnswers = {};      // questionId -> selectedOptionIndex (0-3)
      this.questionStatus = {};   // questionId -> 'not-visited' | 'not-answered' | 'answered' | 'review'
      
      this.timeRemaining = this.durationMinutes * 60;
      this.timerInterval = null;
      this.isSubmitted = false;
      this.startTime = Date.now();

      this.init();
    }

    async init() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      container.innerHTML = '<div style="text-align:center;padding:50px;"><div class="stat-value" style="font-size:1.5rem;margin-bottom:10px;">Loading Examination Questions...</div><p>Preparing the official 50-mark screening test environment...</p></div>';

      try {
        // Resolve path via config if available
        let fetchUrl = this.dataFile;
        if (window.HPPSP_CONFIG) {
          fetchUrl = window.HPPSP_CONFIG.resolvePath(this.dataFile);
        }

        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        
        // Take up to totalQuestions
        this.questions = data.slice(0, this.totalQuestions);
        
        // Initialize status
        this.questions.forEach((q, idx) => {
          this.questionStatus[q.id] = idx === 0 ? 'not-answered' : 'not-visited';
        });

        this.renderExamInterface();
        this.startTimer();
      } catch (err) {
        console.error('Failed to load examination questions', err);
        container.innerHTML = `
          <div style="background:#fee2e2;border:1px solid #f87171;color:#b91c1c;padding:30px;border-radius:12px;text-align:center;">
            <h3 style="color:#991b1b;margin-bottom:10px;">Unable to Load Examination Data</h3>
            <p>Please check your network or local environment. Error: ${err.message}</p>
            <button class="btn btn-primary" onclick="location.reload()" style="margin-top:15px;">Retry Loading</button>
          </div>
        `;
      }
    }

    startTimer() {
      const timerDisplay = document.getElementById('exam-timer');
      if (!timerDisplay) return;

      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
          this.autoSubmit();
          return;
        }

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = formatted;

        // Visual warning when under 5 minutes (300s)
        if (this.timeRemaining <= 300) {
          timerDisplay.classList.add('animate-pulse');
        }
      }, 1000);
    }

    renderExamInterface() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      container.innerHTML = `
        <div class="exam-status-bar">
          <div>
            <h2 style="font-size:1.35rem;margin-bottom:4px;">${this.testTitle}</h2>
            <span class="badge badge-blue">Official 10+2 Standard Screening</span>
          </div>
          <div class="timer-box" id="exam-timer-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span id="exam-timer">60:00</span>
          </div>
        </div>

        <div class="exam-container">
          <!-- Main Question Box -->
          <div class="exam-main">
            <div id="question-render-area"></div>
            
            <div class="exam-controls">
              <button class="btn btn-secondary" id="btn-prev">
                &larr; Previous
              </button>
              <button class="btn btn-secondary" id="btn-clear">
                Clear Response
              </button>
              <button class="btn btn-secondary" id="btn-review" style="color:#7c3aed;border-color:#c4b5fd;">
                Mark for Review
              </button>
              <button class="btn btn-primary" id="btn-next">
                Save &amp; Next &rarr;
              </button>
            </div>
          </div>

          <!-- Sidebar Palette -->
          <div class="exam-sidebar">
            <h3 style="font-size:1.05rem;margin-bottom:12px;">Question Palette</h3>
            
            <div class="palette-legend">
              <div class="legend-item"><div class="legend-dot dot-answered"></div> Answered</div>
              <div class="legend-item"><div class="legend-dot dot-not-answered"></div> Not Answered</div>
              <div class="legend-item"><div class="legend-dot dot-review"></div> Review</div>
              <div class="legend-item"><div class="legend-dot dot-not-visited"></div> Not Visited</div>
            </div>

            <div class="palette-grid" id="palette-grid"></div>

            <div style="margin-top:auto;padding-top:20px;border-top:1px solid var(--border-light);">
              <button class="btn btn-accent" id="btn-submit-exam" style="width:100%;">
                Submit Examination
              </button>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
      this.displayCurrentQuestion();
      this.renderPalette();
    }

    bindEvents() {
      document.getElementById('btn-prev').addEventListener('click', () => this.navigate(-1));
      document.getElementById('btn-next').addEventListener('click', () => this.navigate(1));
      document.getElementById('btn-clear').addEventListener('click', () => this.clearCurrentResponse());
      document.getElementById('btn-review').addEventListener('click', () => this.markForReview());
      document.getElementById('btn-submit-exam').addEventListener('click', () => this.confirmSubmit());
    }

    displayCurrentQuestion() {
      const q = this.questions[this.currentIndex];
      const area = document.getElementById('question-render-area');
      if (!q || !area) return;

      // Update question status to not-answered if it was not-visited
      if (this.questionStatus[q.id] === 'not-visited') {
        this.questionStatus[q.id] = 'not-answered';
      }

      const selectedOption = this.userAnswers[q.id];

      area.innerHTML = `
        <div class="question-box animate-fade-in">
          <div class="question-header">
            <span class="question-number">Question ${this.currentIndex + 1} of ${this.questions.length}</span>
            <span class="badge badge-amber">${q.subject} • ${q.topic || 'General'}</span>
          </div>
          <div class="question-text">${q.question}</div>
          <div class="options-list">
            ${q.options.map((opt, optIndex) => `
              <label class="option-item ${selectedOption === optIndex ? 'selected' : ''}" data-index="${optIndex}">
                <input type="radio" name="opt_${q.id}" class="option-radio" value="${optIndex}" ${selectedOption === optIndex ? 'checked' : ''}>
                <span class="option-label"><strong>${String.fromCharCode(65 + optIndex)}.</strong> ${opt}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;

      // Option click event
      const optionLabels = area.querySelectorAll('.option-item');
      optionLabels.forEach(label => {
        label.addEventListener('click', (e) => {
          const idx = parseInt(label.getAttribute('data-index'), 10);
          this.selectOption(q.id, idx);
        });
      });

      // Update Prev button disabled status on first question
      const prevBtn = document.getElementById('btn-prev');
      if (prevBtn) {
        prevBtn.disabled = (this.currentIndex === 0);
        prevBtn.style.opacity = (this.currentIndex === 0) ? '0.5' : '1';
      }

      this.renderPalette();
    }

    selectOption(questionId, optionIndex) {
      this.userAnswers[questionId] = optionIndex;
      this.questionStatus[questionId] = 'answered';

      // Update UI classes
      const area = document.getElementById('question-render-area');
      if (area) {
        area.querySelectorAll('.option-item').forEach((item, idx) => {
          if (idx === optionIndex) {
            item.classList.add('selected');
            item.querySelector('input').checked = true;
          } else {
            item.classList.remove('selected');
          }
        });
      }

      this.renderPalette();
    }

    clearCurrentResponse() {
      const q = this.questions[this.currentIndex];
      if (!q) return;

      delete this.userAnswers[q.id];
      this.questionStatus[q.id] = 'not-answered';
      this.displayCurrentQuestion();
    }

    markForReview() {
      const q = this.questions[this.currentIndex];
      if (!q) return;

      this.questionStatus[q.id] = 'review';
      this.navigate(1);
    }

    navigate(direction) {
      const nextIndex = this.currentIndex + direction;
      if (nextIndex >= 0 && nextIndex < this.questions.length) {
        this.currentIndex = nextIndex;
        this.displayCurrentQuestion();
      }
    }

    jumpToQuestion(index) {
      if (index >= 0 && index < this.questions.length) {
        this.currentIndex = index;
        this.displayCurrentQuestion();
      }
    }

    renderPalette() {
      const grid = document.getElementById('palette-grid');
      if (!grid) return;

      grid.innerHTML = this.questions.map((q, idx) => {
        const status = this.questionStatus[q.id] || 'not-visited';
        const isCurrent = idx === this.currentIndex;
        return `
          <button class="palette-btn ${status} ${isCurrent ? 'current' : ''}" data-index="${idx}" title="Question ${idx + 1}">
            ${idx + 1}
          </button>
        `;
      }).join('');

      grid.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          this.jumpToQuestion(idx);
        });
      });
    }

    confirmSubmit() {
      let answered = 0;
      let review = 0;
      let unattempted = 0;

      this.questions.forEach(q => {
        const s = this.questionStatus[q.id];
        if (s === 'answered') answered++;
        else if (s === 'review') review++;
        else unattempted++;
      });

      const confirmed = window.confirm(
        `Are you sure you want to submit your screening test?\n\n` +
        `• Answered: ${answered}\n` +
        `• Marked for Review: ${review}\n` +
        `• Unanswered / Not Visited: ${unattempted}\n\n` +
        `Click OK to finalize and view your score & verified solutions.`
      );

      if (confirmed) {
        this.submitExam();
      }
    }

    autoSubmit() {
      alert('Time is up! Your screening test is being submitted automatically.');
      this.submitExam();
    }

    submitExam() {
      clearInterval(this.timerInterval);
      this.isSubmitted = true;

      const timeSpentSeconds = (this.durationMinutes * 60) - Math.max(0, this.timeRemaining);
      
      let correct = 0;
      let incorrect = 0;
      let unattempted = 0;
      const incorrectList = [];
      const subjectMap = {};

      this.questions.forEach(q => {
        const sub = q.subject || 'General';
        if (!subjectMap[sub]) {
          subjectMap[sub] = { total: 0, correct: 0, incorrect: 0, unattempted: 0 };
        }
        subjectMap[sub].total++;

        const selected = this.userAnswers[q.id];
        if (selected === undefined || selected === null) {
          unattempted++;
          subjectMap[sub].unattempted++;
        } else if (selected === q.correctAnswer) {
          correct++;
          subjectMap[sub].correct++;
        } else {
          incorrect++;
          subjectMap[sub].incorrect++;
          incorrectList.push(q);
        }
      });

      const score = correct; // 1 mark each, no negative marking per Rules 2022
      const percentage = ((score / this.questions.length) * 100).toFixed(1);

      // Save to storage
      if (window.HPPSP_Storage) {
        window.HPPSP_Storage.saveTestResult({
          testName: this.testTitle,
          totalQuestions: this.questions.length,
          attempted: correct + incorrect,
          correct: correct,
          incorrect: incorrect,
          unattempted: unattempted,
          score: score,
          percentage: parseFloat(percentage),
          timeSpentSeconds: timeSpentSeconds,
          subjectBreakdown: subjectMap,
          incorrectQuestions: incorrectList
        });
      }

      this.renderResults({
        score,
        percentage,
        correct,
        incorrect,
        unattempted,
        timeSpentSeconds,
        subjectMap
      });
    }

    renderResults(res) {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      const minutes = Math.floor(res.timeSpentSeconds / 60);
      const seconds = res.timeSpentSeconds % 60;
      const isQualified = res.score >= 35; // typical shortlisting indicator

      container.innerHTML = `
        <div class="animate-fade-in">
          <!-- Summary Header -->
          <div style="background:var(--bg-surface);border:1px solid var(--border-light);border-radius:var(--radius-xl);padding:36px;box-shadow:var(--shadow-md);margin-bottom:30px;text-align:center;">
            <span class="badge ${isQualified ? 'badge-green' : 'badge-amber'}" style="margin-bottom:12px;font-size:0.85rem;">
              ${isQualified ? 'Shortlisting Benchmark Achieved' : 'Needs Further Practice'}
            </span>
            <h2 style="font-size:2rem;margin-bottom:10px;">Your Screening Test Result</h2>
            <p style="color:var(--text-secondary);max-width:600px;margin:0 auto 24px auto;">
              Under Rule 5 of the HP District Judiciary Rules 2022, candidates are shortlisted for the 40-mark Written Test in a 1:5 vacancy ratio based on this screening.
            </p>

            <div style="display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin:24px 0;">
              <div class="stat-item" style="padding:14px 24px;background:var(--bg-subtle);border-radius:var(--radius-md);">
                <span class="stat-value" style="color:var(--color-royal);font-size:2.4rem;">${res.score} / ${this.questions.length}</span>
                <span class="stat-label">Marks Obtained</span>
              </div>
              <div class="stat-item" style="padding:14px 24px;background:var(--bg-subtle);border-radius:var(--radius-md);">
                <span class="stat-value" style="color:var(--color-green);font-size:2.4rem;">${res.percentage}%</span>
                <span class="stat-label">Overall Accuracy</span>
              </div>
              <div class="stat-item" style="padding:14px 24px;background:var(--bg-subtle);border-radius:var(--radius-md);">
                <span class="stat-value" style="color:#64748b;font-size:2.4rem;">${minutes}m ${seconds}s</span>
                <span class="stat-label">Time Taken</span>
              </div>
            </div>

            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:20px;">
              <button class="btn btn-primary" onclick="location.reload()">
                Retake Examination
              </button>
              <button class="btn btn-secondary" onclick="window.print()">
                Print Result Report
              </button>
              <a href="${window.HPPSP_CONFIG ? window.HPPSP_CONFIG.resolvePath('dashboard/') : '../../dashboard/'}" class="btn btn-accent">
                View Student Dashboard &rarr;
              </a>
            </div>
          </div>

          <!-- Subject Performance Breakdown -->
          <div style="background:var(--bg-surface);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:24px;margin-bottom:30px;">
            <h3 style="font-size:1.25rem;margin-bottom:16px;">Subject-Wise Performance Breakdown</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:16px;">
              ${Object.keys(res.subjectMap).map(sub => {
                const item = res.subjectMap[sub];
                const acc = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                return `
                  <div style="padding:16px;background:var(--bg-subtle);border-radius:var(--radius-md);border:1px solid var(--border-light);">
                    <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:8px;">
                      <span>${sub}</span>
                      <span style="color:var(--color-royal);">${item.correct}/${item.total} (${acc}%)</span>
                    </div>
                    <div style="width:100%;height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
                      <div style="width:${acc}%;height:100%;background:${acc >= 70 ? 'var(--color-green)' : (acc >= 40 ? 'var(--color-saffron)' : '#ef4444')};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Comprehensive Solution & Answer Key Review -->
          <div style="background:var(--bg-surface);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:30px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
              <h3 style="font-size:1.35rem;">Question-by-Question Solution &amp; Explanations</h3>
              <span class="badge badge-blue">${this.questions.length} Questions Reviewed</span>
            </div>

            <div class="solutions-list">
              ${this.questions.map((q, idx) => {
                const userSelected = this.userAnswers[q.id];
                const isCorrect = userSelected === q.correctAnswer;
                const isUnattempted = userSelected === undefined || userSelected === null;

                let statusBadge = '<span class="badge badge-green">Correct (+1)</span>';
                if (isUnattempted) {
                  statusBadge = '<span class="badge" style="background:#f1f5f9;color:#64748b;">Not Attempted (0)</span>';
                } else if (!isCorrect) {
                  statusBadge = '<span class="badge" style="background:#fee2e2;color:#b91c1c;">Incorrect (0)</span>';
                }

                return `
                  <div class="q-card" style="margin-bottom:20px;border-left:4px solid ${isCorrect ? 'var(--color-green)' : (isUnattempted ? '#94a3b8' : '#ef4444')};">
                    <div class="q-meta">
                      <span style="font-weight:800;color:var(--text-primary);">Q${idx + 1}. ${q.subject}</span>
                      <div>${statusBadge}</div>
                    </div>
                    <div style="font-size:1.05rem;font-weight:700;margin-bottom:14px;color:var(--text-primary);">${q.question}</div>
                    
                    <div class="q-options-grid">
                      ${q.options.map((opt, optIdx) => {
                        let optClass = 'q-opt';
                        if (optIdx === q.correctAnswer) optClass += ' correct';
                        if (userSelected === optIdx && !isCorrect) optClass += ' style="background:#fee2e2;border-color:#f87171;color:#b91c1c;"';
                        return `
                          <div class="${optClass}">
                            <strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}
                            ${optIdx === q.correctAnswer ? ' &check; (Correct)' : ''}
                            ${userSelected === optIdx && !isCorrect ? ' &cross; (Your Answer)' : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>

                    <div class="q-explanation">
                      <strong>Explanation:</strong> ${q.explanation}
                      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Source: ${q.source || 'Official HP High Court Examination Standard'}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  window.HPPSPExamEngine = HPPSPExamEngine;
})(window, document);

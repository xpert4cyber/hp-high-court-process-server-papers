/**
 * HPProcessServerPapers (HPPSP) - Question Bank Explorer & Filter Engine
 * Fast, client-side, zero backend, interactive filtering & search.
 */
(function(window, document) {
  'use strict';

  class HPPSPQuestionBank {
    constructor(options) {
      this.containerId = options.containerId || 'qb-list';
      this.filterSubjectId = options.filterSubjectId || 'filter-subject';
      this.filterDifficultyId = options.filterDifficultyId || 'filter-difficulty';
      this.searchInputId = options.searchInputId || 'qb-search';
      this.countId = options.countId || 'qb-count';
      this.defaultSubject = options.defaultSubject || 'all';

      this.allQuestions = [];
      this.filteredQuestions = [];

      this.init();
    }

    async init() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      container.innerHTML = '<div style="text-align:center;padding:40px;"><p>Loading question bank...</p></div>';

      try {
        // Load questions from multiple subjects or aggregate
        const subjects = [
          'hp-process-server-2022.json',
          'hp-gk.json',
          'general-knowledge.json',
          'mathematics.json',
          'general-science.json',
          'english.json',
          'hindi.json',
          'reasoning.json'
        ];

        const fetchPromises = subjects.map(file => {
          let url = 'data/questions/' + file;
          if (window.HPPSP_CONFIG) url = window.HPPSP_CONFIG.resolvePath(url);
          return fetch(url).then(r => r.ok ? r.json() : []);
        });

        const results = await Promise.all(fetchPromises);
        this.allQuestions = results.flat();

        this.bindControls();
        this.applyFilters();
      } catch (err) {
        console.error('Error loading question bank:', err);
        container.innerHTML = '<div style="padding:20px;color:#dc2626;">Error loading questions. Please reload the page.</div>';
      }
    }

    bindControls() {
      const subjectSelect = document.getElementById(this.filterSubjectId);
      const diffSelect = document.getElementById(this.filterDifficultyId);
      const searchInput = document.getElementById(this.searchInputId);

      if (subjectSelect) {
        if (this.defaultSubject !== 'all') {
          subjectSelect.value = this.defaultSubject;
        }
        subjectSelect.addEventListener('change', () => this.applyFilters());
      }

      if (diffSelect) {
        diffSelect.addEventListener('change', () => this.applyFilters());
      }

      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => this.applyFilters(), 250);
        });
      }
    }

    applyFilters() {
      const subjectSelect = document.getElementById(this.filterSubjectId);
      const diffSelect = document.getElementById(this.filterDifficultyId);
      const searchInput = document.getElementById(this.searchInputId);

      const selSubject = subjectSelect ? subjectSelect.value : 'all';
      const selDiff = diffSelect ? diffSelect.value : 'all';
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

      this.filteredQuestions = this.allQuestions.filter(q => {
        // Subject match
        if (selSubject !== 'all' && q.subject.toLowerCase() !== selSubject.toLowerCase()) {
          return false;
        }

        // Difficulty match
        if (selDiff !== 'all' && q.difficulty.toLowerCase() !== selDiff.toLowerCase()) {
          return false;
        }

        // Query search in question, explanation, topic, or options
        if (query) {
          const inQuestion = q.question.toLowerCase().includes(query);
          const inExplanation = q.explanation && q.explanation.toLowerCase().includes(query);
          const inTopic = q.topic && q.topic.toLowerCase().includes(query);
          const inOptions = q.options && q.options.some(opt => opt.toLowerCase().includes(query));
          if (!inQuestion && !inExplanation && !inTopic && !inOptions) {
            return false;
          }
        }

        return true;
      });

      this.render();
    }

    render() {
      const container = document.getElementById(this.containerId);
      const countEl = document.getElementById(this.countId);
      if (!container) return;

      if (countEl) {
        countEl.textContent = `${this.filteredQuestions.length} Questions Found`;
      }

      if (this.filteredQuestions.length === 0) {
        container.innerHTML = `
          <div style="background:var(--bg-surface);border:1px solid var(--border-light);border-radius:12px;padding:40px;text-align:center;">
            <h3>No Questions Matched</h3>
            <p style="color:var(--text-muted);margin-top:6px;">Try clearing filters or searching with different keywords.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = this.filteredQuestions.map((q, idx) => {
        const isBookmarked = window.HPPSP_Storage ? window.HPPSP_Storage.isBookmarked(q.id) : false;
        return `
          <div class="q-card animate-fade-in" id="q-${q.id}">
            <div class="q-meta">
              <div>
                <span style="font-weight:800;color:var(--text-primary);">Q${idx + 1}.</span>
                <span class="badge badge-blue" style="margin-left:6px;">${q.subject}</span>
                <span class="badge badge-amber" style="margin-left:4px;">${q.topic || 'General'}</span>
              </div>
              <button class="btn-icon btn-bookmark" data-id="${q.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}" style="width:32px;height:32px;color:${isBookmarked ? '#f59e0b' : 'inherit'};">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>

            <div style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin-bottom:12px;">${q.question}</div>

            <div class="q-options-grid">
              ${q.options.map((opt, optIdx) => `
                <div class="q-opt ${optIdx === q.correctAnswer ? 'correct' : ''}">
                  <strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}
                  ${optIdx === q.correctAnswer ? ' &check;' : ''}
                </div>
              `).join('')}
            </div>

            <div class="q-explanation">
              <strong>Answer &amp; Explanation:</strong> ${q.explanation}
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Source: ${q.source || 'HPPSC / District Judiciary Reference'}</div>
            </div>
          </div>
        `;
      }).join('');

      // Bind bookmark buttons
      container.querySelectorAll('.btn-bookmark').forEach(btn => {
        btn.addEventListener('click', () => {
          const qId = btn.getAttribute('data-id');
          const qObj = this.allQuestions.find(x => x.id === qId);
          if (qObj && window.HPPSP_Storage) {
            const added = window.HPPSP_Storage.toggleBookmark(qObj);
            const svg = btn.querySelector('svg');
            if (added) {
              btn.style.color = '#f59e0b';
              svg.setAttribute('fill', 'currentColor');
              window.showToast('Question saved to bookmarks');
            } else {
              btn.style.color = 'inherit';
              svg.setAttribute('fill', 'none');
              window.showToast('Question removed from bookmarks');
            }
          }
        });
      });
    }
  }

  window.HPPSPQuestionBank = HPPSPQuestionBank;
})(window, document);

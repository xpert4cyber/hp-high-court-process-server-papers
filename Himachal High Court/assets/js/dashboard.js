/**
 * HPProcessServerPapers (HPPSP) - Student Dashboard Engine
 * Visualizes local study progress, mock test scores, bookmarks, and weak areas.
 * 100% private, client-side, zero backend storage.
 */
(function(window, document) {
  'use strict';

  function initDashboard() {
    if (!window.HPPSP_Storage) return;

    renderOverviewStats();
    renderTestHistoryTable();
    renderBookmarksList();
    renderIncorrectDrill();
    bindDashboardActions();
  }

  function renderOverviewStats() {
    const history = window.HPPSP_Storage.getTestHistory();
    const bookmarks = window.HPPSP_Storage.getBookmarks();
    const incorrect = window.HPPSP_Storage.getIncorrectQuestions();

    const totalTests = history.length;
    let avgScore = 0;
    let highestScore = 0;
    let totalQuestionsAttempted = 0;
    let totalCorrect = 0;

    if (totalTests > 0) {
      const sum = history.reduce((acc, h) => acc + h.score, 0);
      avgScore = (sum / totalTests).toFixed(1);
      highestScore = Math.max(...history.map(h => h.score));
      
      totalQuestionsAttempted = history.reduce((acc, h) => acc + (h.attempted || 0), 0);
      totalCorrect = history.reduce((acc, h) => acc + (h.correct || 0), 0);
    }

    const accuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) 
      : 0;

    const statTotalEl = document.getElementById('stat-total-tests');
    const statAvgEl = document.getElementById('stat-avg-score');
    const statHighEl = document.getElementById('stat-highest-score');
    const statAccEl = document.getElementById('stat-accuracy');
    const statBookEl = document.getElementById('stat-bookmarks-count');

    if (statTotalEl) statTotalEl.textContent = totalTests;
    if (statAvgEl) statAvgEl.textContent = totalTests > 0 ? `${avgScore} / 50` : '--';
    if (statHighEl) statHighEl.textContent = totalTests > 0 ? `${highestScore} / 50` : '--';
    if (statAccEl) statAccEl.textContent = totalTests > 0 ? `${accuracy}%` : '--';
    if (statBookEl) statBookEl.textContent = bookmarks.length;
  }

  function renderTestHistoryTable() {
    const tableBody = document.getElementById('test-history-body');
    if (!tableBody) return;

    const history = window.HPPSP_Storage.getTestHistory();
    if (history.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted);">
            No mock tests attempted yet. <a href="../mock-tests/full-length-screening-test/" style="font-weight:700;">Take your first 50-mark screening test &rarr;</a>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = history.map((item, idx) => {
      const dateStr = new Date(item.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const minutes = Math.floor((item.timeSpentSeconds || 0) / 60);

      return `
        <tr>
          <td style="font-weight:700;">#${idx + 1}</td>
          <td>
            <strong>${item.testName}</strong>
            <div style="font-size:0.75rem;color:var(--text-muted);">${dateStr}</div>
          </td>
          <td>
            <span class="badge ${item.score >= 35 ? 'badge-green' : 'badge-amber'}">
              ${item.score} / ${item.totalQuestions}
            </span>
          </td>
          <td><strong>${item.percentage}%</strong></td>
          <td>${minutes} mins</td>
          <td>
            <a href="../mock-tests/full-length-screening-test/" class="btn btn-sm btn-secondary">
              Retake
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderBookmarksList() {
    const listEl = document.getElementById('dashboard-bookmarks-list');
    if (!listEl) return;

    const bookmarks = window.HPPSP_Storage.getBookmarks();
    if (bookmarks.length === 0) {
      listEl.innerHTML = '<p style="color:var(--text-muted);padding:16px 0;">No questions bookmarked yet. Use the bookmark icon in the Question Bank or Mock Tests to save difficult questions for revision.</p>';
      return;
    }

    listEl.innerHTML = bookmarks.map(q => `
      <div class="q-card" style="margin-bottom:14px;padding:16px;">
        <div class="q-meta">
          <span class="badge badge-blue">${q.subject}</span>
          <button class="btn-icon remove-bookmark-btn" data-id="${q.id}" title="Remove Bookmark" style="width:28px;height:28px;">
            &times;
          </button>
        </div>
        <div style="font-weight:700;margin-bottom:8px;font-size:0.98rem;">${q.question}</div>
        <div class="q-explanation" style="font-size:0.88rem;margin-top:6px;">
          <strong>Correct Answer:</strong> ${q.options ? q.options[q.correctAnswer] : ''} &bull; ${q.explanation}
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.HPPSP_Storage.toggleBookmark({ id });
        renderOverviewStats();
        renderBookmarksList();
        window.showToast('Bookmark removed');
      });
    });
  }

  function renderIncorrectDrill() {
    const drillEl = document.getElementById('dashboard-incorrect-list');
    if (!drillEl) return;

    const incorrect = window.HPPSP_Storage.getIncorrectQuestions();
    if (incorrect.length === 0) {
      drillEl.innerHTML = '<p style="color:var(--text-muted);padding:16px 0;">No incorrect questions logged. Outstanding work! As you attempt mock tests, questions answered incorrectly will automatically assemble here for revision.</p>';
      return;
    }

    drillEl.innerHTML = incorrect.map(q => `
      <div class="q-card" style="margin-bottom:14px;padding:16px;border-left:4px solid #ef4444;">
        <div class="q-meta">
          <span class="badge" style="background:#fee2e2;color:#b91c1c;">Revision Target: ${q.subject}</span>
          <button class="btn btn-sm btn-secondary clear-incorrect-btn" data-id="${q.id}">
            Mark as Mastered
          </button>
        </div>
        <div style="font-weight:700;margin-bottom:8px;font-size:0.98rem;">${q.question}</div>
        <div class="q-explanation" style="font-size:0.88rem;">
          <strong>Correct Answer:</strong> ${q.options ? q.options[q.correctAnswer] : ''} &bull; ${q.explanation}
        </div>
      </div>
    `).join('');

    drillEl.querySelectorAll('.clear-incorrect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.HPPSP_Storage.removeIncorrectQuestion(id);
        renderIncorrectDrill();
        window.showToast('Question marked as mastered!');
      });
    });
  }

  function bindDashboardActions() {
    const exportBtn = document.getElementById('btn-export-data');
    const resetBtn = document.getElementById('btn-reset-data');

    if (exportBtn) {
      exportBtn.addEventListener('click', function() {
        const data = window.HPPSP_Storage.exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hppsp-study-progress-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        window.showToast('Study progress exported successfully');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        const confirmed = window.confirm(
          'Are you sure you want to reset all your test attempts, bookmarks, and saved drafts?\n\nThis action is irreversible and clears your browser LocalStorage for this site.'
        );
        if (confirmed) {
          window.HPPSP_Storage.resetAllData();
          renderOverviewStats();
          renderTestHistoryTable();
          renderBookmarksList();
          renderIncorrectDrill();
          window.showToast('All local study data reset.');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})(window, document);

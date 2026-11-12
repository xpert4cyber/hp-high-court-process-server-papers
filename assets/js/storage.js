/**
 * HPProcessServerPapers (HPPSP) - LocalStorage Data Manager
 * Handles offline persistence for test history, bookmarks, weak topics, and goals.
 * Zero backend required; 100% browser-native.
 */
(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    HISTORY: 'hppsp_test_history',
    BOOKMARKS: 'hppsp_bookmarks',
    INCORRECT: 'hppsp_incorrect_answers',
    GOALS: 'hppsp_study_goals',
    DRAFTS: 'hppsp_written_drafts'
  };

  const HPPSP_Storage = {
    // -------------------------------------------------------------
    // Test History
    // -------------------------------------------------------------
    getTestHistory: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Failed to read test history from LocalStorage', e);
        return [];
      }
    },

    saveTestResult: function(result) {
      try {
        const history = this.getTestHistory();
        const entry = {
          id: 'test_' + Date.now(),
          testName: result.testName || 'HP Process Server Screening Test',
          date: new Date().toISOString(),
          totalQuestions: result.totalQuestions || 50,
          attempted: result.attempted || 0,
          correct: result.correct || 0,
          incorrect: result.incorrect || 0,
          unattempted: result.unattempted || 0,
          score: result.score || 0,
          percentage: result.percentage || 0,
          timeSpentSeconds: result.timeSpentSeconds || 0,
          subjectBreakdown: result.subjectBreakdown || {}
        };
        history.unshift(entry);
        // Keep latest 50 attempts
        if (history.length > 50) history.pop();
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

        // Also update incorrect questions for revision
        if (result.incorrectQuestions && result.incorrectQuestions.length > 0) {
          this.recordIncorrectQuestions(result.incorrectQuestions);
        }

        return entry;
      } catch (e) {
        console.error('Failed to save test result', e);
        return null;
      }
    },

    // -------------------------------------------------------------
    // Bookmarked Questions
    // -------------------------------------------------------------
    getBookmarks: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    isBookmarked: function(questionId) {
      const list = this.getBookmarks();
      return list.some(item => item.id === questionId);
    },

    toggleBookmark: function(questionObj) {
      try {
        let list = this.getBookmarks();
        const index = list.findIndex(item => item.id === questionObj.id);
        if (index >= 0) {
          list.splice(index, 1);
          localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
          return false; // Removed
        } else {
          list.unshift({
            id: questionObj.id,
            subject: questionObj.subject || 'General Knowledge',
            topic: questionObj.topic || '',
            question: questionObj.question,
            options: questionObj.options,
            correctAnswer: questionObj.correctAnswer,
            explanation: questionObj.explanation,
            addedAt: new Date().toISOString()
          });
          localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
          return true; // Added
        }
      } catch (e) {
        console.error('Failed to toggle bookmark', e);
        return false;
      }
    },

    // -------------------------------------------------------------
    // Incorrect Answers Drill
    // -------------------------------------------------------------
    getIncorrectQuestions: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.INCORRECT);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    recordIncorrectQuestions: function(newWrongQuestions) {
      try {
        let current = this.getIncorrectQuestions();
        newWrongQuestions.forEach(item => {
          if (!current.some(q => q.id === item.id)) {
            current.unshift(item);
          }
        });
        // Limit to 100 questions
        if (current.length > 100) current = current.slice(0, 100);
        localStorage.setItem(STORAGE_KEYS.INCORRECT, JSON.stringify(current));
      } catch (e) {
        console.error('Failed to record incorrect questions', e);
      }
    },

    removeIncorrectQuestion: function(questionId) {
      try {
        let current = this.getIncorrectQuestions();
        current = current.filter(q => q.id !== questionId);
        localStorage.setItem(STORAGE_KEYS.INCORRECT, JSON.stringify(current));
      } catch (e) {
        console.error('Failed to remove incorrect question', e);
      }
    },

    // -------------------------------------------------------------
    // Written Test Drafts (Hindi Essay / English Letter)
    // -------------------------------------------------------------
    getDraft: function(key) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS);
        const drafts = raw ? JSON.parse(raw) : {};
        return drafts[key] || '';
      } catch (e) {
        return '';
      }
    },

    saveDraft: function(key, text) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS);
        const drafts = raw ? JSON.parse(raw) : {};
        drafts[key] = text;
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
      } catch (e) {
        console.error('Failed to save draft', e);
      }
    },

    // -------------------------------------------------------------
    // Data Export & Reset
    // -------------------------------------------------------------
    exportAllData: function() {
      return {
        testHistory: this.getTestHistory(),
        bookmarks: this.getBookmarks(),
        incorrectQuestions: this.getIncorrectQuestions(),
        exportedAt: new Date().toISOString()
      };
    },

    resetAllData: function() {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
      localStorage.removeItem(STORAGE_KEYS.INCORRECT);
      localStorage.removeItem(STORAGE_KEYS.GOALS);
      localStorage.removeItem(STORAGE_KEYS.DRAFTS);
    }
  };

  window.HPPSP_Storage = HPPSP_Storage;
})(window);

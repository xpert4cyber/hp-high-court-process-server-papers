/**
 * HPProcessServerPapers (HPPSP) - Global Website Search
 * Client-side index search across all site sections, syllabus, papers, and mock tests.
 */
(function(window, document) {
  'use strict';

  const SITE_SEARCH_INDEX = [
    { title: "Home - Examination Portal", url: "index.html", category: "Core", keywords: "home screening process server himachal high court mock test previous year papers" },
    { title: "Previous Year Question Papers Hub", url: "previous-year-question-papers/index.html", category: "Papers", keywords: "pyq past year papers original official answer key pdf download 2022" },
    { title: "HP Process Server 2022 Question Paper (Solved)", url: "previous-year-question-papers/hp-process-server-2022/index.html", category: "Papers", keywords: "18 december 2022 screening test solved paper answer key rohtang beas saproon chobia" },
    { title: "Solved Previous Year Papers Archive", url: "previous-year-question-papers/solved-papers/index.html", category: "Papers", keywords: "verified solutions step by step explanations answer keys" },
    { title: "Mock Tests Dashboard", url: "mock-tests/index.html", category: "Tests", keywords: "mock test practice screening 50 questions 60 minutes online test timer" },
    { title: "Full-Length Screening Mock Test", url: "mock-tests/full-length-screening-test/index.html", category: "Tests", keywords: "50 marks CBT screening simulator real countdown palette submit review" },
    { title: "Subject-Wise Mock Tests", url: "mock-tests/subject-wise/index.html", category: "Tests", keywords: "subject practice hp gk math science english hindi reasoning" },
    { title: "Daily Practice Tests", url: "mock-tests/daily-practice/index.html", category: "Tests", keywords: "daily 10 questions streak daily practice quick quiz" },
    { title: "Comprehensive Question Bank", url: "question-bank/index.html", category: "Questions", keywords: "question bank 500 questions search filter difficulty bookmark" },
    { title: "Himachal Pradesh GK Centre", url: "question-bank/himachal-pradesh-gk/index.html", category: "HP GK", keywords: "hp gk rivers lakes passes temples districts history census wildlife hydel" },
    { title: "General Knowledge Question Bank", url: "question-bank/general-knowledge/index.html", category: "Questions", keywords: "indian constitution polity freedom movement history geography awards" },
    { title: "Mathematics (10+2 Arithmetic) Bank", url: "question-bank/mathematics/index.html", category: "Questions", keywords: "maths arithmetic percentage profit loss ratio simple interest averages" },
    { title: "General Science Question Bank", url: "question-bank/general-science/index.html", category: "Questions", keywords: "science physics chemistry biology human body vitamins diseases optics" },
    { title: "General English Question Bank", url: "question-bank/english/index.html", category: "Questions", keywords: "english grammar vocabulary synonyms antonyms prepositions idioms" },
    { title: "General Hindi Question Bank", url: "question-bank/hindi/index.html", category: "Questions", keywords: "hindi varn sandhi samas muhavare vilom paryayvachi vartani" },
    { title: "Reasoning & Mental Ability Bank", url: "question-bank/reasoning/index.html", category: "Questions", keywords: "reasoning logic series coding decoding direction analogy ranking" },
    { title: "Written Examination Preparation Hub (40 Marks)", url: "written-test/index.html", category: "Written", keywords: "written test descriptive 40 marks hindi essay 25 marks english application 15 marks" },
    { title: "Hindi Essay Writing Practice (निबंध लेखन)", url: "written-test/hindi-essay/index.html", category: "Written", keywords: "hindi essay 250 words word counter model essays topics writing editor" },
    { title: "English Application & Letter Writing", url: "written-test/english-application/index.html", category: "Written", keywords: "english letter application 100 words format district judge formal layout" },
    { title: "Official Syllabus (District Judiciary Rules 2022)", url: "syllabus/index.html", category: "Syllabus", keywords: "syllabus screening written interview weightage marks statutory rules" },
    { title: "Examination Pattern & Marking Scheme", url: "exam-pattern/index.html", category: "Pattern", keywords: "exam pattern 50 marks 40 marks 10 marks evaluation qualification experience" },
    { title: "60-Day Exam Preparation Guide", url: "exam-preparation/index.html", category: "Guide", keywords: "preparation strategy booklist daily routine time management" },
    { title: "Recruitment Updates & Notifications", url: "recruitment-updates/index.html", category: "Updates", keywords: "recruitment advertisement vacancy notification eligibility criteria dates" },
    { title: "Study Materials & Revision Notes", url: "study-material/index.html", category: "Notes", keywords: "revision notes cheat sheets high yield facts formulas" },
    { title: "Official Answer Keys Archive", url: "answer-keys/index.html", category: "Keys", keywords: "answer key objections verification official keys" },
    { title: "Results, Cutoffs & Merit Analysis", url: "results/index.html", category: "Results", keywords: "results cutoff merit list 1:5 ratio marks analysis" },
    { title: "Frequently Asked Questions (FAQ)", url: "faq/index.html", category: "Help", keywords: "faq questions eligibility age limit qualification negative marking language" },
    { title: "Student Personal Dashboard", url: "dashboard/index.html", category: "Dashboard", keywords: "student dashboard progress test history bookmarks incorrect questions" },
    { title: "About HPProcessServerPapers", url: "about/index.html", category: "About", keywords: "about us mission educational independent research" },
    { title: "Contact & Corrections Desk", url: "contact/index.html", category: "Contact", keywords: "contact email feedback error report paper submission" },
    { title: "Non-Affiliation Disclaimer", url: "disclaimer/index.html", category: "Legal", keywords: "disclaimer not affiliated with high court fair use independent educational" },
    { title: "Privacy Policy", url: "privacy-policy/index.html", category: "Legal", keywords: "privacy localstorage cookies data protection" },
    { title: "Terms and Conditions", url: "terms-and-conditions/index.html", category: "Legal", keywords: "terms of use intellectual property rules" },
    { title: "HTML Sitemap", url: "sitemap/index.html", category: "Navigation", keywords: "sitemap index all pages directory" }
  ];

  function initGlobalSearch() {
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('modal-search-input');
    const searchResults = document.getElementById('modal-search-results');
    const openBtns = document.querySelectorAll('.open-search-modal');
    const closeBtn = document.getElementById('close-search-modal');

    if (!searchModal || !searchInput || !searchResults) return;

    function openModal() {
      searchModal.style.display = 'flex';
      searchInput.value = '';
      searchInput.focus();
      renderResults('');
    }

    function closeModal() {
      searchModal.style.display = 'none';
    }

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) closeModal();
    });

    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchModal.style.display === 'flex') {
        closeModal();
      }
    });

    searchInput.addEventListener('input', function() {
      renderResults(this.value.trim().toLowerCase());
    });

    function renderResults(query) {
      if (!query) {
        searchResults.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Type keywords like "HP GK", "2022 Paper", "Essay", or "Mock Test" to search...</p>';
        return;
      }

      const matches = SITE_SEARCH_INDEX.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.category.toLowerCase().includes(query) ||
               item.keywords.toLowerCase().includes(query);
      });

      if (matches.length === 0) {
        searchResults.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No pages matched your query.</p>';
        return;
      }

      const basePath = window.HPPSP_CONFIG ? window.HPPSP_CONFIG.basePath : '/';

      searchResults.innerHTML = matches.map(item => {
        const link = basePath + item.url;
        return `
          <a href="${link}" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border-light);text-decoration:none;transition:background 0.15s ease;" onmouseover="this.style.background='var(--bg-subtle)'" onmouseout="this.style.background='transparent'">
            <div>
              <strong style="color:var(--text-primary);font-size:0.95rem;">${item.title}</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);">${item.category}</div>
            </div>
            <span class="badge badge-blue">&rarr;</span>
          </a>
        `;
      }).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', initGlobalSearch);
})(window, document);

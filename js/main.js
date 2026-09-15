/* =========================================================
   MAIN APPLICATION LOGIC
   Cyan Academic Competition 2026 — HMSI Telkom University
========================================================= */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. LUCIDE ICONS INITIALIZATION
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 2. HEADER SCROLL & THEME TOGGLE
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('cyanTheme', isLight ? 'light' : 'dark');
      });
    }

    // Restore saved theme
    if (localStorage.getItem('cyanTheme') === 'light') {
      document.body.classList.add('light-mode');
    }

    // Mobile Navigation Drawer
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    }
    if (mobileClose && mobileNav) {
      mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    }

    // 3. LIVE COUNTDOWN TIMER (Target: Open Registration Batch 1 Deadline - 10 Oktober 2026 23:59 WIB)
    const targetDate = new Date('2026-10-10T23:59:59+07:00').getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. FAQ ACCORDION
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((q) => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        item.classList.toggle('open');
      });
    });

    // 5. REGISTRATION MODAL & FORM LOGIC
    const regModal = document.getElementById('regModal');
    const openRegBtns = document.querySelectorAll('.btn-open-reg');
    const closeRegBtn = document.getElementById('closeRegModal');
    const regForm = document.getElementById('regForm');
    const regSuccess = document.getElementById('regSuccess');

    openRegBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.getAttribute('data-category');
        if (category && document.getElementById('regCategory')) {
          document.getElementById('regCategory').value = category;
        }
        if (regModal) regModal.classList.add('open');
      });
    });

    if (closeRegBtn && regModal) {
      closeRegBtn.addEventListener('click', () => {
        regModal.classList.remove('open');
      });
    }

    // Registration Form Submit Handler
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const teamName = document.getElementById('regTeamName').value;
        const leaderName = document.getElementById('regLeaderName').value;
        const email = document.getElementById('regEmail').value;
        const category = document.getElementById('regCategory').value;
        const institution = document.getElementById('regInstitution').value;

        // Generate Registration ID
        const regId = 'CYAN-2026-' + Math.floor(1000 + Math.random() * 9000);

        const newRecord = {
          regId,
          teamName,
          leaderName,
          email,
          category,
          institution,
          date: new Date().toLocaleDateString('id-ID'),
          status: 'Terverifikasi (Batch 1)'
        };

        // Save to LocalStorage
        const existing = JSON.parse(localStorage.getItem('cyanRegistrations') || '[]');
        existing.push(newRecord);
        localStorage.setItem('cyanRegistrations', JSON.stringify(existing));

        // Show Ticket Result
        regForm.style.display = 'none';
        if (regSuccess) {
          regSuccess.style.display = 'block';
          document.getElementById('ticketRegId').textContent = regId;
          document.getElementById('ticketTeam').textContent = teamName;
          document.getElementById('ticketLeader').textContent = leaderName;
          document.getElementById('ticketCategory').textContent = category;
          document.getElementById('ticketInst').textContent = institution;
        }
      });
    }

    // Reset Form button
    const btnResetReg = document.getElementById('btnResetReg');
    if (btnResetReg) {
      btnResetReg.addEventListener('click', () => {
        if (regForm) {
          regForm.reset();
          regForm.style.display = 'block';
        }
        if (regSuccess) regSuccess.style.display = 'none';
      });
    }

    // 6. LOOKUP / STATUS DASHBOARD MODAL
    const statusModal = document.getElementById('statusModal');
    const openStatusBtns = document.querySelectorAll('.btn-open-status');
    const closeStatusBtn = document.getElementById('closeStatusModal');
    const statusForm = document.getElementById('statusForm');
    const statusResult = document.getElementById('statusResult');

    openStatusBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (statusModal) statusModal.classList.add('open');
      });
    });

    if (closeStatusBtn && statusModal) {
      closeStatusBtn.addEventListener('click', () => {
        statusModal.classList.remove('open');
      });
    }

    if (statusForm) {
      statusForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchVal = document.getElementById('searchRegId').value.trim().toUpperCase();
        const records = JSON.parse(localStorage.getItem('cyanRegistrations') || '[]');

        const found = records.find(r => r.regId.toUpperCase() === searchVal || r.email.toUpperCase() === searchVal);

        if (found) {
          statusResult.innerHTML = `
            <div class="digital-ticket" style="margin-top:20px;">
              <div class="ticket-header">
                <div>
                  <h4 style="font-family:'Orbitron',sans-serif;color:var(--primary);">${found.regId}</h4>
                  <span style="font-size:0.8rem;color:var(--text-subtle);">${found.date}</span>
                </div>
                <span style="padding:4px 12px;border-radius:999px;background:rgba(0,255,204,0.15);color:#00FFCC;font-size:0.75rem;font-weight:700;">${found.status}</span>
              </div>
              <p><strong>Tim:</strong> ${found.teamName}</p>
              <p><strong>Ketua:</strong> ${found.leaderName}</p>
              <p><strong>Universitas:</strong> ${found.institution}</p>
              <p><strong>Kategori:</strong> ${found.category}</p>
            </div>
          `;
        } else {
          statusResult.innerHTML = `
            <div style="padding:20px;background:rgba(255,42,133,0.1);border:1px solid rgba(255,42,133,0.3);border-radius:12px;color:#FF2A85;margin-top:20px;text-align:center;">
              Data pendaftaran dengan ID/Email <strong>"${searchVal}"</strong> tidak ditemukan. Pastikan Anda telah mengisi form pendaftaran.
            </div>
          `;
        }
      });
    }
  });
})();

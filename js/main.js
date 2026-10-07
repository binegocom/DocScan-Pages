/**
 * DocScan Offline - Interactive Controllers with Duolingo-Style Audio
 * Parallax 3D Card Tilt, Laser Scanner Simulation, FAQ Accordion, Sound Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-toggle-icon');
  const soundLabel = document.getElementById('sound-toggle-label');

  function updateSoundUI() {
    if (!window.soundFX) return;
    const isEnabled = window.soundFX.enabled;
    if (soundIcon) soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    if (soundLabel) soundLabel.textContent = isEnabled ? 'Sound ON' : 'Muted';
    if (soundToggleBtn) {
      soundToggleBtn.setAttribute('aria-pressed', isEnabled);
      if (isEnabled) {
        soundToggleBtn.classList.remove('sound-muted');
      } else {
        soundToggleBtn.classList.add('sound-muted');
      }
    }
  }

  if (soundToggleBtn) {
    updateSoundUI();
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.soundFX) {
        window.soundFX.toggleSound();
        updateSoundUI();
      }
    });
  }

  // 2. Play Pop sound on all buttons & links
  document.querySelectorAll('.btn-store, .nav-links a, .feature-card, .screen-card-box').forEach(el => {
    el.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playPop();
    });
  });

  // 3. Language Dropdown Toggle with Sound
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langDropdownMenu = document.getElementById('lang-dropdown-menu');

  if (langToggleBtn && langDropdownMenu) {
    langToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.soundFX) window.soundFX.playPop();
      langDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!langDropdownMenu.contains(e.target) && e.target !== langToggleBtn) {
        langDropdownMenu.classList.remove('active');
      }
    });
  }

  // Language options click sound
  document.querySelectorAll('.lang-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playClick();
    });
  });

  // 4. Interactive 3D Phone Tilt Effect
  const phoneCard = document.querySelector('.phone-device-card');
  const phoneWrapper = document.querySelector('.hero-visual-wrapper');

  if (phoneCard && phoneWrapper) {
    phoneWrapper.addEventListener('mousemove', (e) => {
      const rect = phoneWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -(y / 25).toFixed(2);
      const rotateY = (x / 25).toFixed(2);
      
      phoneCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    phoneWrapper.addEventListener('mouseleave', () => {
      phoneCard.style.transform = 'rotateY(-6deg) rotateX(4deg) scale(1)';
    });

    phoneCard.addEventListener('click', () => {
      if (window.soundFX) {
        window.soundFX.playPop();
      }
    });
  }

  // 5. VIP Chance Chest & Badge Click (Fanfare + Confetti)
  const vipBadge = document.querySelector('.badge-bottom-left');
  const vipCard = document.querySelector('.card-gold');

  [vipBadge, vipCard].forEach(el => {
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        if (window.soundFX) window.soundFX.playChestReward();
        if (window.triggerConfetti) {
          const rect = el.getBoundingClientRect();
          window.triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      });
    }
  });

  // 6. Interactive OCR Laser Simulator with Duolingo Chime & Confetti
  const btnRunScan = document.getElementById('btn-run-scan');
  const btnResetScan = document.getElementById('btn-reset-scan');
  const scanLaser = document.getElementById('demo-scan-line');
  const demoStatus = document.getElementById('demo-ocr-status');
  const ocrHighlights = document.querySelectorAll('.ocr-target');

  if (btnRunScan && scanLaser && demoStatus) {
    btnRunScan.addEventListener('click', () => {
      // Audio: Laser scan sweep sound
      if (window.soundFX) window.soundFX.playLaserSweep();

      // Start scanning animation
      scanLaser.classList.add('active');
      demoStatus.classList.add('active');
      
      const isArabic = document.documentElement.getAttribute('lang') === 'ar';
      demoStatus.textContent = isArabic 
        ? "جارٍ مسح المستند ومعالجة النصوص دون إنترنت..." 
        : "Scanning document & running offline neural OCR...";

      // Staggered text line highlight
      ocrHighlights.forEach((el, idx) => {
        el.classList.remove('ocr-highlight');
        setTimeout(() => {
          el.classList.add('ocr-highlight');
          if (window.soundFX) window.soundFX.playClick();
        }, (idx + 1) * 420);
      });

      // Complete after 2.1 seconds -> Duolingo Success Chime + Confetti!
      setTimeout(() => {
        scanLaser.classList.remove('active');
        demoStatus.textContent = isArabic
          ? "تم استخراج النص بنجاح داخل الجهاز (صفر ملي ثانية للسيرفر)!"
          : "Text successfully extracted on-device (0 ms server ping)!";

        if (window.soundFX) window.soundFX.playSuccessChime();
        if (window.triggerConfetti) {
          const rect = btnRunScan.getBoundingClientRect();
          window.triggerConfetti(rect.left + rect.width / 2, rect.top);
        }
      }, 2100);
    });

    if (btnResetScan) {
      btnResetScan.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playResetThud();
        scanLaser.classList.remove('active');
        demoStatus.classList.remove('active');
        ocrHighlights.forEach(el => el.classList.remove('ocr-highlight'));
        
        const isArabic = document.documentElement.getAttribute('lang') === 'ar';
        demoStatus.textContent = isArabic
          ? "جاهز للمسح. اضغط على الزr أعلاه."
          : "Ready to scan. Click the button above.";
      });
    }
  }

  // 7. FAQ Accordion Toggle with Sound
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playClick();
        const isOpen = item.classList.contains('active');
        // Close all other items
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle clicked
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // 8. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.feature-card, .screen-card-box, .stat-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // 9. Interactive VIP Credit Hub Simulator
  const btnClaim = document.getElementById('btn-claim-ad-credit');
  const counterEl = document.getElementById('hub-credits-counter');
  const statusEl = document.getElementById('hub-claim-status');

  if (btnClaim && counterEl) {
    let currentCredits = 3;
    btnClaim.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playPop();
      btnClaim.disabled = true;
      btnClaim.style.opacity = '0.7';
      btnClaim.innerHTML = '<span>⏳</span> <span>Playing 15s Sponsored Ad...</span>';
      
      if (statusEl) statusEl.textContent = 'Simulating non-intrusive AdMob rewarded video...';

      setTimeout(() => {
        currentCredits += 5;
        counterEl.textContent = currentCredits;
        counterEl.style.transform = 'scale(1.25)';
        counterEl.style.color = '#10B981';
        setTimeout(() => {
          counterEl.style.transform = 'scale(1)';
          counterEl.style.color = '#fff';
        }, 400);

        if (window.soundFX) window.soundFX.playChestReward();
        if (window.triggerConfetti) {
          const rect = btnClaim.getBoundingClientRect();
          window.triggerConfetti(rect.left + rect.width / 2, rect.top);
        }

        btnClaim.disabled = false;
        btnClaim.style.opacity = '1';
        btnClaim.innerHTML = '<span class="claim-icon">🎁</span> <span>Watch 15s Video & Claim +5 Credits</span>';
        
        if (statusEl) {
          statusEl.textContent = `🎉 +5 Credits added! Current balance: ${currentCredits} credits.`;
          statusEl.style.color = '#10B981';
        }
      }, 1600);
    });
  }
});


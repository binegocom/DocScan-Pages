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

  // ==========================================================================
  // 10. Top Scroll Progress Bar
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // ==========================================================================
  // 11. Ambient Cursor Spotlight
  // ==========================================================================
  const spotlight = document.getElementById('cursor-spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  // ==========================================================================
  // 12. Toast Notification Helper
  // ==========================================================================
  const toastEl = document.getElementById('toast-notification');
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('active');
    if (window.soundFX) window.soundFX.playPop();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('active');
    }, 2800);
  }

  // ==========================================================================
  // 13. Mobile QR Code Modal
  // ==========================================================================
  const qrToggleBtn = document.getElementById('qr-toggle-btn');
  const qrModal = document.getElementById('qr-modal');
  const qrCloseBtn = document.getElementById('qr-modal-close-btn');
  const qrDoneBtn = document.getElementById('qr-modal-done-btn');

  function openQRModal() {
    if (!qrModal) return;
    qrModal.classList.add('active');
    qrModal.setAttribute('aria-hidden', 'false');
    if (window.soundFX) window.soundFX.playPop();
  }

  function closeQRModal() {
    if (!qrModal) return;
    qrModal.classList.remove('active');
    qrModal.setAttribute('aria-hidden', 'true');
    if (window.soundFX) window.soundFX.playClick();
  }

  if (qrToggleBtn) qrToggleBtn.addEventListener('click', openQRModal);
  if (qrCloseBtn) qrCloseBtn.addEventListener('click', closeQRModal);
  if (qrDoneBtn) qrDoneBtn.addEventListener('click', closeQRModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQRModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal && qrModal.classList.contains('active')) {
      closeQRModal();
    }
  });

  // ==========================================================================
  // 14. Interactive Feature Playground - Tab Switcher
  // ==========================================================================
  const playTabButtons = document.querySelectorAll('.playground-tab-btn');
  const playPanels = document.querySelectorAll('.playground-panel');

  playTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      if (!tabKey) return;

      playTabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      playPanels.forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(`tab-panel-${tabKey}`);
      if (activePanel) activePanel.classList.add('active');

      if (window.soundFX) window.soundFX.playClick();
    });
  });

  // ==========================================================================
  // 15. Playground Tab 1: Neural OCR Controller
  // ==========================================================================
  const btnPlayRunOCR = document.getElementById('btn-play-run-ocr');
  const btnPlayCopyOCR = document.getElementById('btn-play-copy-ocr');
  const playScanBeam = document.getElementById('play-scan-beam');
  const playStatusBar = document.getElementById('play-ocr-status-bar');
  const playStatusText = document.getElementById('play-ocr-status-text');
  const playOcrResult = document.getElementById('play-ocr-result-text');
  const ocrExtractTime = document.getElementById('ocr-extract-time');
  const playDocTargets = document.querySelectorAll('.play-doc-paper .ocr-target');

  if (btnPlayRunOCR && playScanBeam && playStatusText) {
    btnPlayRunOCR.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playLaserSweep();

      btnPlayRunOCR.disabled = true;
      btnPlayRunOCR.style.opacity = '0.7';
      playScanBeam.classList.add('active');
      if (playStatusBar) playStatusBar.classList.add('active');

      const isArabic = document.documentElement.getAttribute('lang') === 'ar';
      playStatusText.textContent = isArabic
        ? "جارٍ المعالجة العصبية داخل الجهاز..."
        : "Extracting text layers via on-device neural engine...";

      playDocTargets.forEach((target, index) => {
        target.classList.remove('ocr-highlight');
        setTimeout(() => {
          target.classList.add('ocr-highlight');
          if (window.soundFX) window.soundFX.playClick();
        }, (index + 1) * 360);
      });

      const startTime = performance.now();
      setTimeout(() => {
        playScanBeam.classList.remove('active');
        btnPlayRunOCR.disabled = false;
        btnPlayRunOCR.style.opacity = '1';

        const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
        if (ocrExtractTime) ocrExtractTime.textContent = `${elapsed}s`;

        playStatusText.textContent = isArabic
          ? "تم الاستخراج بنجاح! جاهز للنسخ."
          : "Extraction complete (99.8% accuracy). Ready to copy.";

        if (window.soundFX) window.soundFX.playSuccessChime();
        if (window.triggerConfetti) {
          const rect = btnPlayRunOCR.getBoundingClientRect();
          window.triggerConfetti(rect.left + rect.width / 2, rect.top);
        }
      }, 2100);
    });
  }

  if (btnPlayCopyOCR && playOcrResult) {
    btnPlayCopyOCR.addEventListener('click', () => {
      navigator.clipboard.writeText(playOcrResult.value).then(() => {
        const isArabic = document.documentElement.getAttribute('lang') === 'ar';
        const msg = isArabic ? "تم النسخ إلى الحافظة! 🎉" : "Copied to Clipboard! 🎉";
        showToast(msg);
      }).catch(() => {
        showToast("Copied to Clipboard! 🎉");
      });
    });
  }

  // ==========================================================================
  // 16. Playground Tab 2: 2-in-1 Dual-Sided ID Controller
  // ==========================================================================
  const btnIdFlip = document.getElementById('btn-id-flip');
  const btnIdMerge = document.getElementById('btn-id-merge');
  const idFlipper = document.getElementById('id-flipper');
  const idSingleView = document.getElementById('id-single-card-view');
  const idA4View = document.getElementById('id-a4-preview-view');

  if (btnIdFlip && idFlipper) {
    btnIdFlip.addEventListener('click', () => {
      idFlipper.classList.toggle('flipped');
      if (window.soundFX) window.soundFX.playClick();
    });

    idFlipper.addEventListener('click', () => {
      idFlipper.classList.toggle('flipped');
      if (window.soundFX) window.soundFX.playClick();
    });
  }

  if (btnIdMerge && idSingleView && idA4View) {
    btnIdMerge.addEventListener('click', () => {
      const isA4Visible = !idA4View.classList.contains('hidden');
      if (isA4Visible) {
        idA4View.classList.add('hidden');
        idSingleView.classList.remove('hidden');
        btnIdMerge.innerHTML = '<span class="btn-icon">📄</span> <span>Snap to A4 Sheet Preview</span>';
      } else {
        idSingleView.classList.add('hidden');
        idA4View.classList.remove('hidden');
        btnIdMerge.innerHTML = '<span class="btn-icon">🪪</span> <span>Back to 3D Card View</span>';
        if (window.triggerConfetti) {
          const rect = btnIdMerge.getBoundingClientRect();
          window.triggerConfetti(rect.left + rect.width / 2, rect.top);
        }
      }
      if (window.soundFX) window.soundFX.playPop();
    });
  }

  // ==========================================================================
  // 17. Playground Tab 3: E-Signature Canvas & Watermark Stamper
  // ==========================================================================
  const signCanvas = document.getElementById('signature-canvas');
  const btnSignClear = document.getElementById('btn-sign-clear');
  const btnSignApply = document.getElementById('btn-sign-apply');
  const checkWatermark = document.getElementById('check-watermark');
  const watermarkOverlay = document.getElementById('contract-watermark-overlay');
  const stampedSigSlot = document.getElementById('stamped-signature-display');
  const inkDots = document.querySelectorAll('.ink-dot');

  let currentInkColor = '#10B981';
  let isDrawing = false;
  let hasSigned = false;

  if (signCanvas) {
    const ctx = signCanvas.getContext('2d');

    // Scale canvas for retina displays
    function setupCanvasDPI() {
      const rect = signCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      signCanvas.width = rect.width * dpr;
      signCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = currentInkColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    setupCanvasDPI();
    window.addEventListener('resize', setupCanvasDPI);

    function getCoords(e) {
      const rect = signCanvas.getBoundingClientRect();
      if (e.touches && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      hasSigned = true;
      const coords = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const coords = getCoords(e);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    function endDraw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      isDrawing = false;
      ctx.closePath();
    }

    signCanvas.addEventListener('mousedown', startDraw);
    signCanvas.addEventListener('mousemove', draw);
    signCanvas.addEventListener('mouseup', endDraw);
    signCanvas.addEventListener('mouseleave', endDraw);

    signCanvas.addEventListener('touchstart', startDraw, { passive: false });
    signCanvas.addEventListener('touchmove', draw, { passive: false });
    signCanvas.addEventListener('touchend', endDraw, { passive: false });

    // Ink color picker
    inkDots.forEach(dot => {
      dot.addEventListener('click', () => {
        inkDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentInkColor = dot.getAttribute('data-color') || '#10B981';
        ctx.strokeStyle = currentInkColor;
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Clear signature
    if (btnSignClear) {
      btnSignClear.addEventListener('click', () => {
        const rect = signCanvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        hasSigned = false;
        if (stampedSigSlot) {
          stampedSigSlot.innerHTML = '<span class="slot-placeholder">Signature not applied yet</span>';
        }
        if (window.soundFX) window.soundFX.playResetThud();
      });
    }

    // Apply signature to contract preview
    if (btnSignApply && stampedSigSlot) {
      btnSignApply.addEventListener('click', () => {
        if (!hasSigned) {
          showToast("Please sign on the canvas first!");
          if (window.soundFX) window.soundFX.playResetThud();
          return;
        }

        const dataUrl = signCanvas.toDataURL('image/png');
        stampedSigSlot.innerHTML = `<img src="${dataUrl}" alt="Applied Vector Signature" style="max-height:38px; object-fit:contain;">`;
        if (window.soundFX) window.soundFX.playSuccessChime();
        if (window.triggerConfetti) {
          const rect = btnSignApply.getBoundingClientRect();
          window.triggerConfetti(rect.left + rect.width / 2, rect.top);
        }
        showToast("Signature stamped onto confidential agreement! ✍️");
      });
    }

    // Watermark checkbox
    if (checkWatermark && watermarkOverlay) {
      checkWatermark.addEventListener('change', () => {
        if (checkWatermark.checked) {
          watermarkOverlay.classList.remove('hidden');
          showToast("Watermark applied: CONFIDENTIAL 🛡️");
        } else {
          watermarkOverlay.classList.add('hidden');
        }
        if (window.soundFX) window.soundFX.playClick();
      });
    }
  }

  // ==========================================================================
  // 18. Playground Tab 4: PIN Vault Locker & Keypad
  // ==========================================================================
  const keypadButtons = document.querySelectorAll('.keypad-btn');
  const vaultDoor = document.getElementById('vault-door');
  const vaultSecrets = document.getElementById('vault-secret-content');
  const vaultLockIcon = document.getElementById('vault-lock-icon');
  const vaultDoorStatus = document.getElementById('vault-door-status');
  const btnLockAgain = document.getElementById('btn-lock-vault-again');

  let enteredPin = [];

  function updatePinDots() {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`pdot-${i}`);
      if (dot) {
        if (i < enteredPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      }
    }
  }

  function unlockVault() {
    if (vaultDoorStatus) vaultDoorStatus.textContent = 'ACCESS GRANTED';
    if (vaultLockIcon) vaultLockIcon.textContent = '🔓';

    if (window.soundFX) window.soundFX.playChestReward();
    if (window.triggerConfetti) {
      const rect = vaultDoor ? vaultDoor.getBoundingClientRect() : { left: window.innerWidth / 2, top: 200, width: 0 };
      window.triggerConfetti(rect.left + rect.width / 2, rect.top);
    }

    setTimeout(() => {
      if (vaultDoor) vaultDoor.classList.add('unlocked');
      if (vaultSecrets) vaultSecrets.classList.remove('hidden');
      showToast("Vault Unlocked: 3 Encrypted Files Decrypted! 🔓");
    }, 450);
  }

  function resetVault() {
    enteredPin = [];
    updatePinDots();
    if (vaultDoor) vaultDoor.classList.remove('unlocked');
    if (vaultSecrets) vaultSecrets.classList.add('hidden');
    if (vaultLockIcon) vaultLockIcon.textContent = '🔒';
    if (vaultDoorStatus) vaultDoorStatus.textContent = 'VAULT LOCKED';
    if (window.soundFX) window.soundFX.playResetThud();
  }

  keypadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key === 'C') {
        enteredPin = [];
        updatePinDots();
        if (window.soundFX) window.soundFX.playResetThud();
        return;
      }
      if (key === 'B') {
        enteredPin.pop();
        updatePinDots();
        if (window.soundFX) window.soundFX.playClick();
        return;
      }
      if (enteredPin.length < 4) {
        enteredPin.push(key);
        updatePinDots();
        if (window.soundFX) window.soundFX.playClick();

        if (enteredPin.length === 4) {
          unlockVault();
        }
      }
    });
  });

  if (btnLockAgain) {
    btnLockAgain.addEventListener('click', resetVault);
  }

  // ==========================================================================
  // 19. Playground Tab 5: Golden Chest & Dopamine Fanfare
  // ==========================================================================
  const chestCard = document.getElementById('playground-chest-card');
  const goldenChest = document.getElementById('interactive-golden-chest');
  const btnChestTrigger = document.getElementById('btn-chest-trigger');
  const chestBanner = document.getElementById('chest-reward-banner');
  const playCreditVal = document.getElementById('playground-credit-val');

  let playCredits = 3;
  let isChestOpen = false;

  function triggerGoldenChest(originEl) {
    if (isChestOpen) {
      // Re-close chest
      const lid = goldenChest ? goldenChest.querySelector('.chest-lid') : null;
      if (lid) lid.classList.remove('open');
      isChestOpen = false;
      if (chestBanner) chestBanner.classList.add('hidden');
      if (window.soundFX) window.soundFX.playResetThud();
      return;
    }

    const lid = goldenChest ? goldenChest.querySelector('.chest-lid') : null;
    if (lid) lid.classList.add('open');
    isChestOpen = true;

    playCredits += 5;
    if (playCreditVal) playCreditVal.textContent = playCredits;
    if (counterEl) counterEl.textContent = playCredits;

    if (chestBanner) chestBanner.classList.remove('hidden');

    if (window.soundFX) window.soundFX.playChestReward();
    if (window.triggerConfetti) {
      const rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: 300, width: 0 };
      window.triggerConfetti(rect.left + rect.width / 2, rect.top);
    }

    showToast("VIP Chest Opened: +5 Offline Credits Awarded! 🎁");
  }

  if (chestCard) {
    chestCard.addEventListener('click', () => triggerGoldenChest(chestCard));
  }
  if (btnChestTrigger) {
    btnChestTrigger.addEventListener('click', () => triggerGoldenChest(btnChestTrigger));
  }
});



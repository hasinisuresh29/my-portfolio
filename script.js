/**
 * Portfolio JavaScript - Theme Toggle, Vertical Navigation & Interactive Terminal
 * Features:
 * - CSS Media Query theme auto-detection & synced toggles
 * - Left vertical navbar with mobile drawer, accessibility, & scrollspy
 * - Interactive 8-bit Pixel Chat Terminal simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. NIGHT MODE & CSS MEDIA QUERY THEME DETECTION
  // ==========================================================================
  const headerThemeBtn = document.getElementById('theme-toggle');
  const heroThemeBtn = document.getElementById('hero-theme-toggle');
  const heroStatusText = heroThemeBtn ? heroThemeBtn.querySelector('.pixel-theme-status-text') : null;
  const heroStatusIndicator = heroThemeBtn ? heroThemeBtn.querySelector('.pixel-theme-status-indicator') : null;
  const rootElement = document.documentElement;

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getEffectiveTheme() {
    const explicitTheme = rootElement.getAttribute('data-theme');
    if (explicitTheme) return explicitTheme;
    return darkModeMediaQuery.matches ? 'dark' : 'light';
  }

  function updateThemeUI(theme, isAuto = false) {
    if (heroStatusText) {
      if (theme === 'dark') {
        heroStatusText.textContent = isAuto ? '🌙 NIGHT [SYS-AUTO]' : '🌙 NIGHT MODE [ON]';
      } else {
        heroStatusText.textContent = isAuto ? '☀️ DAY [SYS-AUTO]' : '☀️ DAY MODE [ON]';
      }
    }
    if (heroStatusIndicator) {
      heroStatusIndicator.style.backgroundColor = theme === 'dark' ? 'var(--pixel-green)' : 'var(--pixel-yellow)';
      heroStatusIndicator.style.boxShadow = theme === 'dark' ? '0 0 6px var(--pixel-green)' : '0 0 6px var(--pixel-yellow)';
    }
  }

  // Initial theme check
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme, false);
  } else {
    const initialDetectedTheme = darkModeMediaQuery.matches ? 'dark' : 'light';
    updateThemeUI(initialDetectedTheme, true);
  }

  // React to OS / Browser theme change
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      const updatedTheme = e.matches ? 'dark' : 'light';
      updateThemeUI(updatedTheme, true);
    }
  });

  function toggleTheme() {
    const currentEffective = getEffectiveTheme();
    const newTheme = currentEffective === 'dark' ? 'light' : 'dark';

    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeUI(newTheme, false);
  }

  if (headerThemeBtn) headerThemeBtn.addEventListener('click', toggleTheme);
  if (heroThemeBtn) heroThemeBtn.addEventListener('click', toggleTheme);

  // ==========================================================================
  // 2. VERTICAL NAVIGATION BAR & ACCESSIBLE MOBILE DRAWER
  // ==========================================================================
  const verticalNavbar = document.getElementById('vertical-navbar');
  const navToggleBtn = document.getElementById('vertical-nav-toggle');
  const topMobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const navBackdrop = document.getElementById('vertical-nav-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');

  function openSidebar() {
    if (verticalNavbar) {
      verticalNavbar.classList.add('is-open');
      if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'true');
      if (topMobileMenuBtn) topMobileMenuBtn.setAttribute('aria-expanded', 'true');
      if (navBackdrop) navBackdrop.classList.add('is-active');
      document.body.style.overflow = window.innerWidth <= 1024 ? 'hidden' : '';
    }
  }

  function closeSidebar() {
    if (verticalNavbar) {
      verticalNavbar.classList.remove('is-open');
      if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'false');
      if (topMobileMenuBtn) topMobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (navBackdrop) navBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = verticalNavbar && verticalNavbar.classList.contains('is-open');
      if (isOpen) closeSidebar();
      else openSidebar();
    });
  }

  if (topMobileMenuBtn) {
    topMobileMenuBtn.addEventListener('click', () => {
      const isOpen = verticalNavbar && verticalNavbar.classList.contains('is-open');
      if (isOpen) closeSidebar();
      else openSidebar();
    });
  }

  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (navBackdrop) navBackdrop.addEventListener('click', closeSidebar);

  // Close sidebar on pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && verticalNavbar && verticalNavbar.classList.contains('is-open')) {
      closeSidebar();
      if (navToggleBtn) navToggleBtn.focus();
    }
  });

  // Handle clicking sidebar navigation links
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // ==========================================================================
  // 3. SCROLLSPY ACTIVE LINK HIGHLIGHTING
  // ==========================================================================
  const contentSections = document.querySelectorAll('main section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    contentSections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    sidebarLinks.forEach(link => {
      const targetSec = link.getAttribute('data-section');
      if (targetSec === currentId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  });

  // ==========================================================================
  // 4. DYNAMIC FOOTER YEAR
  // ==========================================================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 5. INTERACTIVE 8-BIT PIXEL CHAT TERMINAL
  // ==========================================================================
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-user-input');
  const promptChips = document.querySelectorAll('.chat-prompt-chip');

  const botResponses = {
    skills: "Hasini is proficient in Python, C, Java (basics), and SQL. She is actively expanding into modern Frontend (HTML5/CSS3/JavaScript) and Backend architecture!",
    roles: "Hasini is a Fresher currently seeking entry-level Software Engineering roles and internships. She is open to full-time, hybrid, and remote opportunities!",
    education: "Hasini graduated with a B.E. in Computer Science and Engineering (Data Science) from Adichunchanagiri Institute of Technology, Chikkamagaluru, achieving a 7.8 CGPA!",
    resume: "You can download Hasini's full resume in PDF format directly using the 'RESUME.PDF' button in the left sidebar or the 'DOWNLOAD RESUME' buttons!",
    contact: "You can reach Hasini directly via email at hasinisuresh2979@gmail.com or by phone at +91 9036138340. You can also connect on LinkedIn: linkedin.com/in/hasini-suresh-9b97a1380!"
  };

  function appendChatMessage(sender, text, isUser = false) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.textContent = isUser ? '👤' : '🤖';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    const senderSpan = document.createElement('span');
    senderSpan.className = 'msg-sender';
    senderSpan.textContent = sender;

    const p = document.createElement('p');
    p.textContent = text;

    bubbleDiv.appendChild(senderSpan);
    bubbleDiv.appendChild(p);
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleBotReply(userInput) {
    const query = userInput.toLowerCase();
    let reply = "";

    if (query.includes('skill') || query.includes('language') || query.includes('stack')) {
      reply = botResponses.skills;
    } else if (query.includes('role') || query.includes('job') || query.includes('intern') || query.includes('hire')) {
      reply = botResponses.roles;
    } else if (query.includes('degree') || query.includes('education') || query.includes('college') || query.includes('cgpa')) {
      reply = botResponses.education;
    } else if (query.includes('resume') || query.includes('cv') || query.includes('download')) {
      reply = botResponses.resume;
    } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('linkedin')) {
      reply = botResponses.contact;
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      reply = "Hey there! Great to meet you! Feel free to ask about Hasini's skills, projects, degree, or resume!";
    } else {
      reply = `Thank you for your message! Hasini is enthusiastic about discussing software engineering opportunities. Drop a direct note at hasinisuresh2979@gmail.com!`;
    }

    setTimeout(() => {
      appendChatMessage('HASINI_BOT:', reply, false);
    }, 400);
  }

  // Handle Quick Question Chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const qKey = chip.getAttribute('data-question');
      const questionText = chip.textContent.replace(/[^\w\s?&]/gi, '').trim();

      appendChatMessage('YOU:', questionText, true);

      setTimeout(() => {
        const answer = botResponses[qKey] || "Got it! Feel free to reach out via the contact section below.";
        appendChatMessage('HASINI_BOT:', answer, false);
      }, 400);
    });
  });

  // Handle Form Submission
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      appendChatMessage('YOU:', text, true);
      chatInput.value = '';
      handleBotReply(text);
    });
  }

  // ==========================================================================
  // 6. SKILLS SECTION — XP BAR SCROLL-REVEAL ANIMATION
  // Uses IntersectionObserver to trigger XP bar fill animation when
  // skill cards scroll into the viewport — mimicking a "leveling up" effect.
  // ==========================================================================
  const xpFills = document.querySelectorAll('.psk-xp-fill');

  if (xpFills.length > 0 && 'IntersectionObserver' in window) {
    const xpBarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-width');
          if (targetWidth) {
            // Small delay so user sees the 0→N animation clearly
            setTimeout(() => {
              fill.style.width = targetWidth + '%';
            }, 180);
          }
          // Once animated, stop observing to avoid re-triggering
          xpBarObserver.unobserve(fill);
        }
      });
    }, {
      threshold: 0.2,       // Trigger when 20% of the element is visible
      rootMargin: '0px 0px -60px 0px'  // Slight bottom offset for better UX
    });

    xpFills.forEach(fill => xpBarObserver.observe(fill));
  } else {
    // Fallback for browsers without IntersectionObserver: fill immediately
    xpFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-width');
      if (targetWidth) fill.style.width = targetWidth + '%';
    });
  }
});

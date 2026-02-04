window.onload = () => {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const main = document.getElementById("main");
  const memorial = document.getElementById("memorial");
  const bgMusic = document.getElementById("bgMusic");

  // --- Evasive No Button Logic ---
  let active = false;
  let isRespawning = false;
  let noX, noY, targetX, targetY;
  const SPEED = 0.18, MARGIN = 12, SAFE_RADIUS = 80, ESCAPE_FORCE = 4;
  let pointerX = null, pointerY = null;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  function distanceToRect(px, py, rect) {
    const dx = Math.max(rect.left - px, 0, px - rect.right);
    const dy = Math.max(rect.top - py, 0, py - rect.bottom);
    return Math.hypot(dx, dy);
  }

  function activateAvoidance() {
    if (active) return;
    active = true;
    const rect = noBtn.getBoundingClientRect();
    noX = rect.left; noY = rect.top;
    targetX = noX; targetY = noY;
    noBtn.style.position = "absolute";
    noBtn.style.left = `${noX}px`;
    noBtn.style.top = `${noY}px`;
    document.body.appendChild(noBtn);
  }

  noBtn.addEventListener("mouseenter", activateAvoidance);
  noBtn.addEventListener("touchstart", activateAvoidance);
  document.addEventListener("mousemove", e => { pointerX = e.clientX; pointerY = e.clientY; });
  document.addEventListener("touchmove", e => { pointerX = e.touches[0].clientX; pointerY = e.touches[0].clientY; });

  function animate() {
    if (active && pointerX !== null && !isRespawning) {
      const rect = noBtn.getBoundingClientRect();
      const dist = distanceToRect(pointerX, pointerY, rect);
      if (rect.left < 15 || rect.right > window.innerWidth - 15 || rect.top < 15 || rect.bottom > window.innerHeight - 15) {
        isRespawning = true; noBtn.style.display = "none";
        setTimeout(() => {
          noX = Math.random() * (window.innerWidth - rect.width - MARGIN * 2) + MARGIN;
          noY = Math.random() * (window.innerHeight - rect.height - MARGIN * 2) + MARGIN;
          targetX = noX; targetY = noY;
          noBtn.style.left = `${noX}px`; noBtn.style.top = `${noY}px`;
          noBtn.style.display = "block"; isRespawning = false;
        }, 300);
      }
      if (!isRespawning && dist < SAFE_RADIUS) {
        const cx = clamp(pointerX, rect.left, rect.right), cy = clamp(pointerY, rect.top, rect.bottom);
        let dx = rect.left + rect.width/2 - cx, dy = rect.top + rect.height/2 - cy;
        const len = Math.hypot(dx, dy) || 1;
        targetX += (dx/len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
        targetY += (dy/len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
      }
      if (!isRespawning) {
        noX += (targetX - noX) * SPEED; noY += (targetY - noY) * SPEED;
        noBtn.style.left = `${noX}px`; noBtn.style.top = `${noY}px`;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  // --- Memorial Letter Content ---
  const letterText = `To my forever VALENTINE,\n\nBaby I never knew love was this beautiful until I met you , Thank you for coming into my life. Every moment with you feels like home, You make my days brighter and my heart calmer your smile the best stress reliever no matter how stressed iam, You are my world. when you are beside me everyday is a valentine day and you are special to me everyday, my love towards you grows only stronger by time, I know I might not be a perfect boyfriend but I can promise I’ll always make my self better everyday and I can’t see tears no matter what I promise You are my love of my life, No matter how many storms come our way, as long as you hold my hand, I am ready to overcome anything. I really can’t wait to get older and wiser with you.\n\nThank you my love\n\nI love you to the moon and back❤️\n\nKhushi’s Saideepak\n\n❤️`;

  // --- Celebration / Fireworks Logic ---
  function celebrate() {
    const duration = 10 * 60 * 1000; // 10 minutes
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      // Fire random bursts
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 2000);
  }

  function showMemorial() {
    memorial.classList.add("active");
    const photoRow = document.getElementById("photoRow");
    const videoRow = document.getElementById("videoRow");

    celebrate(); // Start continuous fireworks

    photoRow.innerHTML = "";
    ["assets/photo1.jpeg", "assets/photo2.jpeg", "assets/photo3.jpeg", "assets/photo4.jpeg"].forEach(src => {
      const img = document.createElement("img"); img.src = src; photoRow.appendChild(img);
    });

    videoRow.src = "assets/video.mp4";
    videoRow.play();

    let i = 0;
    const letterEl = document.getElementById("letter");
    const typeInterval = setInterval(() => {
      if(letterText[i] !== undefined) {
        letterEl.textContent += letterText[i]; i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 45);

    if (bgMusic) { bgMusic.volume = 0.4; bgMusic.play(); }
  }

  yesBtn.addEventListener("click", () => {
    main.style.display = "none";
    showMemorial();
  });
};
window.onload = () => {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const main = document.getElementById("main");
  const intermission = document.getElementById("intermission");
  const proceedBtn = document.getElementById("proceedBtn");
  const memorial = document.getElementById("memorial");
  const bgMusic = document.getElementById("bgMusic");
  const airlineLink = document.getElementById("airlineLink");

  // --- Evasive No Button Logic ---
  let active = false;
  let isRespawning = false;
  let noX, noY, targetX, targetY;
  const SPEED = 0.18, MARGIN = 20, SAFE_RADIUS = 80, ESCAPE_FORCE = 6;
  let pointerX = null, pointerY = null;

  // --- Crazy No Button Messages ---
  const noMessages = [
    "No 🙈",
    "Noooo? 🤨",
    "No way! 🙅‍♀️",
    "Are you sure? 🥺",
    "Think again... 🌹",
    "Last chance! 💎",
    "Wrong button! 😂",
    "Still no? 😭",
    "You're being mean! 💔",
    "Just click Yes! ✨"
  ];
  let noClickCount = 0;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function moveButtonRandomly() {
    const rect = noBtn.getBoundingClientRect();
    noX = Math.random() * (window.innerWidth - rect.width - MARGIN * 2) + MARGIN;
    noY = Math.random() * (window.innerHeight - rect.height - MARGIN * 2) + MARGIN;
    targetX = noX;
    targetY = noY;
    noBtn.style.left = `${noX}px`;
    noBtn.style.top = `${noY}px`;
  }

  function handleNoInteraction() {
    noClickCount++;
    const messageIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[messageIndex];
    
    // Make the Yes button slightly bigger each time for extra humor
    const currentScale = 1 + (noClickCount * 0.05);
    yesBtn.style.transform = `scale(${currentScale})`;
    
    moveButtonRandomly();
  }

  function activateAvoidance(e) {
    if (!active) {
      active = true;
      const rect = noBtn.getBoundingClientRect();
      noX = rect.left;
      noY = rect.top;
      targetX = noX;
      targetY = noY;
      
      noBtn.style.position = "fixed";
      noBtn.style.left = `${noX}px`;
      noBtn.style.top = `${noY}px`;
      noBtn.style.margin = "0";
      noBtn.style.zIndex = "1000";
      document.body.appendChild(noBtn);
    }
  }

  // Listeners for the "No" button
  noBtn.addEventListener("mouseenter", activateAvoidance);
  
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleNoInteraction();
  });

  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault(); 
    activateAvoidance(e);
    handleNoInteraction();
  }, { passive: false });

  document.addEventListener("mousemove", e => { 
    pointerX = e.clientX; 
    pointerY = e.clientY; 
  });

  document.addEventListener("touchmove", e => { 
    pointerX = e.touches[0].clientX; 
    pointerY = e.touches[0].clientY; 
  }, { passive: false });

  function animate() {
    if (active && pointerX !== null && !isRespawning && noBtn.parentNode) {
      const rect = noBtn.getBoundingClientRect();
      const dist = Math.hypot(rect.left + rect.width/2 - pointerX, rect.top + rect.height/2 - pointerY);

      if (rect.left < 5 || rect.right > window.innerWidth - 5 || rect.top < 5 || rect.bottom > window.innerHeight - 5) {
        isRespawning = true;
        noBtn.style.opacity = "0";
        setTimeout(() => {
          if(noBtn.parentNode) {
              moveButtonRandomly();
              noBtn.style.opacity = "1";
          }
          isRespawning = false;
        }, 200);
      }

      if (!isRespawning && dist < SAFE_RADIUS) {
        const cx = clamp(pointerX, rect.left, rect.right);
        const cy = clamp(pointerY, rect.top, rect.bottom);
        let dx = rect.left + rect.width / 2 - cx;
        let dy = rect.top + rect.height / 2 - cy;
        const len = Math.hypot(dx, dy) || 1;
        
        targetX += (dx / len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
        targetY += (dy / len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
      }

      if (!isRespawning) {
        noX += (targetX - noX) * SPEED;
        noY += (targetY - noY) * SPEED;
        noBtn.style.left = `${noX}px`;
        noBtn.style.top = `${noY}px`;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  // --- Memorial Logic ---
  function celebrate() {
    const duration = 10 * 60 * 1000; 
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 } });
    }, 2000);
  }

  function showMemorial() {
    memorial.classList.add("active");
    const photoRow = document.getElementById("photoRow");
    const videoRow = document.getElementById("videoRow");
    const letterEl = document.getElementById("letter");

    celebrate(); 

    photoRow.innerHTML = "";
    ["assets/photo1.jpeg", "assets/photo2.jpeg", "assets/photo3.jpeg", "assets/photo4.jpeg"].forEach(src => {
      const img = document.createElement("img"); 
      img.src = src; 
      photoRow.appendChild(img);
    });

    videoRow.src = "assets/video.mp4";
    videoRow.setAttribute("playsinline", "");
    videoRow.setAttribute("webkit-playsinline", "");
    videoRow.muted = true;
    videoRow.play();

    const letterText = `To my forever VALENTINE,\n\nBaby I never knew love was this beautiful until I met you , Thank you for coming into my life. Every moment with you feels like home, You make my days brighter and my heart calmer your smile the best stress reliever no matter how stressed iam, You are my world. when you are beside me everyday is a valentine day and you are special to me everyday, my love towards you grows only stronger by time, I know I might not be a perfect boyfriend but I can promise I’ll always make my self better everyday and I can’t see tears no matter what I promise You are my love of my life, No matter how many storms come our way, as long as you hold my hand, I am ready to overcome anything. I really can’t wait to get older and wiser with you.\n\nThank you my love\n\nI love you to the moon and back❤️\n\nKhushi’s Saideepak\n\n❤️`;

    let i = 0;
    letterEl.textContent = ""; 
    const typeInterval = setInterval(() => {
      if(letterText[i] !== undefined) {
        letterEl.textContent += letterText[i]; 
        i++;
        if (i % 5 === 0) memorial.scrollTop = memorial.scrollHeight;
      } else {
        clearInterval(typeInterval);
        if(airlineLink) airlineLink.classList.add("show");
      }
    }, 45);
  }

  // --- Flow Controls ---
  yesBtn.addEventListener("click", () => {
    main.style.display = "none";
    noBtn.style.display = "none"; 
    intermission.style.display = "flex"; 
    if (bgMusic) bgMusic.play().catch(() => {});
  });

  proceedBtn.addEventListener("click", () => {
    intermission.style.display = "none";
    noBtn.remove(); 
    if (bgMusic) bgMusic.play(); 
    showMemorial();
  });
};

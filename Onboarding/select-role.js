// ===========================
// Select Role Navigation
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const btnEmployee = document.getElementById("btn-employee");
  const btnManager = document.getElementById("btn-manager");
  const loginAction = document.getElementById("login-action");

  if (btnEmployee) {
    btnEmployee.addEventListener("click", () => {
      window.location.href = "employee-signup.html";
    });
  }

  if (btnManager) {
    btnManager.addEventListener("click", () => {
      window.location.href = "manager-signup.html";
    });
  }

  if (loginAction) {
    loginAction.addEventListener("click", () => {
      // Show selection for which role to login
      const role = prompt("Are you an 'employee' or 'manager'?").toLowerCase();
      if (role === "employee") {
        window.location.href = "employee-login.html";
      } else if (role === "manager") {
        window.location.href = "manager-login.html";
      }
    });
  }

  // Onboarding Screens Data
  const screens = [
    {
      title: "Easy Leave Requests",
      description:
        "Request leave in a few taps and view your balance instantly. No emails. No WhatsApp follow-ups.",
    },
    {
      title: "Track Your Time",
      description:
        "Clock in and out seamlessly with location tracking. View your hours and attendance history in real-time.",
    },
    {
      title: "Stay Connected",
      description:
        "Get instant notifications about approvals, tasks, and important updates. Never miss a beat.",
    },
  ];

  let currentScreen = 0;

  const titleElement = document.querySelector(".onboarding-text h2");
  const descElement = document.querySelector(".onboarding-text p");
  const dots = document.querySelectorAll(".loading-dot");

  // Progress Dots Navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentScreen = index;
      updateScreen();
    });
  });

  function updateScreen() {
    // Update text content
    if (titleElement && descElement) {
      titleElement.textContent = screens[currentScreen].title;
      descElement.textContent = screens[currentScreen].description;
    }

    // Update active dot
    dots.forEach((dot, index) => {
      if (index === currentScreen) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // ===========================
  // Swipe Gesture Support
  // ===========================
  let touchStartX = 0;
  let touchEndX = 0;

  const container = document.querySelector(".onboarding-container");

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next screen
      if (currentScreen < screens.length - 1) {
        currentScreen++;
        updateScreen();
      }
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous screen
      if (currentScreen > 0) {
        currentScreen--;
        updateScreen();
      }
    }
  }

  // ===========================
  // Auto-advance (Optional)
  // ===========================
  let autoAdvanceTimer;

  function startAutoAdvance() {
    autoAdvanceTimer = setInterval(() => {
      currentScreen = (currentScreen + 1) % screens.length;
      updateScreen();
    }, 5000); // 5 seconds
  }

  function stopAutoAdvance() {
    clearInterval(autoAdvanceTimer);
  }

  // Uncomment to enable auto-advance
  // startAutoAdvance();

  // Stop auto-advance on user interaction
  container.addEventListener("click", stopAutoAdvance);
  container.addEventListener("touchstart", stopAutoAdvance);

  // ===========================
  // Button Actions
  // ===========================
  btnEmployee.addEventListener("click", () => {
    console.log("Continue as Employee clicked");
    // Navigate to employee dashboard
    window.location.href = "employee-login.html";
  });

  btnManager.addEventListener("click", () => {
    console.log("Continue as Manager clicked");
    // Navigate to manager dashboard
    window.location.href = "manager-login.html";
  });

  loginLink.addEventListener("click", () => {
    console.log("Log In clicked");
    // Navigate to login page
    window.location.href = "login.html";
  });

  // ===========================
  // Keyboard Navigation
  // ===========================
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && currentScreen < screens.length - 1) {
      currentScreen++;
      updateScreen();
    } else if (e.key === "ArrowLeft" && currentScreen > 0) {
      currentScreen--;
      updateScreen();
    }
  });
});

// ===========================
// Initialize
// ===========================
// console.log("EaseHR Onboarding - Loaded");

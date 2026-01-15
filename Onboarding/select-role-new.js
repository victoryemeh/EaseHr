// ===========================
// Select Role Navigation
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const btnEmployee = document.getElementById("btn-employee");
  const btnManager = document.getElementById("btn-manager");
  const loginAction = document.getElementById("login-action");

  if (btnEmployee) {
    btnEmployee.addEventListener("click", () => {
      window.location.href = "employee-login.html";
    });
  }

  if (btnManager) {
    btnManager.addEventListener("click", () => {
      window.location.href = "manager-login.html";
    });
  }

  if (loginAction) {
    loginAction.addEventListener("click", () => {
      const role = prompt("Are you an 'employee' or 'manager'?");
      if (role && role.toLowerCase() === "employee") {
        window.location.href = "employee-login.html";
      } else if (role && role.toLowerCase() === "manager") {
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
  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentScreen = index;
        updateScreen();
      });
    });
  }

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

  // Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  const container = document.querySelector(".onboarding-container");

  if (container) {
    container.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      if (currentScreen < screens.length - 1) {
        currentScreen++;
        updateScreen();
      }
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      if (currentScreen > 0) {
        currentScreen--;
        updateScreen();
      }
    }
  }

  // Auto-advance every 5 seconds
  let autoAdvanceTimer = setInterval(() => {
    currentScreen = (currentScreen + 1) % screens.length;
    updateScreen();
  }, 5000);

  // Stop auto-advance on user interaction
  if (container) {
    container.addEventListener("click", () => {
      clearInterval(autoAdvanceTimer);
    });
    container.addEventListener("touchstart", () => {
      clearInterval(autoAdvanceTimer);
    });
  }
});

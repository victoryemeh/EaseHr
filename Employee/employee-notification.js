// ===========================
// EaseHR Employee Notifications
// Interactive JavaScript
// ===========================

document.addEventListener("DOMContentLoaded", function () {
  // ===========================
  // Filter Functionality
  // ===========================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const notificationCards = document.querySelectorAll(".notification-card");
  const sectionLabel = document.querySelector(".section-label");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get filter type
      const filterType = this.getAttribute("data-filter");

      // Update section label
      updateSectionLabel(filterType);

      // Filter notifications
      filterNotifications(filterType);
    });
  });

  function updateSectionLabel(filterType) {
    const labels = {
      all: "All notifications",
      unread: "Unread notifications",
      clockin: "Clock In notifications",
      leave: "Leave notifications",
      task: "Task notifications",
    };

    sectionLabel.textContent = labels[filterType] || "All notifications";
  }

  function filterNotifications(filterType) {
    notificationCards.forEach((card) => {
      const cardType = card.getAttribute("data-type");

      if (filterType === "all") {
        card.style.display = "flex";
        card.classList.add("fade-in");
      } else if (cardType === filterType) {
        card.style.display = "flex";
        card.classList.add("fade-in");
      } else {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }
    });
  }

  // ===========================
  // Notification Card Expand
  // ===========================
  const expandButtons = document.querySelectorAll(".notification-expand");

  expandButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const card = this.closest(".notification-card");

      // Toggle expanded state
      card.classList.toggle("expanded");

      // Rotate the expand icon
      this.style.transform = card.classList.contains("expanded")
        ? "rotate(270deg)"
        : "rotate(90deg)";

      // Log action (in real app, this could trigger API call)
      console.log(
        "Notification expanded:",
        card.querySelector(".notification-title").textContent
      );
    });
  });

  // ===========================
  // Calendar Navigation
  // ===========================
  const calendarArrows = document.querySelectorAll(".calendar-arrow");
  const monthText = document.querySelector(".month-text");

  let currentMonth = 11; // December (0-indexed)
  let currentYear = 2025;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  calendarArrows.forEach((arrow) => {
    arrow.addEventListener("click", function () {
      if (this.classList.contains("left")) {
        // Previous month
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
      } else {
        // Next month
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
      }

      updateMonthDisplay();
    });
  });

  function updateMonthDisplay() {
    monthText.textContent = `${months[currentMonth]} ${currentYear}`;
  }

  // ===========================
  // Date Slider Navigation
  // ===========================
  const sliderArrows = document.querySelectorAll(".slider-arrow");
  const dayLabels = document.querySelectorAll(".day-label");

  sliderArrows.forEach((arrow) => {
    arrow.addEventListener("click", function (e) {
      e.stopPropagation();

      // Find current active day
      let activeIndex = -1;
      dayLabels.forEach((day, index) => {
        if (day.classList.contains("active")) {
          activeIndex = index;
        }
      });

      // Remove active class
      if (activeIndex !== -1) {
        dayLabels[activeIndex].classList.remove("active");
      }

      // Calculate new index
      let newIndex = activeIndex;
      if (this.classList.contains("left")) {
        newIndex = activeIndex > 0 ? activeIndex - 1 : dayLabels.length - 1;
      } else {
        newIndex = activeIndex < dayLabels.length - 1 ? activeIndex + 1 : 0;
      }

      // Add active class to new day
      dayLabels[newIndex].classList.add("active");
    });
  });

  // ===========================
  // Bottom Navigation
  // ===========================
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Don't prevent default - let links navigate

      // Remove active class from all nav items
      navItems.forEach((navItem) => navItem.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Log navigation (in real app, this would route to different pages)
      const navLabel = this.querySelector(".nav-label").textContent;
      console.log("Navigated to:", navLabel);

      // Optional: Add visual feedback
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });

  // ===========================
  // Click on notification card
  // ===========================
  notificationCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Add highlight effect
      this.style.backgroundColor = "#f0f9ff";
      setTimeout(() => {
        this.style.backgroundColor = "var(--white)";
      }, 300);

      // Log action
      const title = this.querySelector(".notification-title").textContent;
      console.log("Notification clicked:", title);
    });
  });

  // ===========================
  // Utility: Smooth Scrolling
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // ===========================
  // Initialize on Load
  // ===========================
  console.log("EaseHR Employee Notifications - Loaded");
  console.log("Current filter: All notifications");
  console.log("Total notifications:", notificationCards.length);
});

// ===========================
// Service Worker Registration (Optional)
// For PWA functionality if needed
// ===========================
if ("serviceWorker" in navigator) {
  // Uncomment to enable service worker
  // navigator.serviceWorker.register('/sw.js')
  //     .then(reg => console.log('Service Worker registered', reg))
  //     .catch(err => console.log('Service Worker registration failed', err));
}

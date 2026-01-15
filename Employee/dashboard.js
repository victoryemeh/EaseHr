// Employee Dashboard API Integration
let employeeData = {};
let leaveHistory = [];
let attendanceHistory = [];

// Initialize dashboard on page load
document.addEventListener("DOMContentLoaded", async () => {
  const token = TokenManager.getToken();
  const role = TokenManager.getRole();
  const employeeId = TokenManager.getUserId();

  // Redirect if not authenticated or not an employee
  if (!token || role !== "employee") {
    window.location.href = "../Onboarding/select-role.html";
    return;
  }

  try {
    // Load employee profile
    if (employeeId) {
      await loadEmployeeProfile(employeeId);
    }
    // Load leave history
    await loadLeaveHistory();
    // Load attendance history
    await loadAttendanceHistory();
    // Update header with employee info
    updateEmployeeHeader();
  } catch (error) {
    showError("Failed to load dashboard: " + error.message);
  }
});

// Load employee profile
async function loadEmployeeProfile(employeeId) {
  try {
    const response = await EmployeeAPI.getById(employeeId);
    employeeData = response.data || {};

    // Store employee name for later use
    localStorage.setItem("easehr_employeeName", employeeData.name);
  } catch (error) {
    console.error("Error loading employee profile:", error);
  }
}

// Load employee's leave history
async function loadLeaveHistory() {
  try {
    const response = await LeaveAPI.getHistory();
    leaveHistory = response.data || [];
    renderLeaveHistory();
  } catch (error) {
    console.error("Error loading leave history:", error);
    showError("Could not load leave history");
  }
}

// Load employee's attendance history
async function loadAttendanceHistory() {
  try {
    const response = await AttendanceAPI.getHistory();
    attendanceHistory = response.data || [];
    renderAttendanceHistory();
  } catch (error) {
    console.error("Error loading attendance history:", error);
  }
}

// Update header with employee name
function updateEmployeeHeader() {
  const employeeName =
    employeeData.name ||
    localStorage.getItem("easehr_employeeName") ||
    "Employee";
  const headerTitle = document.querySelector(".user-greeting h2");
  if (headerTitle) {
    headerTitle.textContent = `Hello, ${employeeName}`;
  }
}

// Render leave history
function renderLeaveHistory() {
  const leaveContainer = document.getElementById("leave-history-container");
  if (!leaveContainer) return;

  leaveContainer.innerHTML = "";

  if (leaveHistory.length === 0) {
    leaveContainer.innerHTML =
      '<p style="padding: 16px; color: #64748b; text-align: center;">No leave records found</p>';
    return;
  }

  leaveHistory.forEach((leave) => {
    const leaveCard = document.createElement("div");
    leaveCard.className = "leave-card";
    leaveCard.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border-left: 4px solid ${
        leave.status === "approved"
          ? "#22c55e"
          : leave.status === "rejected"
          ? "#ef4444"
          : "#f59e0b"
      };
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `;

    leaveCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 600; color: #0f172a;">${leave.fromDate} to ${
      leave.toDate
    }</div>
          <div style="font-size: 12px; color: #64748b;">${
            leave.reason || "No reason provided"
          }</div>
        </div>
        <span style="
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          background: ${
            leave.status === "approved"
              ? "#d1fae5"
              : leave.status === "rejected"
              ? "#fee2e2"
              : "#fef3c7"
          };
          color: ${
            leave.status === "approved"
              ? "#065f46"
              : leave.status === "rejected"
              ? "#7f1d1d"
              : "#92400e"
          };
        ">${leave.status.toUpperCase()}</span>
      </div>
      ${
        leave.status === "pending"
          ? `
        <div style="display: flex; gap: 8px;">
          <button onclick="cancelLeave('${leave.id}')" style="
            flex: 1;
            padding: 6px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          ">Cancel Leave</button>
        </div>
      `
          : ""
      }
    `;

    leaveContainer.appendChild(leaveCard);
  });
}

// Render attendance history
function renderAttendanceHistory() {
  const attendanceContainer = document.getElementById(
    "attendance-history-container"
  );
  if (!attendanceContainer) return;

  attendanceContainer.innerHTML = "";

  if (attendanceHistory.length === 0) {
    attendanceContainer.innerHTML =
      '<p style="padding: 16px; color: #64748b; text-align: center;">No attendance records found</p>';
    return;
  }

  attendanceHistory.slice(0, 10).forEach((record) => {
    const attendanceItem = document.createElement("div");
    attendanceItem.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
    `;

    attendanceItem.innerHTML = `
      <div>
        <div style="font-size: 14px; font-weight: 500; color: #0f172a;">${
          record.date || "Date"
        }</div>
        <div style="font-size: 12px; color: #64748b;">${
          record.clockIn || "--"
        } - ${record.clockOut || "--"}</div>
      </div>
      <span style="
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        background: ${record.clockOut ? "#d1fae5" : "#fef3c7"};
        color: ${record.clockOut ? "#065f46" : "#92400e"};
      ">${record.clockOut ? "COMPLETED" : "IN PROGRESS"}</span>
    `;

    attendanceContainer.appendChild(attendanceItem);
  });
}

// Apply for leave
async function applyForLeave() {
  const fromDate = prompt("Enter start date (YYYY-MM-DD):");
  if (!fromDate) return;

  const toDate = prompt("Enter end date (YYYY-MM-DD):");
  if (!toDate) return;

  const reason = prompt("Enter reason for leave:");
  if (!reason) return;

  // Validate date range
  if (!Validator.dateRange(fromDate, toDate)) {
    showError("End date must be after start date");
    return;
  }

  try {
    const response = await LeaveAPI.apply(fromDate, toDate, reason);
    showSuccess("Leave application submitted successfully!");
    // Reload leave history
    await loadLeaveHistory();
  } catch (error) {
    showError("Failed to apply for leave: " + error.message);
  }
}

// Cancel leave
async function cancelLeave(leaveId) {
  if (!confirm("Are you sure you want to cancel this leave request?")) {
    return;
  }

  try {
    await LeaveAPI.cancel(leaveId);
    showSuccess("Leave cancelled successfully");
    // Reload leave history
    await loadLeaveHistory();
  } catch (error) {
    showError("Failed to cancel leave: " + error.message);
  }
}

// Clock in
async function clockIn() {
  try {
    await AttendanceAPI.clockIn();
    showSuccess("Clocked in successfully!");
    // Reload attendance history
    await loadAttendanceHistory();
  } catch (error) {
    showError("Failed to clock in: " + error.message);
  }
}

// Clock out
async function clockOut() {
  try {
    await AttendanceAPI.clockOut();
    showSuccess("Clocked out successfully!");
    // Reload attendance history
    await loadAttendanceHistory();
  } catch (error) {
    showError("Failed to clock out: " + error.message);
  }
}

// Update profile
async function updateProfile() {
  const name = prompt("Enter your name:", employeeData.name);
  if (!name) return;

  const email = prompt("Enter your email:", employeeData.email);
  if (!email) return;

  if (!Validator.email(email)) {
    showError("Please enter a valid email address");
    return;
  }

  try {
    const employeeId = TokenManager.getUserId();
    await EmployeeAPI.updateProfile(employeeId, { name, email });
    showSuccess("Profile updated successfully!");
    // Reload profile
    await loadEmployeeProfile(employeeId);
    updateEmployeeHeader();
  } catch (error) {
    showError("Failed to update profile: " + error.message);
  }
}

// Logout handler
function handleLogout(event) {
  event.preventDefault();
  TokenManager.clear();
  window.location.href = "../Onboarding/select-role.html";
}

// Add quick action handlers when dashboard loads
document.addEventListener("DOMContentLoaded", () => {
  const applyLeaveBtn = document.querySelector("[data-action='apply-leave']");
  const clockInBtn = document.querySelector("[data-action='clock-in']");
  const clockOutBtn = document.querySelector("[data-action='clock-out']");
  const updateProfileBtn = document.querySelector(
    "[data-action='update-profile']"
  );

  if (applyLeaveBtn) applyLeaveBtn.addEventListener("click", applyForLeave);
  if (clockInBtn) clockInBtn.addEventListener("click", clockIn);
  if (clockOutBtn) clockOutBtn.addEventListener("click", clockOut);
  if (updateProfileBtn)
    updateProfileBtn.addEventListener("click", updateProfile);

  const logoutBtn = document.querySelector("[data-action='logout']");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
});

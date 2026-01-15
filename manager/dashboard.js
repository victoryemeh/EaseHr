// Manager Dashboard API Integration
let allEmployees = [];
let allLeaves = [];

// Initialize dashboard on page load
document.addEventListener("DOMContentLoaded", async () => {
  const token = TokenManager.getToken();
  const role = TokenManager.getRole();

  // Redirect if not authenticated or not a manager
  if (!token || role !== "manager") {
    window.location.href = "../Onboarding/select-role.html";
    return;
  }

  try {
    // Load all employees
    await loadEmployees();
    // Load all leaves for manager to review
    await loadLeaves();
    // Update header with manager info
    updateManagerHeader();
  } catch (error) {
    showError("Failed to load dashboard: " + error.message);
  }
});

// Load all employees
async function loadEmployees() {
  try {
    const response = await EmployeeAPI.getAll();
    allEmployees = response.data || [];
    renderEmployeeList();
  } catch (error) {
    console.error("Error loading employees:", error);
    showError("Could not load employees");
  }
}

// Load all leaves for approval
async function loadLeaves() {
  try {
    const response = await LeaveAPI.getAll();
    allLeaves = response.data || [];
    renderLeaveRequests();
  } catch (error) {
    console.error("Error loading leaves:", error);
    showError("Could not load leave requests");
  }
}

// Update manager header with name
function updateManagerHeader() {
  const managerName = localStorage.getItem("easehr_managerName") || "Manager";
  const headerTitle = document.querySelector(".header-title");
  if (headerTitle) {
    headerTitle.textContent = managerName;
  }
}

// Render employee list in the dashboard
function renderEmployeeList() {
  const staffContainer = document.querySelector(".attendance-section");
  if (!staffContainer) return;

  // Get the staff item container (should be inside a card)
  const staffItems =
    staffContainer.querySelector(".staff-items") ||
    staffContainer.parentElement.querySelector(".staff-items");

  if (!staffItems) return;

  staffItems.innerHTML = "";

  if (allEmployees.length === 0) {
    staffItems.innerHTML =
      '<p style="padding: 12px 0; color: #64748b;">No employees found</p>';
    return;
  }

  allEmployees.slice(0, 5).forEach((employee) => {
    const staffItem = document.createElement("div");
    staffItem.className = "staff-item";
    staffItem.innerHTML = `
      <div class="staff-left">
        <div class="staff-indicator"></div>
        <span class="staff-name">${employee.name}</span>
      </div>
      <span style="font-size: 12px; color: #64748b;">${employee.email}</span>
    `;
    staffItem.addEventListener("click", () => {
      viewEmployeeLeaves(employee.id);
    });
    staffItems.appendChild(staffItem);
  });

  // Add "View All" link
  const viewAllLink = document.createElement("div");
  viewAllLink.className = "view-all";
  viewAllLink.innerHTML =
    '<a href="#" style="color: #14b8a6; text-decoration: none; font-size: 14px;">View all employees →</a>';
  viewAllLink.addEventListener("click", (e) => {
    e.preventDefault();
    showAllEmployees();
  });
  staffItems.appendChild(viewAllLink);
}

// Render leave requests for approval
function renderLeaveRequests() {
  const leaveContainer = document.getElementById("leave-requests-container");
  if (!leaveContainer) {
    console.warn("Leave requests container not found");
    return;
  }

  leaveContainer.innerHTML = "";

  const pendingLeaves = allLeaves.filter((leave) => leave.status === "pending");

  if (pendingLeaves.length === 0) {
    leaveContainer.innerHTML =
      '<p style="padding: 16px; color: #64748b; text-align: center;">No pending leave requests</p>';
    return;
  }

  pendingLeaves.forEach((leave) => {
    const leaveCard = document.createElement("div");
    leaveCard.className = "card leave-request";
    leaveCard.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${leave.employeeName || "Employee"}</div>
          <div class="card-subtitle">${leave.fromDate} to ${leave.toDate}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${
            leave.reason
          }</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button class="btn-approve" data-leave-id="${
          leave.id
        }" style="flex: 1; padding: 8px; background: #14b8a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Approve</button>
        <button class="btn-reject" data-leave-id="${
          leave.id
        }" style="flex: 1; padding: 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Reject</button>
      </div>
    `;

    // Add event listeners
    leaveCard.querySelector(".btn-approve").addEventListener("click", () => {
      approveLeave(leave.id, leaveCard);
    });
    leaveCard.querySelector(".btn-reject").addEventListener("click", () => {
      rejectLeave(leave.id, leaveCard);
    });

    leaveContainer.appendChild(leaveCard);
  });
}

// Approve leave request
async function approveLeave(leaveId, cardElement) {
  try {
    await LeaveAPI.approve(leaveId);
    showSuccess("Leave approved successfully");
    cardElement.remove();
    // Reload leaves
    await loadLeaves();
  } catch (error) {
    showError("Failed to approve leave: " + error.message);
  }
}

// Reject leave request
async function rejectLeave(leaveId, cardElement) {
  try {
    await LeaveAPI.reject(leaveId);
    showSuccess("Leave rejected successfully");
    cardElement.remove();
    // Reload leaves
    await loadLeaves();
  } catch (error) {
    showError("Failed to reject leave: " + error.message);
  }
}

// View specific employee's leave history
async function viewEmployeeLeaves(employeeId) {
  try {
    const leaveHistory = await LeaveAPI.getEmployeeLeaves(employeeId);
    const employee = allEmployees.find((e) => e.id === employeeId);

    if (!employee) return;

    // Display in a modal or redirect to detail page
    alert(
      `Leave history for ${employee.name}:\n\n${
        leaveHistory.data
          ? leaveHistory.data
              .map((l) => `${l.fromDate} - ${l.toDate}: ${l.status}`)
              .join("\n")
          : "No leave records"
      }`
    );
  } catch (error) {
    showError("Failed to load leave history: " + error.message);
  }
}

// Show all employees
function showAllEmployees() {
  const content = `
    <div style="background: white; border-radius: 8px; padding: 16px; margin-top: 16px;">
      <h3 style="margin-bottom: 16px;">All Employees</h3>
      <div id="all-employees-list" style="display: flex; flex-direction: column; gap: 8px;">
        ${allEmployees
          .map(
            (emp) => `
          <div style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600;">${emp.name}</div>
              <div style="font-size: 12px; color: #64748b;">${emp.email}</div>
            </div>
            <button onclick="viewEmployeeProfile('${emp.id}')" style="padding: 6px 12px; background: #14b8a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">View</button>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  const container = document.querySelector(".content");
  if (container) {
    const modal = document.createElement("div");
    modal.innerHTML = content;
    modal.id = "employees-modal";
    container.appendChild(modal);
  }
}

// View employee profile
async function viewEmployeeProfile(employeeId) {
  try {
    const employee = await EmployeeAPI.getById(employeeId);
    alert(`
Employee Profile:
Name: ${employee.data.name}
Email: ${employee.data.email}
Role: ${employee.data.role}
    `);
  } catch (error) {
    showError("Failed to load employee profile: " + error.message);
  }
}

// Create shift
async function createShift() {
  const shiftName = prompt("Enter shift name (e.g., Morning):");
  if (!shiftName) return;

  const startTime = prompt("Enter start time (e.g., 09:00):");
  if (!startTime) return;

  const endTime = prompt("Enter end time (e.g., 17:00):");
  if (!endTime) return;

  try {
    const response = await ShiftAPI.create(shiftName, startTime, endTime);
    showSuccess("Shift created successfully");
    return response.data.id;
  } catch (error) {
    showError("Failed to create shift: " + error.message);
  }
}

// Assign shift to employee
async function assignShiftToEmployee(shiftId, employeeId) {
  try {
    await ShiftAPI.assign(shiftId, employeeId);
    showSuccess("Shift assigned successfully");
  } catch (error) {
    showError("Failed to assign shift: " + error.message);
  }
}

// Logout handler
function handleLogout() {
  TokenManager.clear();
  window.location.href = "../Onboarding/select-role.html";
}

// Add logout button handler if it exists
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

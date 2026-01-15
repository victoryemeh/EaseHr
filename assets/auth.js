// assets/js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  if (!role) {
    window.location.href = "select-role.html";
  }
});
function selectRole(role) {
  localStorage.setItem("easehr_role", role);

  if (role === "employee") {
    window.location.href = "employee-login.html";
  } else {
    window.location.href = "manager-login.html";
  }
}

// Handle login submit (MVP logic)
document.addEventListener("DOMContentLoaded", () => {
  const employeeForm = document.getElementById("employeeLoginForm");
  const managerForm = document.getElementById("managerLoginForm");

  if (employeeForm) {
    employeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("easehr_user", "employee");
      window.location.href = "../employee/dashboard.html";
    });
  }

  if (managerForm) {
    managerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("easehr_user", "manager");
      window.location.href = "../manager/dashboard.html";
    });
  }
});
// Handle employee signup
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("employeeSignupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = signupForm.querySelectorAll("input");
      const password = inputs[3].value;
      const confirmPassword = inputs[4].value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // MVP storage (to be replaced by backend)
      localStorage.setItem("easehr_role", "employee");
      localStorage.setItem("easehr_signup_complete", "true");

      // Redirect to verification page (next step)
      window.location.href = "verify-account.html";
    });
  }
});
// Handle account verification
document.addEventListener("DOMContentLoaded", () => {
  const verifyForm = document.getElementById("verifyForm");

  if (verifyForm) {
    verifyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const role = localStorage.getItem("easehr_role");

      // MVP: assume verification is successful
      localStorage.setItem("easehr_verified", "true");

      if (role === "employee") {
        window.location.href = "../employee/dashboard.html";
      } else if (role === "manager") {
        window.location.href = "../manager/dashboard.html";
      } else {
        window.location.href = "select-role.html";
      }
    });
  }
});
// Auto-focus OTP inputs
document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp-group input");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value && otpInputs[index + 1]) {
        otpInputs[index + 1].focus();
      }
    });
  });
});

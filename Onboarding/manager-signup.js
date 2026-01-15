// Image asset constants (from Figma design context) - valid ~7 days
const imgChatGptImageDec302025102157Am2 =
  "https://www.figma.com/api/mcp/asset/b7fd66e3-c274-4e56-a27d-7ab45a9d2f66";
const imgIcBaselinePhone =
  "https://www.figma.com/api/mcp/asset/5bd60be1-630f-4211-89b3-ab641df39d04";
const imgVector =
  "https://www.figma.com/api/mcp/asset/210fd059-d4c0-491e-a0f2-ec3b6581a499";
const img =
  "https://www.figma.com/api/mcp/asset/f2ed2419-4228-44f5-9cde-1837ba3423d4";
const img1 =
  "https://www.figma.com/api/mcp/asset/3d8edb6c-2518-4ea1-b20e-63d6530475ca";
const img2 =
  "https://www.figma.com/api/mcp/asset/72a808a3-72c6-4789-8152-76a638b73a08";
const imgGroup =
  "https://www.figma.com/api/mcp/asset/d242c74b-d484-4bf6-90fb-1d87b04b0f56";
const img3 =
  "https://www.figma.com/api/mcp/asset/c828da28-afd0-458d-b5d8-d4d4766689b2";
const img4 =
  "https://www.figma.com/api/mcp/asset/bbffa07f-da38-423c-88ee-65db9851eda7";
const img5 =
  "https://www.figma.com/api/mcp/asset/b81794e7-b7d9-4b59-ae66-a4c415a7c47b";
const img6 =
  "https://www.figma.com/api/mcp/asset/7f34389e-fec6-4ef1-a425-a4571785154b";
const img7 =
  "https://www.figma.com/api/mcp/asset/9fd2b0aa-0aa1-420d-b063-9cd2e6e28496";
const img8 =
  "https://www.figma.com/api/mcp/asset/98d3bbbf-f672-48d2-9565-bd94db86b4eb";
const img9 =
  "https://www.figma.com/api/mcp/asset/e5a466cd-cb14-46f8-bfc2-a10d15d7ce55";

// Manager Signup Handler
document.addEventListener("DOMContentLoaded", () => {
  const setSrc = (id, url) => {
    const el = document.getElementById(id);
    if (el) el.src = url;
  };

  // Set image sources
  setSrc("logoImg", imgChatGptImageDec302025102157Am2);
  setSrc("backBtnImg", imgGroup);
  setSrc("signalImg", img);
  setSrc("wifiImg", img1);
  setSrc("batteryImg", img2);

  // input icons
  setSrc("iconCompany", img3);
  setSrc("iconEmail", img4);
  setSrc("iconDesc", img5);
  setSrc("iconLocation", img6);
  setSrc("iconUser", img7);
  setSrc("iconEmail2", img4);
  setSrc("iconPhone", imgIcBaselinePhone);
  setSrc("iconRole", img8);
  setSrc("iconLock", img9);

  // Handle manager signup form submission
  const form = document.getElementById("registerForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      // Get manager's name from personal information section
      const inputs = form.querySelectorAll("input");
      const managerName = inputs[4]?.value; // Full name field
      const managerEmail = inputs[5]?.value; // Email field
      const password = inputs[8]?.value; // Password field
      const confirmPassword = inputs[9]?.value; // Confirm password (if exists)

      // Validate inputs
      if (!managerName || !managerEmail || !password) {
        showError("Please fill in all required fields");
        return;
      }

      if (!Validator.email(managerEmail)) {
        showError("Please enter a valid email address");
        return;
      }

      if (!Validator.password(password)) {
        showError("Password must be at least 6 characters long");
        return;
      }

      try {
        const response = await AuthAPI.register(
          managerName,
          managerEmail,
          password,
          "manager"
        );

        TokenManager.setToken(response.token);
        TokenManager.setRole("manager");
        TokenManager.setUserId(response.id);

        showSuccess("Manager account created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "../Onboarding/verify-account.html";
        }, 1500);
      } catch (error) {
        showError(error.message);
      }
    });
  }
});

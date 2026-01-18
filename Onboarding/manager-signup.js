// Image asset constants (from Figma design context) - valid ~7 days
// NOTE: We now prefer local assets placed under ../assets/ when available,
// and fall back to these temporary Figma URLs.
const imgChatGptImageDec302025102157Am2 =
  "https://www.figma.com/api/mcp/asset/bd0a7c91-91b1-4768-8ae1-4a659c44072d";
const imgIcBaselinePhone =
  "https://www.figma.com/api/mcp/asset/27202040-5c52-4bf9-af55-f2bb4258c8ac";
const imgVector =
  "https://www.figma.com/api/mcp/asset/e98f759f-1598-4dab-9a34-1d86e0f15245";
const img =
  "https://www.figma.com/api/mcp/asset/97f30744-6665-400f-999e-7afc78ea787a";
const img1 =
  "https://www.figma.com/api/mcp/asset/e78dbd4a-36c2-4066-9810-4a07f51f56de";
const img2 =
  "https://www.figma.com/api/mcp/asset/c6213fa2-2141-4448-9787-10308e771f43";
const imgGroup =
  "https://www.figma.com/api/mcp/asset/10e0ebeb-242b-4398-b0bd-a84b3e64680f";
const img3 =
  "https://www.figma.com/api/mcp/asset/d19cccfe-ccb3-4e88-8149-eef71ce4d2f7";
const img4 =
  "https://www.figma.com/api/mcp/asset/5c589a98-0735-4e8c-8992-b92f6a12944b";
const img5 =
  "https://www.figma.com/api/mcp/asset/22b81908-d190-44f8-a124-4671e917028b";
const img6 =
  "https://www.figma.com/api/mcp/asset/fde39015-fc6a-4050-9ca6-896ea281baa3";
const img7 =
  "https://www.figma.com/api/mcp/asset/a0cb05e6-1fe4-46e1-b3a7-998c524ae29a";
const img8 =
  "https://www.figma.com/api/mcp/asset/802f9542-eb3b-4dfb-9661-2cdad80b4ac2";
const img9 =
  "https://www.figma.com/api/mcp/asset/3a86ec10-2c89-439e-9df1-26763b815211";

// Local asset paths (relative to this JS used by Onboarding HTML)
const ASSETS_BASE = "../assets/";
const LOCAL = {
  logoImg: ASSETS_BASE + "small%20EaseHr%20logo.png",
  iconUser: ASSETS_BASE + "carbon_user-avatar-filled.svg",
  iconCompany: ASSETS_BASE + "iconCompany.svg",
  iconEmail: ASSETS_BASE + "iconEmail.svg",
  iconDesc: ASSETS_BASE + "iconDesc.svg",
  iconLocation: ASSETS_BASE + "iconLocation.svg",
  iconEmail2: ASSETS_BASE + "iconEmail.svg",
  iconPhone: ASSETS_BASE + "iconPhone.svg",
  iconRole: ASSETS_BASE + "iconRole.svg",
  iconLock: ASSETS_BASE + "iconLock.svg",
};

// Manager Signup Handler
document.addEventListener("DOMContentLoaded", () => {
  const setSrcPreferLocal = (id, localPath, remoteUrl) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (localPath) {
      el.src = localPath;
      // If local fails (not found), fall back to remote
      el.onerror = () => {
        if (remoteUrl) el.src = remoteUrl;
      };
    } else if (remoteUrl) {
      el.src = remoteUrl;
    }
  };

  // Set image sources
  setSrcPreferLocal(
    "logoImg",
    LOCAL.logoImg,
    imgChatGptImageDec302025102157Am2,
  );
  setSrcPreferLocal("backBtnImg", null, imgGroup);
  setSrcPreferLocal("signalImg", null, img);
  setSrcPreferLocal("wifiImg", null, img1);
  setSrcPreferLocal("batteryImg", null, img2);

  // input icons
  setSrcPreferLocal("iconCompany", LOCAL.iconCompany, img3);
  setSrcPreferLocal("iconEmail", LOCAL.iconEmail, img4);
  setSrcPreferLocal("iconDesc", LOCAL.iconDesc, img5);
  setSrcPreferLocal("iconLocation", LOCAL.iconLocation, img6);
  setSrcPreferLocal("iconUser", LOCAL.iconUser, img7);
  setSrcPreferLocal("iconEmail2", LOCAL.iconEmail2, img4);
  setSrcPreferLocal("iconPhone", LOCAL.iconPhone, imgIcBaselinePhone);
  setSrcPreferLocal("iconRole", LOCAL.iconRole, img8);
  setSrcPreferLocal("iconLock", LOCAL.iconLock, img9);

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
          "manager",
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

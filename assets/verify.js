document.querySelector("form").addEventListener("submit", function () {
  const role = localStorage.getItem("role");

  if (role === "employee") {
    window.location.href = "../employee/dashboard.html";
  } else {
    window.location.href = "../manager/dashboard.html";
  }
});

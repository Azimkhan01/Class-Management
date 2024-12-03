
const studentBtn = document.getElementById("studentBtn");
const staffBtn = document.getElementById("staffBtn");
const studentLoginForm = document.getElementById("studentLogin");
const staffLoginForm = document.getElementById("staffLogin");
studentBtn.addEventListener("click", () => {
    studentLoginForm.style.display = "block";
    staffLoginForm.style.display = "none";
});
staffBtn.addEventListener("click", () => {
    staffLoginForm.style.display = "block";
    studentLoginForm.style.display = "none";
});
const studentPasswordField = document.getElementById("studentPassword");
const showStudentPassword = document.getElementById("showStudentPassword");

showStudentPassword.addEventListener("change", () => {
    studentPasswordField.type = showStudentPassword.checked ? "text" : "password";
});
const staffPasswordField = document.getElementById("staffPassword");
const showStaffPassword = document.getElementById("showStaffPassword");

showStaffPassword.addEventListener("change", () => {
    staffPasswordField.type = showStaffPassword.checked ? "text" : "password";
});

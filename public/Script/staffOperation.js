const addStaff = document.getElementById("addStaff");
const error = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
let isform = false;
const staffAddingForm = document.getElementById("staffAddingForm");
addStaff.addEventListener("click", () => {
  staffAddingForm.style.display = isform ? "none" : "block";
  isform = !isform;
});

//handling the staff data
const handleStaffDetails = document.getElementById("handleStaffDetails");

handleStaffDetails.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    error.style.display = "flex";
    errorMessage.innerHTML = "Confirm Password and Password not Matched";
    return; // Stop the form submission if passwords don't match
  }

  const formData = new FormData(handleStaffDetails);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  try {
    let response = await fetch(`${window.location.origin}/addStaff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      if (data.error) {
        error.style.display = "flex";
        errorMessage.innerHTML = "Email already Exist";
      } else {
        error.style.display = "flex";
        errorMessage.innerHTML = data.status;
      }
      // handleStaffDetails.reset();
    } else {
      console.error("Error adding staff:", response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
});

// password checking
const confirmPassword = document.getElementById("confirmPassword");
const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
showPassword.addEventListener("click", (e) => {
  if (confirmPassword.type == "password") {
    confirmPassword.type = "text";
    password.type = "text";
    e.target.textContent = "Hide Password";
  } else {
    confirmPassword.type = "password";
    password.type = "password";
    e.target.textContent = "Show Password";
  }
});

//error handling div

const removeError = document.getElementById("remove-error");
removeError.addEventListener("click", (e) => {
  error.style.display = "none";
});

const teacherSubject = document.getElementById("teacherSubject");
const teacherSubjectDiv = document.getElementById("teacherSubjectDiv");
const teacherStandard = document.getElementById("teacherStandard");
const teacherStandardInWhichTheyWillTeach = document.getElementById('teacherStandardInWhichTheyWillTeach')

const addInput = [teacherStandard, teacherSubject];
addInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    // e.target.nextElementSibling.innerHTML = '';
    let s = ''
    for(i=0;i<e.target.value;i++){
      s += `<input type="text" name="${e.target.name}-${i}" placeholder="Subject ${i+1}" required>`
    }
    e.target.nextElementSibling.innerHTML = s;

  });
});
const tfb = document.getElementById('teacher-form-button');
const teacherForm  = document.getElementById('teacher-form');
teacherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(teacherForm);
  const formObject = {};
  formData.forEach((value, key) => {
    if(value == ''){
    error.style.display = "flex";
    errorMessage.innerHTML = "Please fill all the fields";
    
      tfb.disabled = true
    }else
    formObject[key] = value;
    tfb.disabled = false
  });

}); 
const tfd = document.getElementById('teacher-form-div');
const addTeacher = document.getElementById('addTeacher');
let isformTeacher = false;
addTeacher.addEventListener('click', () => {
 tfd.style.display = isformTeacher ? "none" : "block";
 tfb.style.display = isformTeacher ? "none" : "block";
  isformTeacher = !isformTeacher;
  
});
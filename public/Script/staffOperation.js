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
const selectedStandard = [];
fetch(`${window.location.origin}/getBatches`).then(res => res.json()).then((data) => {
  // console.log(data)
  data.forEach((d) => {
    let div = document.createElement('div');
    let label = document.createElement('label');
    label.textContent = d.batchName + '-' + d.batchStandard + ' ';
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedStandard.push(d["_id"]);
        // console.log(selectedStandard);
      } else {
        selectedStandard.splice(selectedStandard.indexOf(d["_id"]), 1)
        // console.log(selectedStandard);
      }
    })
    div.appendChild(label);
    div.appendChild(input);
    teacherStandardInWhichTheyWillTeach.appendChild(div);
  })
})


teacherSubject.addEventListener("input", (e) => {
  // e.target.nextElementSibling.innerHTML = '';
  let s = ''
  for (i = 0; i < e.target.value; i++) {
    s += `<input class='classTeacherSelected' type="text" name="${e.target.name}-${i}" placeholder="Subject ${i + 1}" required>`
  }
  e.target.nextElementSibling.innerHTML = s;

});
const tfb = document.getElementById('teacher-form-button');
const teacherForm = document.getElementById('teacher-form');
teacherForm.addEventListener('submit', (e) => {
  // console.log('clicked')
  e.preventDefault();
  const formData = new FormData(teacherForm);
  const formObject = {};
  formData.forEach((value, key) => {
    if (value == '') {
      error.style.display = "flex";
      errorMessage.innerHTML = "Please fill all the fields";
      tfb.disabled = true;
    } else {
      formObject[key] = value;
      tfb.disabled = false;
    }

  });
  // console.log(formObject);
  // Convert teacherSubject to a number
  let n = Number(formObject.teacherSubject);

  // Extract last n entries
  let lastNElements = Object.entries(formObject).slice(-n);

  // Convert back to an object if needed
  let lastNObject = Object.fromEntries(lastNElements);
  let { teacherName, teacherShort, teacherSubject } = formObject;
  if (tfb.disabled != true) {
    try {
      fetch(`${window.location.origin}/addTeacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ subjects: lastNObject, teacherName, teacherShort, teacherSubject, teacherStandard: selectedStandard })
      }).then(res => res.json()).then(data => {
        if (data.error) {
          error.style.display = "flex";
          errorMessage.innerHTML = data.error;
        }
        else {
          error.style.display = "flex";
          errorMessage.innerHTML = data.status;
        }
      }
      )
    } catch (error) {
      console.error('Network Error:', error)
    }
  }
});
const tfd = document.getElementById('teacher-form-div');
const addTeacher = document.getElementById('addTeacher');
let isformTeacher = false;
addTeacher.addEventListener('click', () => {
  tfd.style.display = isformTeacher ? "none" : "block";
  tfb.style.display = isformTeacher ? "none" : "block";
  isformTeacher = !isformTeacher;
});

const showData = () => {
  const ShowTeacher = document.getElementById('teachers')
  try {

    fetch(`${window.location.origin}/getTeacher`).then(res => res.json()).then((response) => {
      let s = ''
      let a = ''
      let b = ''
      if (response.status) {
        response.data.forEach((e) => {
          a = ''

          Object.values(e.teacherSubject[0]).forEach((e) => {
            a += ` <li>${e}</li>`
          })


          s += `
       <div class="teacher-card">
            <div class="teacher-card-info">
                <p>Name : ${e.teacherName}</p>
                <p>Short Name : ${e.teacherShort}</p>
                <p>Total Subject : ${e.totalSubjects}</p>
                <p>Total Standard : ${e.totalStandards}</p>
            </div>
            <div class="teacher-common teacher-subject">
                <div>
                    <h6>Subject</h6>
                </div>
                <div>
                   ${a}
                </div>
            </div>
            <div>
               <div>
               <button onClick="handleTeacherDelete('${e['_id']}')">Delete</button>
               </div>

            </div>
        </div>
      `
        })
        ShowTeacher.innerHTML = s
      } else {
        ShowTeacher.innerHTML = `<p>No Teacher is Added ${(response.message) ? response.message : ''}</p>`
        throw Error(error.message)
      }
    })

  } catch (error) {
    console.log("Error Found in Showing the Teacher:", error)
  }
}

const showTeac = document.getElementById('showStudent');
const teachersElement = document.getElementById('teachers');
let isShowTeacher = false;

showTeac.addEventListener('click', () => {
  if (isShowTeacher) {
    teachersElement.style.display = 'none';
  } else {
    if (teachersElement.style.display === '' || teachersElement.style.display === 'none') {
      teachersElement.style.display = 'flex';
      showData();
    } else {
      showData(); // Assuming this function is defined elsewhere
    }
  }
  isShowTeacher = !isShowTeacher; // Toggle the state
});


// teacher delete function
function handleTeacherDelete(id) {

  try {
    fetch(`${window.origin}/deleteTeacher/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then((res) => {
      console.log(res);
      if (res.status) { showData() }
      else { throw Error(res.message) }
    })
  } catch (error) {
    console.log("Error happen why deleting the Teacher data:>", error)
  }

}
// All IDs will be listed here
const search = document.getElementById("search");
const searchBox = document.getElementById("searchBox");
const searchBody = document.getElementById("searchBody");
const ShowStudent = document.getElementById("ShowStudent");
const studentBatch = document.getElementById("studentBatch");
const studentBox = document.getElementById("studentBox");
const studentBody = document.getElementById("StudentBody");
const totalSubject = document.getElementById('totalSubject');
const subjectNameEntry = document.getElementById('subjectNameEntry');
const batchSelect = document.getElementById('batchSelect');
const classSelect = document.getElementById('classSelect');
const MarksForm = document.getElementById('MarksForm');
const MarksFormContainer = document.getElementById('MarksFormContainer');
const entrySubmitButton = document.getElementById('entrySubmitButton');
const ShowTest = document.getElementById('ShowTest');
const navigationofAttendance = document.getElementById('navigationofAttendance');
const std = new Set();
let openShowStudent = true;
let openMarksForm = true;
let openFormBtn = true;
// Add event listener
search.addEventListener("input", async e => {
  const searchValue = e.target.value.trim(); // Trim extra spaces
  if (searchValue.length > 0) {
    searchBox.style.display = "block";
    try {
      const response = await fetch(`${window.location.origin}/getStudents`);
      const students = await response.json();

      // Call searchBoxUpdate to display results
      searchBoxUpdate(searchValue, students);
    } catch (error) {
      alert("The error occurred while searching: " + error.message);
    }
  } else {
    searchBox.style.display = "none";
    searchBody.innerHTML = ""; // Clear previous results
  }
});

// hide and show of the student show table
ShowStudent.addEventListener("click", e => {
  if (openShowStudent) {
    studentBox.style.display = "block";
    studentBatch.style.display = "flex";
  } else {
    studentBox.style.display = "none";
    studentBatch.style.display = "none";
  }
  openShowStudent = !openShowStudent;
});

totalSubject.addEventListener("input",async(e)=>{
  handleTotalSubject(e);
})

studentBathcButton();

MarksForm.addEventListener('click',()=>{
MarksFormContainer.style.display = openMarksForm ? "block" : "none"
openMarksForm = !openMarksForm 
})

ShowTest.addEventListener('click',async(e) =>{
handleShowTest(e);
});
// Functions

// Searching and updating the searchBox
function searchBoxUpdate(value, students) {
  searchBody.innerHTML = ""; // Clear previous results in searchBody

  students.forEach(student => {
    const { name, studentid } = student;

    // Check for matches
    if (
      name.toLowerCase().includes(value.toLowerCase()) ||
      studentid.includes(value)
    ) {
      // Create a result row
      const resultRow = document.createElement("tr");

      resultRow.innerHTML = `
        <td><img src="${"/public/Assets/Student_Images/" + student.image ||
          "https://via.placeholder.com/50"}" alt="${name}"></td>
        <td>${studentid}</td>
        <td>${name.toUpperCase()}</td>
        <td>${student.class}</td>
        <td>${student.batch.toUpperCase()}</td>
        <td><button onclick="handleView('${student["_id"]}')">View</button></td>
        <td><button onclick='handleUpdate("${student['_id']}")'>Update</button></td>
      `;
      searchBody.appendChild(resultRow); // Append result row to tbody
    }
  });

  // If no matches found, show "No results found"
  if (searchBody.innerHTML.trim() === "") {
    const noResultRow = document.createElement("tr");
    noResultRow.innerHTML = "<td colspan='7'>No results found</td>";
    searchBody.appendChild(noResultRow);
  }
}

// View function to handle the redirection
function handleView(id) {
  window.open(`${window.location.origin}/view/${id}`, "_blank");
}

// studentBathcButton
async function studentBathcButton() {
  try {
    let response = await fetch(`${window.location.origin}/getBatches`);
    let batches = await response.json();
   if(batches.length > 0)
   {
    let s = "";
    batches.forEach(element => {
      s += ` <button onClick="handleStudentBox('${element.batchStandard}','${element.batchName}')">${element.batchName.toUpperCase()} - ${element.batchStandard} - ${element.batchYear}</button>`;
    });
    studentBatch.innerHTML = s;
    batches.forEach(element => {
      let option = document.createElement("option")
      option.value = element.batchName
      option.innerText = (element.batchName).toUpperCase();
      batchSelect.appendChild(option);

      if(!std.has(element.batchStandard))
      {
        std.add(element.batchStandard)
        let c = document.createElement('option')
        c.value = element.batchStandard
        c.innerText = element.batchStandard
        classSelect.appendChild(c);
      }
      
    });
   }else{
    console.log(batches.message)
   }
  } catch (error) {
    console.log("the error is :", error);
  }
}

// handling the studentBox
async function handleStudentBox(a, b) {
  try {
    let response = await fetch(
      `${window.location.origin}/getStudents?batch=${b}&class=${a}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    let data = await response.json();
    // console.log(data);
    studentBody.innerHTML = "";
    data.forEach(student => {
      const resultRow = document.createElement("tr");

      resultRow.innerHTML = `
        <td><img src="${"/public/Assets/Student_Images/" + student.image ||
          "https://via.placeholder.com/50"}" alt="${student.name}"></td>
        <td>${student.studentid}</td>
        <td>${student.name.toUpperCase()}</td>
        <td>${student.class}</td>
        <td>${student.batch.toUpperCase()}</td>
        <td><button onclick="handleView('${student["_id"]}')">View</button></td>
        <td><button onclick='handleUpdate("${student['_id']}")'>Update</button></td>
      `;
      studentBody.appendChild(resultRow);
    });
    if (studentBody.innerHTML.trim() === "") {
      const noResultRow = document.createElement("tr");
      noResultRow.innerHTML = "<td colspan='7'>No results found</td>";
      studentBody.appendChild(noResultRow);
    }
  } catch (error) {
    console.error("Error fetching students:", error.message);
  }
}

// subject handling for total subject in form entry marks

async function handleTotalSubject(e) {
  // Container for subject inputs
  const subjectNameEntry = document.getElementById('subjectNameEntry');

  // Validate the input number
  if (e.target.value > 12 || e.target.value < 0) {
      e.target.value = 0; // Reset to 0 if out of range
  } else {
      const totalSubjects = parseInt(e.target.value, 10);

      // Clear the container
      subjectNameEntry.innerHTML = '';

      // Recreate inputs with preserved values
      for (let i = 0; i < totalSubjects; i++) {
          let input = document.createElement("input");
          input.id = `subject-${i + 1}`;
          input.className = "subjectName";
          input.type = "text";
          input.required = true   
          input.placeholder = `Enter Subject ${i + 1}`;
          subjectNameEntry.appendChild(input);
      }
  }
}
// submit button on click function

async function handleEntryForm() {
  const EntryVal = {
      testClass: classSelect.value !== "" ? classSelect.value : null,
      batch: batchSelect.value,
      topic: document.getElementById("testTopic").value,
      note: document.getElementById("note").value
  };

  // Check if class is selected, if not disable the submit button and stop the function
  if (!EntryVal.testClass) {
      entrySubmitButton.disabled = true;
      console.error("Class is not selected. Form submission disabled.");
      alert("Please select a class.");
      return;
  } else {
      entrySubmitButton.disabled = false;
  }

  // Collect subject values from the dynamically created input fields
  const subjectName = document.querySelectorAll(".subjectName");
  const subjectValues = Array.from(subjectName).map(input => input.value);
  EntryVal.subjects = subjectValues;

  console.log("Form Data:", EntryVal);

  try {
      // Send the form data to the server using fetch
      const response = await fetch(`${window.location.origin}/addMarks`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(EntryVal)
      });

      // Handle server response
      if (response.ok) {
          const result = await response.json();
          console.log("Success:", result);
          alert("Marks submitted successfully!");
      } else {
          const errorData = await response.json();
          console.error("Error submitting form:", response.status, errorData);
          alert("Error submitting the form. Please try again.");
      }
  } catch (error) {
      console.error("Network Error:", error);
      alert("Network error occurred. Please check your connection and try again.");
  } finally {
      // Re-enable the submit button after the operation is complete
      entrySubmitButton.disabled = false;
  }
}

// handleShowTest
async function handleShowTest(e)
{

  if(openFormBtn)
  {

    navigationofAttendance.style.display = "flex";
    try{

      let response = await fetch(`${window.location.origin}/getTests`) 
let data = await response.json();
if(data)
{navigationofAttendance.innerHTML = ''
  data.forEach(element => {
    let div = document.createElement('div')
    div.className = 'testHere'
    let a = document.createElement('a')
    a.href = `/markEntry/${element.batch}/${element.testClass}/${element.topic}`
    a.innerText = `${(element.batch).toUpperCase()} - ${element.testClass} - ${(element.topic).toUpperCase()}`
    a.target = "_blank";
    div.appendChild(a);
    
    navigationofAttendance.appendChild(div);
  });
}else{
  navigationofAttendance.innerHTML = `<div>${element.status || "try in some time may be error happened"}</div>`
}
    }catch(error){
      console.log(error)
    }

  }else{
navigationofAttendance.style.display = "none"
  }
 openFormBtn = !openFormBtn

}

function handleUpdate(id)
{
  window.open(`${window.location.origin}/updateStudent/${id}`,"_blank")
}



// serch visaibility

const search = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const studentResults = document.getElementById("searchResults");
const searchTotal = document.getElementById("searchTotal");
const test = document.getElementById("test");
let testOpen = true;
const testSheet = document.getElementById("testSheet");
test.addEventListener("click", (e) => {
  testSheet.style.display = testOpen ? "block" : "none";
  testOpen = !testOpen;
});
var searchOpen = true;
search.addEventListener("click", () => {
  searchInput.style.display = searchOpen ? "flex" : "none";
  searchResults.style.display = searchOpen ? "block" : "none";
  searchOpen = !searchOpen;
});

const findStudent = document.getElementById("findStudent");

findStudent.addEventListener("input", async (e) => {
  const query = e.target.value.trim(); // Get the search input and trim spaces

  if (query.length > 0) {
    // Check if input is non-empty
    try {
      // Fetch all students
      const studentsResponse = await fetch(
        `${window.location.origin}/getStudents`
      );
      if (!studentsResponse.ok) {
        throw new Error(
          `Error: ${studentsResponse.status} ${studentsResponse.statusText}`
        );
      }

      const students = await studentsResponse.json();
      const filteredStudents = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.studentid.includes(query)
      );
      filteredStudents.sort(
        (a, b) => Number(a.studentid) - Number(b.studentid)
      );
      searchTotal.textContent = `Total:${filteredStudents.length}`;
      if (filteredStudents.length > 0) {
        let studentTable = `
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Student ID</th>
                <th>Batch</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
        `;

        filteredStudents.forEach((student) => {
          studentTable += `
            <tr>
              <td><img src="${window.location.origin
            }/public/Assets/Student_Images/${student.image || "default-image.jpg"
            }" alt="${student.name}" width="50" height="50"></td>
              <td>${student.name}</td>
              <td>${student.studentid}</td>
              <td>${student.batch}</td>
              <td>${student.gender}</td>
              <td>${student.age}</td>
              <td>
                <button onClick="handleView('${student["_id"]
            }')" class="actionButton">View</button>
              </td>
            </tr>`;
        });

        studentTable += `</tbody></table>`;
        studentResults.innerHTML = studentTable;
        searchTotal.textContent = `Total:${0}`;
      } else {
        studentResults.innerHTML = `<p>No students match your search.</p>`;
        searchTotal.textContent = `Total:${0}`;
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      studentResults.innerHTML = `<p>Error loading students...</p>`;
      searchTotal.textContent = `Total:${0}`;
    }
  } else {
    studentResults.innerHTML = `<p>Please enter a search term to find students.</p>`;
    searchTotal.textContent = `Total:${0}`;
  }
});

const container = document.getElementById("container");
async function fetchData() {
  try {
    const response = await fetch(`${window.location.origin}/getBatches`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    data.sort((a, b) => a.batchStandard - b.batchStandard);
    // console.log(data);

    let s = "";
    if (data.length > 0) {
      data.forEach((element) => {
        s += `
          <div class="staffHandler">
            <div>
              <p>${(element.batchName || "").toUpperCase()} - ${element.batchStandard || ""
          }</p>
            </div>
            <div>
              <button id="show${element.batchName}">
                <i class="fa-solid fa-angle-down"></i>
              </button>
            </div>
          </div>
          <div class="students" id="${"student" + element.batchName
          }" style="display: none;">
            <!-- Student details will be dynamically added here -->
          </div>`;
      });
    } else {
      s = `<h6>No Batches Found...</h6>`;
    }

    container.innerHTML = s;

    // Add event listeners for each batch button
    data.forEach((element) => {
      const button = document.getElementById(`show${element.batchName}`);
      if (button) {
        button.addEventListener("click", async () => {
          const studentDiv = document.getElementById(
            "student" + element.batchName
          );
          if (studentDiv.style.display === "none") {
            studentDiv.style.display = "block";
            try {
              const studentsResponse = await fetch(
                `${window.location.origin}/getStudents?batch=${element.batchName}`
              );
              if (!studentsResponse.ok) {
                throw new Error(
                  `Error: ${studentsResponse.status} ${studentsResponse.statusText}`
                );
              }

              const students = await studentsResponse.json();
              students.sort(
                (a, b) => Number(a.studentid) - Number(b.studentid)
              );
              // console.log(students);
              if (students.length > 0) {
                let studentTable = `
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                `;

                students.forEach((student) => {
                  studentTable += `
                    <tr>
                      <td><img src="${window.location.origin
                    }/public/Assets/Student_Images/${student.image || "default-image.jpg"
                    }" alt="${student.name}" width="50" height="50"></td>
                      <td>${student.name}</td>
                      <td>${student.studentid}</td>
                      <td>${student.gender}</td>
                      <td>${student.age}</td>
                      <td>
                        <button onClick="handleView('${student["_id"]
                    }')" class="actionButton">View</button>
                      </td>
                    </tr>`;
                });

                studentTable += `</tbody></table>`;
                studentDiv.innerHTML = studentTable;
              } else {
                studentDiv.innerHTML = `<p>No students found for this batch.</p>`;
              }
            } catch (error) {
              console.error("Error fetching students:", error);
              studentDiv.innerHTML = `<p>Error loading students...</p>`;
            }
          } else {
            studentDiv.style.display = "none";
          }
        });
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    container.innerHTML = `<h6>Error loading batches...</h6>`;
  }
}

fetchData();

// handleView

async function handleView(id) {
  window.open(`${window.location.origin}/view/${id}`, "_blank");
}

// adding the subject on the action of the total subjects
const totalSubject = document.getElementById("totalSubject");
const subjects = document.getElementById("subjects");
subjects.addEventListener("input", (e) => {
  let s = ``;
  if (e.target.value < 20) {
    for (i = 1; i <= e.target.value; i++) {
      s += `<input id="subject-${i}" class="subject" type="text" placeholder="Enter 📖 Subject ${i}" required>`;
    }
  } else {
    s = `<input class="subject" type="text" placeholder="Please Use The Valid Number Of Subject" readOnly>`;
  }
  totalSubject.innerHTML = s;
});

// testSheet
const addBC = async () => {
  try {
    let response = await fetch(`${window.location.origin}/getBatches`);
    let batchData = await response.json();
    // console.log(batchData)
    const testBatch = document.getElementById("testBatch");
    const testClass = document.getElementById("testClass");
    let sb = `<option value disabled selected>Select Batch</option>`;
    let sc = `<option value disabled selected>Select Class</option>`;
    batchData.forEach((element) => {
      sb += `<option value='${element.batchName}'>${element.batchName}</option>`;
      sc += `<option value='${element.batchStandard}'>${element.batchStandard}</option>`;
    });
    testBatch.innerHTML = sb;
    testClass.innerHTML = sc;
  } catch (error) {
    console.error("error occur:", error);
  }
};

//calling the function to add the batch and class in the test Sheet
addBC();

let handleSheet = async () => {
  const topic = document.getElementById("topic").value.trim();
  const chp = document.getElementById("chp").value.trim();
  const examDate = document.getElementById("examDate").value.trim();
  const testBatch = document.getElementById("testBatch").value;
  const testClass = document.getElementById("testClass").value;
  const note = document.getElementById("note").value.trim();
  const subjectsCount = document.getElementById("subjects").value;

  // Ensure all required fields are filled
  if (!topic || !chp || !examDate || !testBatch || !testClass) {
    alert("Please fill out all required fields.");
    return;
  }
  const formData = {
    topic,
    chp,
    examDate,
    batch: testBatch,
    class: testClass,
    note,
    subjects: [],
  };
  // Add dynamic subject inputs
  for (let i = 1; i <= subjectsCount; i++) {
    const subjectValue = document.getElementById(`subject-${i}`).value.trim();
    if (subjectValue) {
      formData.subjects.push(subjectValue);
    } else {
      alert(`Subject ${i} is empty. Please fill it out.`);
      return;
    }
  }
  // console.table(formData);
  try {
    let response = await fetch(`${window.location.origin}/addTestSheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Handle server response
    if (response.ok) {
      let result = await response.json();
      alert("Test sheet submitted successfully!");
      updateEntryTableButton();
    } else {
      let errorData = await response.json();
      console.error("Server Error:", errorData);
      alert("Error submitting test sheet: " + errorData.message);
    }
  } catch (error) {
    console.error("Error during request:", error);
    alert("An error occurred. Please try again later.");
  }
};

// showEntryTableButton
const Entry = document.getElementById('Entry');
const showEntryTableButton = document.getElementById('showEntryTableButton');
let entryOpen = true
Entry.addEventListener('click', () => {

  showEntryTableButton.style.display = entryOpen ? "flex" : "none"
  entryOpen = !entryOpen
});
const updateEntryTableButton = () => {
  try {
    fetch(`${window.location.origin}/getTests`).then(data => data.json()).then((r) => {
      if (r) {
        let s = ''
        r.forEach(element => {
          s += `<button id="${element['_id']}" onclick="handleEntryTable('${element["_id"].toString()}')">${(element.batch).toUpperCase() + ' - ' + element.testClass + " : " + (element.topic).toUpperCase()}</button>`;
        });
        showEntryTableButton.innerHTML = ''
        showEntryTableButton.innerHTML = s
      } else {
        showEntryTableButton.innerHTML = '<p>No Entries or error occurs</p>'
      }
    })
  } catch (error) {
    if (error) {
      showEntryTableButton.innerHTML = '<p>No Entries or error occurs</p>'
    }
  }
}
updateEntryTableButton(); var sub = [];
var selectedSubjects = [];
const checkBoxSubject = document.getElementById('checkBoxSubject');
const crossBar = document.getElementById('crossBar');
const handleMarksButton = document.getElementById('handleMarks');
const handleEntryTable = async (id) => {
  try {
    selectedSubjects = []
    const response = await fetch(`${window.location.origin}/getSheet/${id}`);
    const data = await response.json();
    if (data.length > 0) {
      const subjects = data[0].subjects;
      let s = '';
      sub = [];
      subjects.forEach((element) => {
        sub.push(element);
        s += `
          <div>
            <label for="${element}Checkbox">${element.toUpperCase()}:</label>
            <input type="checkbox" id="${element}Checkbox">
          </div>
        `;
      });
      checkBoxSubject.innerHTML = s;
      document.getElementById('MainentryTable').style.display = "block";
      crossBar.style.display = 'flex';
      updateTheTableBody(data[0].batch, data[0].testClass);
      sub.forEach((element) => {
        const box = document.getElementById(`${element}Checkbox`);
        box.addEventListener('click', (e) => {
          if (box.checked) {
            selectedSubjects.push(element);
            updateTheTableBody(data[0].batch, data[0].testClass);
          } else {
            const index = selectedSubjects.indexOf(element);
            if (index > -1) {
              selectedSubjects.splice(index, 1);
              updateTheTableBody(data[0].batch, data[0].testClass);
            }
          }
        });
      });
      handleMarksButton.addEventListener('click', () => addMarks(data));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
let openCross = true;
crossBar.addEventListener('click', () => {
  let MainentryTable = document.getElementById('MainentryTable');
  if (openCross) {
    MainentryTable.style.display = 'none';
    checkBoxSubject.style.display = "none";
    crossBar.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
  } else {
    MainentryTable.style.display = "block";
    checkBoxSubject.style.display = "flex";
    crossBar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }
  openCross = !openCross;
});
const updateTheTableBody = async (batch, testClass) => {
  try {
    const EntryTableBody = document.getElementById('EntryTableBody');

    const response = await fetch(`${window.location.origin}/getstudents?batch=${batch}&class=${testClass}`);
    if (response.ok) {
      const data = await response.json();
      const savedValues = {};
      const inputs = document.querySelectorAll('#EntryTableBody input');
      inputs.forEach(input => {
        savedValues[input.id] = input.value;
      });
      EntryTableBody.innerHTML = '';

      data.forEach(element => {
        let tr = document.createElement('tr');

        let subjectsHTML = '';
        if (selectedSubjects && selectedSubjects.length > 0) {
          selectedSubjects.forEach(subject => {
            subjectsHTML += `
              <div><input id="${subject}-${element.studentid}" type="number" placeholder="${subject}" value="${savedValues[`${subject}-${element.studentid}`] || ''}"></div>
            `;
          });
        } else {
          subjectsHTML = `<div>No subjects available</div>`;
        }

        tr.innerHTML = `
          <td>${element.studentid}</td>
          <td>${(element.name).toUpperCase()}</td>
          <td>${element.batch} - ${element.class}</td>
          <td id="SubjectDaal">
            ${subjectsHTML}
          </td>
        `;
        EntryTableBody.appendChild(tr);
      });
    } else {
      console.log('Failed to fetch data');
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
};
const addMarks = (data) => {
  alert("Marks submission clicked");
  const allInputs = document.querySelectorAll('#EntryTableBody input');
  const marksData = {};

  allInputs.forEach(input => {
    const studentId = input.id.split('-')[1];
    const subject = input.placeholder;
    const marks = input.value;
    if (!marksData[studentId]) {
      marksData[studentId] = {};
    }
    marksData[studentId][subject] = { marks: marks };
  });
  console.log(marksData);
};

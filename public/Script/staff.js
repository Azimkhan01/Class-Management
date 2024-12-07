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
              <td><img src="${
                window.location.origin
              }/public/Assets/Student_Images/${
            student.image || "default-image.jpg"
          }" alt="${student.name}" width="50" height="50"></td>
              <td>${student.name}</td>
              <td>${student.studentid}</td>
              <td>${student.batch}</td>
              <td>${student.gender}</td>
              <td>${student.age}</td>
              <td>
                <button onClick="handleView('${
                  student["_id"]
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
              <p>${(element.batchName || "").toUpperCase()} - ${
          element.batchStandard || ""
        }</p>
            </div>
            <div>
              <button id="show${element.batchName}">
                <i class="fa-solid fa-angle-down"></i>
              </button>
            </div>
          </div>
          <div class="students" id="${
            "student" + element.batchName
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
                      <td><img src="${
                        window.location.origin
                      }/public/Assets/Student_Images/${
                    student.image || "default-image.jpg"
                  }" alt="${student.name}" width="50" height="50"></td>
                      <td>${student.name}</td>
                      <td>${student.studentid}</td>
                      <td>${student.gender}</td>
                      <td>${student.age}</td>
                      <td>
                        <button onClick="handleView('${
                          student["_id"]
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

  // Data to be sent to the server
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
      console.log("Server Response:", result);
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

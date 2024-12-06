// serch visaibility

const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
const studentResults = document.getElementById('searchResults'); 
const searchTotal = document.getElementById('searchTotal');
var searchOpen = true
search.addEventListener('click',()=>{

searchInput.style.display = searchOpen ? "flex" : "none";
searchResults.style.display = searchOpen ? "block" : "none";
searchOpen = !searchOpen
});

const findStudent = document.getElementById('findStudent');

findStudent.addEventListener('input', async (e) => {
  const query = e.target.value.trim(); // Get the search input and trim spaces


  if (query.length > 0) { // Check if input is non-empty
    try {
      // Fetch all students
      const studentsResponse = await fetch(`${window.location.origin}/getStudents`);
      if (!studentsResponse.ok) {
        throw new Error(`Error: ${studentsResponse.status} ${studentsResponse.statusText}`);
      }

      const students = await studentsResponse.json();
// console.log(students)
      // Filter students based on the query (case-insensitive match for student name or ID)
      const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.studentid.includes(query)
      );
// console.log(filteredStudents)
      // Sort the filtered students by student ID
      filteredStudents.sort((a, b) => Number(a.studentid) - Number(b.studentid));
    //   console.log(filteredStudents)
    searchTotal.textContent = `Total:${filteredStudents.length}`
      // Render the filtered results
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

        filteredStudents.forEach(student => {
          studentTable += `
            <tr>
              <td><img src="${window.location.origin}/public/Assets/Student_Images/${student.image || 'default-image.jpg'}" alt="${student.name}" width="50" height="50"></td>
              <td>${student.name}</td>
              <td>${student.studentid}</td>
              <td>${student.batch}</td>
              <td>${student.gender}</td>
              <td>${student.age}</td>
              <td>
                <button onClick="handleView('${student["_id"]}')" class="actionButton">View</button>
              </td>
            </tr>`;
        });

        studentTable += `</tbody></table>`;
        studentResults.innerHTML = studentTable;
        searchTotal.textContent = `Total:${0}`
      } else {
        studentResults.innerHTML = `<p>No students match your search.</p>`;
        searchTotal.textContent = `Total:${0}`
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      studentResults.innerHTML = `<p>Error loading students...</p>`;
      searchTotal.textContent = `Total:${0}`
    }
  } else {
    studentResults.innerHTML = `<p>Please enter a search term to find students.</p>`;
    searchTotal.textContent = `Total:${0}`
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
    console.log(data);

    let s = '';
    if (data.length > 0) {
      data.forEach(element => {
        s += `
          <div class="staffHandler">
            <div>
              <p>${(element.batchName || "").toUpperCase()} - ${element.batchStandard || ""}</p>
            </div>
            <div>
              <button id="show${element.batchName}">
                <i class="fa-solid fa-angle-down"></i>
              </button>
            </div>
          </div>
          <div class="students" id="${'student' + element.batchName}" style="display: none;">
            <!-- Student details will be dynamically added here -->
          </div>`;
      });
    } else {
      s = `<h6>No Batches Found...</h6>`;
    }

    container.innerHTML = s;

    // Add event listeners for each batch button
    data.forEach(element => {
      const button = document.getElementById(`show${element.batchName}`);
      if (button) {
        button.addEventListener('click', async () => {
          const studentDiv = document.getElementById('student' + element.batchName);
          if (studentDiv.style.display === "none") {
            studentDiv.style.display = "block";
            try {
              const studentsResponse = await fetch(`${window.location.origin}/getStudents?batch=${element.batchName}`);
              if (!studentsResponse.ok) {
                throw new Error(`Error: ${studentsResponse.status} ${studentsResponse.statusText}`);
              }

              const students = await studentsResponse.json();
              students.sort((a, b) => Number(a.studentid) - Number(b.studentid));
              console.log(students);
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

                students.forEach(student => {
                  studentTable += `
                    <tr>
                      <td><img src="${window.location.origin}/public/Assets/Student_Images/${student.image || 'default-image.jpg'}" alt="${student.name}" width="50" height="50"></td>
                      <td>${student.name}</td>
                      <td>${student.studentid}</td>
                      <td>${student.gender}</td>
                      <td>${student.age}</td>
                      <td>
                        <button onClick="handleView('${student["_id"]}')" class="actionButton">View</button>
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
  window.open(`${window.location.origin}/view/${id}`, '_blank');
} 
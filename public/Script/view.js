const attendance = document.getElementById('attendance');
let currentBatch = [];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

async function totalAttendance() {
    try {
        // Fetch batches data
        let response = await fetch(`${window.location.origin}/getBatches`);
        let batchdata = await response.json();

        // Extract the `id` parameter from the path
        let urlParts = window.location.pathname.split('/');
        let paramsId = urlParts[urlParts.length - 1]; // Get the last part of the path

        // Fetch students data using the `id` parameter
        let newresponse = await fetch(`${window.location.origin}/getStudents?_id=${paramsId}`);
        let studentData = await newresponse.json();

        let personalDetails= document.getElementById('personal-details')
        personalDetails.innerHTML = ` <div id="personal-image" class="card-image">
        <img src="${window.location.origin}/public/Assets/Student_images/${studentData[0].image}" alt="Student Name">
    </div>
    <div id="information" class="card-info">
        <p><strong>Name:</strong>${studentData[0].name}</p>
        <p><strong>Roll No:</strong>${studentData[0].studentid}</p>
        <p><strong>Class:</strong> ${studentData[0].class}</p>
        <p><strong>Batch:</strong> ${studentData[0].batch}</p>
        <p><strong>Email:</strong> ${studentData[0].email}</p>
        <p><strong>Whatsapp:</strong> ${studentData[0].studentWhatsapp} / ${studentData[0].parentWhatsapp}</p>
        <p><strong>Gender:</strong> ${(studentData[0].gender)}</p>
    </div>`
        batchdata.forEach(element => {
            if(element.batchName == studentData[0].batch && element.batchStandard == studentData[0].class) {
                currentBatch = element.attendance; // Get the attendance data
                console.log(currentBatch)
            }
        });

        // Array to track the months already added
        let addedMonths = [];

        // Loop through attendance records
        currentBatch.forEach(attendanceRecord => {
            let dateString = attendanceRecord["date"];
            let date = new Date(dateString);
            let month = date.getMonth(); // Get the month from the date

            // If the month hasn't been added yet, create it
            if (!addedMonths.includes(month)) {
                addedMonths.push(month);

                let monthDiv = document.createElement("div");
                monthDiv.className = "month";
                monthDiv.id = months[month];

                // Add a header for the month
                let monthHeader = document.createElement("h3");
                monthHeader.innerText = months[month].toUpperCase();
                monthDiv.appendChild(monthHeader);

                // Loop through the days of the month
                for (let j = 1; j <= days[month]; j++) {
                    let dayDiv = document.createElement("div");
                    dayDiv.className = "day";

                    // Create the ID in dd/mm/yy format
                    let day = j.toString().padStart(2, '0'); // Ensure 2-digit day
                    let monthString = (month + 1).toString().padStart(2, '0'); // Ensure 2-digit month
                    let year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of the current year
                    dayDiv.id = `${day}/${monthString}/${year}`;

                    // If the current date matches attendance, mark it (e.g., with a class or different style)
                    if (date.getDate() === j) {
                        dayDiv.classList.add("attended");
                    }

                    dayDiv.innerHTML = j; // Display the day number
                    monthDiv.appendChild(dayDiv);
                }

                // Append the month div to the attendance container
                attendance.appendChild(monthDiv);
            }
        });

        studentData[0].present.forEach((e)=>{
console.log(e)
const isoDate = e;
const date = new Date(isoDate);
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); 
const year = String(date.getFullYear()).slice(2);
const formattedDate = `${day}/${month}/${year}`;

let d = document.getElementById(formattedDate)
d.style.backgroundColor = "green"

        });

        studentData[0].absent.forEach((e)=>{
            console.log(e)
            const isoDate = e;
            const date = new Date(isoDate);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = String(date.getFullYear()).slice(2);
            const formattedDate = `${day}/${month}/${year}`;
            
            let d = document.getElementById(formattedDate)
            d.style.backgroundColor = "red"
            
                    })

    } catch (error) {
        console.error("Error:", error);
    }
}

// Call the function to load the attendance chart
totalAttendance();

const batches = document.getElementById('batches');

async function batchBtn() {
    try {
        batches.innerHTML = '<p>Loading batches...</p>';
        const response = await fetch(`${window.location.origin}/getBatches`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch batches: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log(data);

        if (data.length === 0) {
            batches.innerHTML = '<p>No batches available.</p>';
            return;
        }
        let s = '';
        data.forEach(element => {
            const { batchName, batchStandard } = element; 
            s += `
                <button onclick="handleBatch('${batchName}', '${batchStandard}')">
                    ${(batchName)} - ${(batchStandard)}
                </button>
            `;
        });

        batches.innerHTML = s;
    } catch (error) {
        console.error('Error fetching or processing batch data:', error);
        batches.innerHTML = '<p>Error loading batches. Please try again later.</p>';
    }
}

function handleBatch(batchName, batchStandard) {
    alert(`You clicked on: ${batchName} - ${batchStandard}`);
}

batchBtn();

// handleNow
const present = [];
const absent = [];

async function handleBatch(batchName, batchStandard) {
    try {
        // Ensure batchStandard is treated as a number
        const response = await fetch(`${window.location.origin}/getStudents?batch=${encodeURIComponent(batchName)}&class=${batchStandard}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.statusText}`);
        }

        const students = await response.json();

        const attendanceTable = document.getElementById('attendanceTable');
        attendanceTable.innerHTML = `
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Present</th>
                    <th>Absent</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr id="row-${student.studentid}">
                        <td>${student.studentid}</td>
                        <td>${(student.name).toUpperCase()}</td>
                        <td><button class="present" onclick="markAttendance(${student.studentid}, 'present')">Present</button></td>
                        <td><button class="absent" onclick="markAttendance(${student.studentid}, 'absent')">Absent</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        // Add a submit button after generating the table rows
        
        attendanceTable.innerHTML += `
            <button onClick="submitAttendance('${batchName}', '${batchStandard}')" class="submit">Submit</button>
        `;

    } catch (error) {
        console.error('Error fetching student data:', error);
        alert('Failed to load students. Please try again.');
    }
}

// Mark attendance (add to present or absent arrays)
function markAttendance(studentId, status) {
    if (status === 'present') {
        if (!present.includes(studentId)) {
            present.push(studentId);
        }
        const index = absent.indexOf(studentId);
        if (index !== -1) {
            absent.splice(index, 1);
        }
    } else if (status === 'absent') {
        if (!absent.includes(studentId)) {
            absent.push(studentId);
        }
        const index = present.indexOf(studentId);
        if (index !== -1) {
            present.splice(index, 1);
        }
    }

    // console.log('Present:', present);
    // console.log('Absent:', absent);
}

// Submit the attendance data
function submitAttendance(batchName, batchStandard) {
    // console.log('Submitting attendance for batch:', batchName, 'Standard:', batchStandard);
    // console.log('Present Students:', present);
    // console.log('Absent Students:', absent);
    // alert('Attendance submitted successfully!');
}


function markAttendance(studentId, status) {
    if (status === 'present') {
        if (!present.includes(studentId)) {
            present.push(studentId);
        }
        const index = absent.indexOf(studentId);
        if (index !== -1) {
            absent.splice(index, 1);
        }
    } else if (status === 'absent') {
        if (!absent.includes(studentId)) {
            absent.push(studentId);
        }
        const index = present.indexOf(studentId);
        if (index !== -1) {
            present.splice(index, 1);
        }
    }

    // console.log('Present:', present);
    // console.log('Absent:', absent);
}

function submitAttendance() {
    // console.log("Submitting Attendance...");
    // console.log("Present Students:", present);
    // console.log("Absent Students:", absent);

    // Mock API call to submit attendance
    fetch(`${window.location.origin}/submitAttendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ present, absent }),
    })
        .then(response => {
            if (response.ok) {
                alert('Attendance submitted successfully!');
                present.length = 0; // Clear the arrays after submission
                absent.length = 0;
            } else {
                throw new Error(`Failed to submit attendance: ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error submitting attendance:', error);
            alert('Failed to submit attendance. Please try again.');
        });
}

//submity atterndacne
async function submitAttendance(batchName, batchStandard) {
    try {
        const data = {
            batchName: batchName,
            batchStandard: batchStandard,
            presentStudents: present,
            absentStudents: absent
        };
        const response = await fetch(`${window.location.origin}/handleAttendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Failed to submit attendance: ${response.statusText}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        alert('Attendance submitted successfully!');
    } catch (error) {
        console.error('Error submitting attendance:', error);
        alert('Failed to submit attendance. Please try again.');
    }
}

const path = window.location.pathname;
const segments = path.split('/');
const queryParams = new URLSearchParams(window.location.search);
const inputforOutPut = document.getElementById('inputforOutPut');
const batch = segments[2];
let formData = [];
const classValue = segments[3];
const topperInfo = document.getElementById('topperInfo')
const topic = decodeURIComponent(segments[4]);
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const submitBtn = document.getElementById('submitBtn'); // Make sure submitBtn is defined
const evaluationHead = document.getElementById('evaluationHead');
const tableFilling = async () => {
    try {
        const response = await fetch(`${window.location.origin}/getStudentForTest?batch=${batch}&class=${classValue}&topic=${topic}`);
        const data = await response.json();

        if (data.status !== 'success') {
            console.error('Error:', data.status);
            return alert(data.status || 'Unable to fetch students.');
        }

        console.log(data);
if(data.test.status)
{
    alert("the entire makrs of student will change if you press ok !!")
}
        // Set the topic name dynamically
        const topicName = document.getElementById('topicName');
        topicName.innerText = topic.toUpperCase();
        formData.push(topic)

        // Add subject headers dynamically
        data.test.subjects.forEach(subject => {
            let inp = document.createElement('input')
                inp.type = 'number'
                inp.placeholder =subject.toUpperCase() + " TOTAL"
                inp.id = `${subject}-outof`
                inputforOutPut.appendChild(inp);
            let th = document.createElement('th');
            th.innerText = subject.toUpperCase();
            tableHead.appendChild(th);
        });

        // Add student rows dynamically
        data.students.forEach((student, index) => {
            let tr = document.createElement('tr');

            // Add student details to the row
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.studentid}</td>
            `;

            // Add input fields for each subject
            data.test.subjects.forEach(subject => {
                // console.log(subject)
                let td = document.createElement('td');
                let input = document.createElement('input');
                input.type = 'number'; // Use 'number' for marks input
                input.name = `${student.studentid}_${subject}`; // Unique name for the input
                input.placeholder = `Enter ${subject}`;
                td.appendChild(input);
                tr.appendChild(td);
                // let th = document.createElement('th')
                // th.innerText = subject.toUpperCase()
                // th.id = subject
                // evaluationHead.prepend(th);
            });

            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching student data.');
    }
};

// Function to handle form submission and log data
const handleSubmit = async () => {

    let outOfData = [];
    let stat = false;

    // Collect data from the table rows
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        const studentId = cells[2].innerText; // Accessing Student ID from the 3rd column
        const studentName = cells[1].innerText; // Accessing Student Name from the 2nd column

        // Add the batch and class to the formData
        const studentBatch = batch;
        const studentClass = classValue;

        const studentMarks = {};

        // Collect the marks entered for each subject
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            const subject = input.name.split('_')[1]; // Extract subject from input name
            const marks = input.value;
            if (marks) {
                studentMarks[subject] = marks;
            }
        });

        formData.push({
            studentId,
            studentName,
            studentBatch,
            studentClass,
            marks: studentMarks
        });
    });

    // Collect the outOfData (total marks for each subject)
    for (let i = 0; i < inputforOutPut.children.length; i++) {
        const input = inputforOutPut.children[i];
        if (input.value <= 0) {
            // Reset the value if invalid
            input.value = '';
            stat = !stat;
        } else {
            stat = !stat;
            outOfData.push({
                subject: (input.id).slice(0, -6), // Remove "outof" from the subject name
                value: input.value
            });
        }
    }

    // Log the collected data to the console
    console.log('Collected Student Data:', formData);
    console.log('OutOf Data:', outOfData);

    // Send data to the server
    try {
        const response = await fetch(`${window.location.origin}/enterMarks`, {
            method: 'POST', // Corrected method name
            headers: {
                'Content-Type': 'application/json', // Proper content type for JSON
            },
            body: JSON.stringify({ formData, outOfData }) // Combine both data objects into the payload
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server Response:', result);

        // Handle server response (e.g., show success message or handle errors)
        if (result.status === 'done') {
            alert('Marks added successfully!');
        } else {
            alert('Failed to add marks: ' + (result.message || 'Unknown error.'));
        }
    } catch (error) {
        console.error('Error while sending data:', error);
        alert('An error occurred while submitting the data.');
    }
};



// Event listener for the submit button
submitBtn.addEventListener('click', handleSubmit);

// Call the function when the page loads
tableFilling();




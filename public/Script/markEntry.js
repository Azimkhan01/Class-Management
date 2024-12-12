const path = window.location.pathname;
const segments = path.split('/');
const queryParams = new URLSearchParams(window.location.search);

const batch = segments[2];
const classValue = segments[3];
const topic = decodeURIComponent(segments[4]);
const inputforOutPut = document.getElementById('inputforOutPut');
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

        // Set the topic name dynamically
        const topicName = document.getElementById('topicName');
        topicName.innerText = topic;

        // Add subject headers dynamically
        data.test.subjects.forEach(subject => {
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
                let td = document.createElement('td');
                let input = document.createElement('input');
                input.type = 'number'; // Use 'number' for marks input
                input.name = `${student.studentid}_${subject}`; // Unique name for the input
                input.placeholder = `Enter ${subject}`;
                td.appendChild(input);
                tr.appendChild(td);
                let inp = document.createElement('input')
                inp.type = 'number'
                inp.placeholder =subject.toUpperCase() + " TOTAL"
                inp.id = `${subject}-outof`
                inputforOutPut.appendChild(inp);
                // let th = document.createElement('th')
                // th.innerText = subject.toUpperCase()
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
const handleSubmit = () => {
    let formData = [];

    // Collect data from the table rows
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const studentId = cells[2].innerText; // Accessing Student ID from the 3rd column
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
            marks: studentMarks
        });
    });

    // Log the collected data to the console
    console.log('Collected Student Data:', formData);
};

// Event listener for the submit button
submitBtn.addEventListener('click', handleSubmit);

// Call the function when the page loads
tableFilling();




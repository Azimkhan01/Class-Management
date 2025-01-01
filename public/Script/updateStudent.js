let path = window.location.pathname;
const id = path.split('/').pop();
const tests = document.getElementById('tests')
const present = document.getElementById('present')
const absent = document.getElementById('absent')
let getStudent = async () => {
    let response = await fetch(`${window.location.origin}/getStudents?_id=${id}`);
    return await response.json();
};

let getBatch = async () => {
    let response = await fetch(`${window.location.origin}/getBatches`);
    return await response.json();
};

getBatch().then((r) => {
    let classSet = new Set(); // For unique class standards
    let batchSet = new Set(); // For unique batch names

    const batch = document.getElementById("batch");
    batch.innerHTML = `<option value disabled selected>Select Batch</option>`;
    const studentClass = document.getElementById("class");
    studentClass.innerHTML = `<option value disabled selected>Select Class</option>`;

    r.forEach(element => {
        // Add to classSet if the class is not already present
        if (!classSet.has(element.batchStandard)) {
            classSet.add(element.batchStandard);
            let option = document.createElement("option");
            option.value = element.batchStandard;
            option.innerText = element.batchStandard;
            studentClass.appendChild(option);
        }

        // Add to batchSet if the batch is not already present
        if (!batchSet.has(element.batchName)) {
            batchSet.add(element.batchName);
            let option2 = document.createElement("option");
            option2.value = element.batchName;
            option2.innerText = element.batchName;
            batch.appendChild(option2);
        }
    });
});



// Fetch and populate form inputs
getStudent().then((r) => {
    console.log(r)

  
    
    if (r[0].test && r[0].test.length > 0) {
        console.log(r[0].test[0].outof);
        let s = '';

        // Iterate through the test array to generate the HTML content
        r[0].test.forEach((element) => {
            s += `
                <div class="topic-container">
                    <p class="topic-name">${(element.topic)}</p>
                    <div class="inputs-container">
                        ${element.outof.map((e) => {
                            return `
                                <div class="input-item">
                                    <label for="${e.subject}">${e.subject}</label>
                                    <input 
                                        outof="${e.value}" 
                                        type="number" 
                                        name="${e.subject}" 
                                        placeholder='${e.subject}' 
                                        value="${element.marks[e.subject]}" 
                                        data-initial-value="${element.marks[e.subject]}"> <!-- Storing the initial value -->
                                </div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        tests.innerHTML = '';
        tests.innerHTML = s;

        // Add input event listeners to the inputs
        const inputs = document.querySelectorAll('.inputs-container input');

        inputs.forEach((input) => {
            // Store the initial value loaded in the input field
            const initialValue = input.getAttribute('data-initial-value');

            input.addEventListener('input', (event) => {
                const maxValue = parseFloat(event.target.getAttribute('outof'));  // Get the max value from outof attribute
                const currentValue = parseFloat(event.target.value);  // Get the current value entered by the user

                // Check if the current value is a valid number, not less than 0 and not exceeding max value
                if ( currentValue < 0 || currentValue > maxValue) {
                    console.log('Invalid input. Resetting to initial value.');
                    event.target.value = initialValue;  // Reset the input to the initial value
                }
            });
        });
    }
        
    
    



    // Assuming `r[0]` contains the student data
    document.getElementById("id").value = r[0]['_id'] || 'NA';
    document.getElementById("username").value = r[0]['name'] || "NA";
    document.getElementById("studentwhatsapp").value = r[0]['studentWhatsapp'] || "NA";
    document.getElementById("parentWhatsapp").value = r[0]['parentWhatsapp'] || "NA";
    document.getElementById("email").value = r[0]['email'] || "NA";
    document.getElementById("gender").value = r[0]['gender'] || "NA";
    document.getElementById("class").value = r[0]['class'] || "NA";
    document.getElementById("age").value = r[0]['age'] || "NA";
    document.getElementById("batch").value = r[0]['batch'] || "NA";
    document.getElementById("studentid").value = r[0]['studentid'] || "NA";
    document.getElementById("previousGrade").value = r[0]['previousGrade'] || "NA";
    document.getElementById("note").value = r[0]['note'] || "NA";
});

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect form data
    const id = document.getElementById("id").value;
    const name = document.getElementById("username").value;
    const studentWhatsapp = document.getElementById("studentwhatsapp").value;
    const parentWhatsapp = document.getElementById("parentWhatsapp").value;
    const email = document.getElementById("email").value;
    const gender = document.getElementById("gender").value;
    const studentClass = document.getElementById("class").value;
    const age = document.getElementById("age").value;
    const batch = document.getElementById("batch").value;
    const studentId = document.getElementById("studentid").value;
    const previousGrade = document.getElementById("previousGrade").value;
    const note = document.getElementById("note").value;

    // Create an object with the form data
    const data = {
        test: gatherTestMarks(),
        id,
        name,
        studentWhatsapp,
        parentWhatsapp,
        email,
        gender,
        studentClass,
        age,
        batch,
        studentId,
        previousGrade,
        note
    };

    // Check if any field is empty
    for (const key in data) {
        if (data[key] == "") {
            alert(`Please fill out the ${key} field.`);
            return; // Prevent submission if any field is empty
        }
    }


    // If all fields are filled and changes are detected, send a POST request
    try {
        let response = await fetch(`${window.location.origin}/updateStudent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // Convert data object to JSON
        });

        // Parse the JSON response
        if (response.ok) {
            let result = await response.json();
            console.log("Update successful:", result);
            alert("Student updated successfully!");
        } else {
            console.error("Error updating student:", response.statusText);
            alert("Failed to update student. Please try again.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while updating the student.");
    }
});

function gatherTestMarks() {
    let marksData = [];

    // Get all topic containers
    const topicContainers = document.querySelectorAll('.topic-container');

    // Iterate through each topic container
    topicContainers.forEach((topicContainer) => {
        const topicNameElement = topicContainer.querySelector('.topic-name');
        const topicName = topicNameElement?.textContent.trim() || 'Unknown Topic';

        let topicMarks = {};

        // Get all input items within the topic container
        const inputItems = topicContainer.querySelectorAll('.input-item');

        inputItems.forEach((inputItem) => {
            const input = inputItem.querySelector('input[type="number"]');
            const label = inputItem.querySelector('label');

            const subject = label.textContent.trim(); // Trim the subject label
            const value = input.value.trim(); // The value of the input

            // Only add subject to marks if the value is not empty
            if (value !== '') {
                topicMarks[subject] = parseFloat(value); // Convert to number
            }
        });

        // Add the current topic and its marks to the array
        marksData.push({ marks: topicMarks, topic: topicName });
    });

    return marksData;
}








// Example: Gather data and log it
// const formattedTestData = gatherTestData();
// console.log(formattedTestData);

// // If you want to post the data, you can use something like:
// fetch('YOUR_API_URL', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ test: formattedTestData })
// }).then(response => response.json())
//   .then(data => console.log('Response:', data))
//   .catch(error => console.error('Error:', error));

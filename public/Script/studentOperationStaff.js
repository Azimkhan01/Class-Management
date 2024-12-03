const removeError = document.getElementById("remove-error");
const errorMessage = document.getElementById("error-message")
removeError.addEventListener("click", (e) => {
  error.style.display = "none";
});

function handleDeleteBatch(id) {
  fetch(`${window.location.origin}/deleteBatch/${id}`) // GET request
    .then(response => {
      if (!response.ok) {
        // Check if the response is not OK and throw an error
        throw new Error(`Failed to delete batch. Status: ${response.status}`);
      }
      return response.json(); // Parse the response JSON
    })
    .then((r) => {
      if (r.error) {
        // alert("Error: Unable to delete batch.");
        error.style.display = "flex";
        errorMessage.innerHTML = `<p>Error: Unable to delete batch.</p>`

      } else {
       error.style.display = "flex";
        errorMessage.innerHTML = `<p>Success fully created a batch</p>`
        setTimeout(()=>{
          if(error.style.display == "flex")
          {
            error.style.display = "none";
          }
        },2000)
        // Optionally refresh the batch list after deletion
        loadBatches();
      }
    })
    .catch((error) => {
      console.error("Error during deletion:", error);
       error.style.display = "flex";
        errorMessage.innerHTML = `<p>Error during deletion:${error}</p>`
    });
}

var batchOpen = false;
const addBatch = document.getElementById('addBatch');
const batchForm = document.getElementById('batchForm');
addBatch.addEventListener('click', (e) => {
  if (!batchOpen) {
    batchForm.style.display = "block";
  } else {
    batchForm.style.display = "none";
  }
  batchOpen = !batchOpen;
});
// batch editing
const batchSubmit = document.getElementById('batchSubmit');
let standard = document.getElementById("batchStandard");
let batchname = document.getElementById("batchName");
let batchyear = document.getElementById("batchYear");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");

const today = new Date();
const currentYear = today.getFullYear();
const currentDateString = today.toISOString().split("T")[0]; 

// Batch Year listener
batchyear.addEventListener('change', () => {
  if (batchyear.value < currentYear) {
    // alert("Batch year must be greater than or equal to the current year.");
    error.style.display = "flex";
        errorMessage.innerHTML = `Batch year must be greater than or equal to the current year.`
    batchyear.value = currentYear; 
  }
});

// Submit the form
const batchFormElement = document.getElementById("batchFormElement");
batchSubmit.addEventListener("click", async (e) => {
  e.preventDefault();  // Prevent the form from reloading the page

  try {
    const response = await fetch(`${window.location.origin}/addBatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        batchStandard: standard.value,
        batchName: batchname.value,
        batchYear: batchyear.value,
        startDate: startDate.value,
        endDate: endDate.value,
      }),
    });

    if (response.ok) {
      loadBatches()
      const result = await response.json();
      // alert('Batch added successfully:', result);
       error.style.display = "flex";
        errorMessage.innerHTML = `Batch added successfully`
      
    } else {
      console.error('Error adding batch:', response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
});

//batch visibility
const ShowBatches =document.getElementById('ShowBatches');
const TotalBatches = document.getElementById("TotalBatches");
var batchOpen = false
ShowBatches.addEventListener('click',(e)=>{

  if(!batchOpen)
  {
    TotalBatches.style.display ='flex'
  }else{
    TotalBatches.style.display ='none'
  }
  batchOpen = !batchOpen

});

async function loadBatches() {
  try {
    const response = await fetch(`${window.location.origin}/getBatches`);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Error fetching batches: ${response.statusText}`);
    }

    const batches = await response.json();
    const TotalBatches = document.getElementById("TotalBatches");
    TotalBatches.innerHTML = ''; // Clear existing content

    if (batches.length > 0) {
      let s = '';
      batches.forEach(element => {
        s += `
          <div class="card">
            <div class="Name-standard">
              <div class="name">
                <p>Batch Name: ${element.batchName}</p>
              </div>
              <div class="standard">
                <p>Batch Standard: ${element.batchStandard}</p>
              </div>
            </div>
            <div class="year">
              <p class="year">Year: ${element.batchYear}</p>
            </div>
            <div class="start-end">
              <div class="start">
                <p>Start Date: ${element.startDate}</p>
              </div>
              <div class="end">
                <p>End Date: ${element.endDate}</p>
              </div>
            </div>
            <div>
              <button onclick="handleDeleteBatch('${element['_id']}')" class="delete">Delete</button>
            </div>
          </div>`;
      });
      TotalBatches.innerHTML = s; // Add the constructed HTML to the TotalBatches element
    } else {
      TotalBatches.innerHTML = "<p>No batches found</p>"; // Display a message if no batches are found
    }
  } catch (error) {
    console.error("Error fetching batches:", error);
    // Show a user-friendly error message in the UI
    const TotalBatches = document.getElementById("TotalBatches");
    TotalBatches.innerHTML = "<p>Failed to load batches. Please try again later.</p>";
  }
}

// Call the function to load batches
loadBatches();


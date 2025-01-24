document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get parameters from URL
    const organization = urlParams.get('organization');
    const organizationid = urlParams.get('organizationid');
    const organizationemail = urlParams.get('organizationemail');

    // Set organization field
    if (organization) {
        const organizationField = document.getElementById('organization');
        organizationField.value = decodeURIComponent(organization);
        organizationField.disabled = true; // Disable the field to prevent further editing
    } else {
        alert('No organization parameter found in URL.');
    }

    // Set organizationid field
    if (organizationid) {
        const organizationidField = document.getElementById('organizationid');
        organizationidField.value = decodeURIComponent(organizationid);
        organizationidField.disabled = true; // Disable the field to prevent further editing
    } else {
        alert('No organizationid parameter found in URL.');
    }

    // Set organizationemail field
    if (organizationemail) {
        const organizationemailField = document.getElementById('organizationemail');
        organizationemailField.value = decodeURIComponent(organizationemail);
        organizationemailField.disabled = true; // Disable the field to prevent further editing
    } else {
        alert('No organizationemail parameter found in URL.');
    }

    // Set current date and time
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' ,hour12: false});

    document.getElementById('date').value = currentDate;
    document.getElementById('time').value = currentTime;
    
      // Modal handling
      const modal = document.getElementById("successModal");
      const closeModalBtn = document.getElementById("closeModalBtn");
      const closeSpan = document.querySelector(".close");
  
      closeModalBtn.onclick = () => {
          modal.style.display = "none";
      };
  
      closeSpan.onclick = () => {
          modal.style.display = "none";
      };
  
      window.onclick = (event) => {
          if (event.target === modal) {
              modal.style.display = "none";
          }
      };
  });

// Function to get the next entry number
async function getNextEntryNumber(organizationemail) {
    try {
        const dataCollectionRef = db.collection(`Organizations/${organizationemail}/DATA`);
        const dataCollectionSnapshot = await dataCollectionRef.get();
        return dataCollectionSnapshot.size + 1; // Next entry number
    } catch (error) {
        console.error("Error getting entry number: ", error);
        throw error;
    }
}

// Function to submit the form
async function submitForm() {
    const submitButton = document.getElementById('submitButton'); // Get the submit button element
    submitButton.disabled = true; // Disable the button
    submitButton.style.opacity = "0.6"; // Optional: Reduce opacity to indicate it's disabled

    const organization = document.getElementById('organization').value;
    const organizationemail = document.getElementById('organizationemail').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const vehicleNumber = document.getElementById('vehicle').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const purpose = document.getElementById('purpose').value;

    // Validate form fields
    if (!organization || !organizationemail || !name || !date || !time || !purpose) {
        alert("Please fill out all required fields.");
        submitButton.disabled = false; // Re-enable the button
        submitButton.style.opacity = "1"; // Restore opacity
        return;
    }

    try {
        // Get the next entry number
        const entryNumber = await getNextEntryNumber(organizationemail);

        // Append ":00" for seconds
        const formattedTime = `${time}:00`;

        // Combine date and formatted time to get YYYY-MM-DD HH:MM:SS
        const formattedDateTime = `${date} ${formattedTime}`;

        // Firestore document structure
        const entryData = {
            'EntryNo': entryNumber,
            'Name': name,
            'VehicleNumber': vehicleNumber,
            'Email': email,
            'Organization': organization,
            'Purpose': purpose,
            'DateTime': formattedDateTime,
        };

        // Add a new document in the "DATA" collection with entryNumber as the document ID
        await db.collection(`Organizations/${organizationemail}/DATA`).doc().set(entryData);

        // Add to user's history
        await db.collection(`Users/${email}/History`).doc().set(entryData);

        // Show success modal
        document.getElementById("successModal").style.display = "flex";

        // Enable the button after success dialog is shown
        submitBtn.disabled = false; 


        // Clear the input fields after submission
        document.getElementById("entryForm").reset();
    } catch (error) {
        console.error("Error adding document: ", error);
    }

    // Re-enable the submit button after 5 seconds
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.style.opacity = "1"; // Restore opacity
    }, 5000);
}

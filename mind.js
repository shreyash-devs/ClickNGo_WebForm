document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const organization = urlParams.get('organization');
    
    if (organization) {
        const organizationField = document.getElementById('organization');
        organizationField.value = decodeURIComponent(organization);
        organizationField.disabled = true; // Disable the field to prevent further editing
    } else {
        alert('No organization parameter found in URL.');
    }

    // Set current date and time
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('date').value = currentDate;
    document.getElementById('time').value = currentTime;
});

// Function to get the next entry number
async function getNextEntryNumber(organization) {
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
    const organization = document.getElementById('organization').value;
    const organizationemai = document.getElementById('organizationemail').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const vehicleNumber = document.getElementById('vehicle').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const purpose = document.getElementById('purpose').value;

    // Validate form fields
    if (!organization || !organizationemail || !email || !name || !vehicleNumber || !date || !time || !purpose) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        // Get the next entry number
        const entryNumber = await getNextEntryNumber(organizationemail);

        // Format the datetime
        const dateTime = `${date} ${time}`;

        // Firestore document structure
        const entryData = {
            'Entry No': entryNumber,
            'Name': name,
            'VehicleNumber': vehicleNumber,
            'Email': email,
            'Organization': organization,
            'Purpose': purpose,
            'DateTime': dateTime
        };

        // Add a new document in the "DATA" collection with entryNumber as the document ID
        await db.collection(`Organizations/${organizationemail}/DATA`).doc().set(entryData);
         
        await db.collection(`Users/${email}/History`).doc().set(entryData);

        console.log("Document written with Entry No: ", entryNumber);

        // Clear the input fields after submission
        document.getElementById("entryForm").reset();
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

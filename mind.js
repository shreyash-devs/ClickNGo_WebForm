document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const organization = urlParams.get('organization');
    const organizationid = urlParams.get('organizationid');
    
    if (organization) {
        const organizationField = document.getElementById('organization');
        organizationField.value = decodeURIComponent(organization);
        organizationField.disabled = true; // Disable the field to prevent further editing
    }
    if (organizationid) {
        const organizationIdField = document.getElementById('organizationid');
        organizationField.value = decodeURIComponent(organizationid);
        organizationField.disabled = true; // Disable the field to prevent further editing
    }


    // Set current date and time
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('date').value = currentDate;
    document.getElementById('time').value = currentTime;
});

function submitForm() {
    const form = document.getElementById('entryForm');
    const formData = {
        organization: form.organization.value,
        email: form.email.value,
        name: form.name.value,
        vehicle: form.vehicle.value,
        date: form.date.value,
        time: form.time.value,
        purpose: form.purpose.value,
    };

    // Convert form data to string and save it to a text file
    const dataString = JSON.stringify(formData);
    download('entry_data.txt', dataString);

    // Clear the input fields after submission
    form.reset();
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

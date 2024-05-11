// Wait until the HTML document is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Access form and table body elements from the DOM
    const registrationForm = document.getElementById('registrationForm');
    const studentTableBody = document.querySelector('#studentTable tbody');
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    // Flags to check if the user is currently editing an existing entry
    let isEditing = false;
    let currentEditRow = null;

    // Add event listener for form submission
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        // Retrieve and trim user inputs
        const studentName = document.getElementById('studentName').value.trim();
        const studentID = document.getElementById('studentID').value.trim();
        const emailID = document.getElementById('emailID').value.trim();
        const contactNo = document.getElementById('contactNo').value.trim();

        // Validate input fields before processing
        if (!validateInputs(studentName, studentID, emailID, contactNo)) {
            alert('Please correct the inputs according to the instructions.');
            return;
        }

        // Check if we are in editing mode
        if (isEditing) {
            // Update the existing row with new data from form
            currentEditRow.cells[0].textContent = studentName;
            currentEditRow.cells[1].textContent = studentID;
            currentEditRow.cells[2].textContent = emailID;
            currentEditRow.cells[3].textContent = contactNo;
            // Reset button text and editing flags
            submitButton.textContent = 'Register Student';
            isEditing = false;
            currentEditRow = null;
        } else {
            // Create a new table row and populate it with form data
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${studentName}</td>
                <td>${studentID}</td>
                <td>${emailID}</td>
                <td>${contactNo}</td>
                <td class="actions">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;
            studentTableBody.appendChild(newRow);
        }

        // Reset form fields and update local storage and scrollbar
        registrationForm.reset();
        saveDataToLocalStorage();
        manageScrollbar();
    });

    // Handle click events on the table body (for edit and delete buttons)
    studentTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            // Remove the row from the DOM and update storage
            event.target.closest('tr').remove();
            saveDataToLocalStorage();
            manageScrollbar();
        } else if (event.target.classList.contains('edit')) {
            // Set the form fields to values from the row for editing
            currentEditRow = event.target.closest('tr');
            const cells = currentEditRow.querySelectorAll('td');
            document.getElementById('studentName').value = cells[0].textContent;
            document.getElementById('studentID').value = cells[1].textContent;
            document.getElementById('emailID').value = cells[2].textContent;
            document.getElementById('contactNo').value = cells[3].textContent;
            // Change button text to indicate update operation
            submitButton.textContent = 'Update Student';
            isEditing = true;
        }
    });

    // Validate user input
    function validateInputs(name, id, email, contact) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        const idRegex = /^\d+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactRegex = /^\d+$/;

        return nameRegex.test(name) && idRegex.test(id) && emailRegex.test(email) && contactRegex.test(contact);
    }

    // Save current table state to local storage
    function saveDataToLocalStorage() {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const data = rows.map(row => ({
            name: row.cells[0].textContent,
            id: row.cells[1].textContent,
            email: row.cells[2].textContent,
            contact: row.cells[3].textContent
        }));
        localStorage.setItem('studentData', JSON.stringify(data));
    }

    // Load data from local storage and populate the table
    function loadDataFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('studentData'));
        data.forEach(item => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.id}</td>
                <td>${item.email}</td>
                <td>${item.contact}</td>
                <td class="actions">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;
            studentTableBody.appendChild(newRow);
        });
        manageScrollbar();
    }

    // Adjust scrollbar visibility based on content height
    function manageScrollbar() {
        studentTableBody.style.overflowY = studentTableBody.scrollHeight > studentTableBody.clientHeight ? 'scroll' : 'hidden';
    }

    // Initial data load from local storage
    loadDataFromLocalStorage();
});

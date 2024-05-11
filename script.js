document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const studentTableBody = document.querySelector('#studentTable tbody');
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    let isEditing = false;
    let currentEditRow = null;

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const studentName = document.getElementById('studentName').value.trim();
        const studentID = document.getElementById('studentID').value.trim();
        const emailID = document.getElementById('emailID').value.trim();
        const contactNo = document.getElementById('contactNo').value.trim();

        if (!validateInputs(studentName, studentID, emailID, contactNo)) {
            alert('Please correct the inputs according to the instructions.');
            return;
        }

        if (isEditing) {
            // Update the row
            currentEditRow.cells[0].textContent = studentName;
            currentEditRow.cells[1].textContent = studentID;
            currentEditRow.cells[2].textContent = emailID;
            currentEditRow.cells[3].textContent = contactNo;
            submitButton.textContent = 'Register Student';
            isEditing = false;
            currentEditRow = null;
        } else {
            // Add new entry
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

        registrationForm.reset();
        saveDataToLocalStorage();
        manageScrollbar();
    });

    studentTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            event.target.closest('tr').remove();
            saveDataToLocalStorage();
            manageScrollbar();
        } else if (event.target.classList.contains('edit')) {
            currentEditRow = event.target.closest('tr');
            const cells = currentEditRow.querySelectorAll('td');
            document.getElementById('studentName').value = cells[0].textContent;
            document.getElementById('studentID').value = cells[1].textContent;
            document.getElementById('emailID').value = cells[2].textContent;
            document.getElementById('contactNo').value = cells[3].textContent;

            submitButton.textContent = 'Update Student';
            isEditing = true;
        }
    });

    function validateInputs(name, id, email, contact) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        const idRegex = /^\d+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactRegex = /^\d+$/;

        if (!nameRegex.test(name) || !idRegex.test(id) || !emailRegex.test(email) || !contactRegex.test(contact)) {
            return false;
        }
        return true;
    }

    function saveDataToLocalStorage() {
        const rows = document.querySelectorAll('#studentTable tbody tr');
        const data = [];
        rows.forEach(row => {
            const rowData = {
                name: row.cells[0].textContent,
                id: row.cells[1].textContent,
                email: row.cells[2].textContent,
                contact: row.cells[3].textContent
            };
            data.push(rowData);
        });
        localStorage.setItem('studentData', JSON.stringify(data));
    }

    function loadDataFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('studentData'));
        if (data) {
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
        }
        manageScrollbar();
    }

    function manageScrollbar() {
        if (studentTableBody.scrollHeight > studentTableBody.clientHeight) {
            studentTableBody.style.overflowY = 'scroll';
        } else {
            studentTableBody.style.overflowY = 'hidden';
        }
    }

    loadDataFromLocalStorage();
});

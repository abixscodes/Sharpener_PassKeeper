const apiUrl = 'https://crudcrud.com/api/8e2c1c281b3e46ba81e47d5e824f24cb/passwords';

document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    const passwordInput = document.getElementById('password');
    const addButton = document.getElementById('addButton');
    const searchInput = document.getElementById('search');
    const passwordTableBody = document.querySelector('#passwordTable tbody');
    const totalPasswordsElement = document.getElementById('totalPasswords');
    loadPasswords();

    addButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const password = passwordInput.value.trim();
        if (title && password) {
            addPassword({ title, password });
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        filterPasswords(query);
    });

    async function loadPasswords() {
        const response = await fetch(apiUrl);
        const passwords = await response.json();
        displayPasswords(passwords);
    }

    async function addPassword(password) {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(password)
        });
        titleInput.value = '';
        passwordInput.value = '';
        loadPasswords();
    }

    async function updatePassword(id, updatedPassword) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPassword)
        });
        loadPasswords();
    }

    async function deletePassword(id) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        loadPasswords();
    }

    function displayPasswords(passwords) {
        passwordTableBody.innerHTML = '';
        passwords.forEach(password => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${password.title}</td>
                <td>${password.password}</td>
                <td>
                    <button onclick="editPassword('${password._id}')">Edit</button>
                    <button onclick="deletePassword('${password._id}')">Delete</button>
                </td>
            `;
            passwordTableBody.appendChild(row);
        });
        totalPasswordsElement.textContent = `Total passwords: ${passwords.length}`;
    }

    function filterPasswords(query) {
        const rows = passwordTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const title = row.cells[0].textContent.toLowerCase();
            if (title.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    window.editPassword = (id) => {
        const passwordRow = document.querySelector(`button[onclick="editPassword('${id}')"]`).closest('tr');
        const title = passwordRow.cells[0].textContent;
        const password = passwordRow.cells[1].textContent;
        titleInput.value = title;
        passwordInput.value = password;
        addButton.textContent = 'Update';
        addButton.onclick = () => {
            const updatedTitle = titleInput.value.trim();
            const updatedPassword = passwordInput.value.trim();
            if (updatedTitle && updatedPassword) {
                updatePassword(id, { title: updatedTitle, password: updatedPassword });
                addButton.textContent = 'Add';
                addButton.onclick = addPassword;
            }
        };
    };

    window.deletePassword = deletePassword;
});

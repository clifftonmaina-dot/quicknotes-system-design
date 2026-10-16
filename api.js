const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM Elements
const loadBtn = document.getElementById('load-btn');
const submitBtn = document.getElementById('submit-btn');
const statusPara = document.getElementById('status');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const notesList = document.getElementById('notes-list');

// Helper to update status message with CSS classes
function setStatus(message, type) {
    if (!message) {
        statusPara.style.display = 'none';
        statusPara.className = '';
        return;
    }
    statusPara.style.display = 'block';
    statusPara.textContent = message;
    statusPara.className = type;
}

// Reusable fetch wrapper with error handling
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    if (response.status === 204) return null;
    return await response.json();
}

// Helper function to build a note DOM element
function createNoteElement(note) {
    const li = document.createElement('li');
    li.className = 'note-item';
    li.dataset.id = note.id;

    const h3 = document.createElement('h3');
    h3.textContent = note.title;

    const p = document.createElement('p');
    p.textContent = note.body || '(No body content)';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteNote(note.id, li));

    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(deleteBtn);

    return li;
}

// Render list of notes safely using textContent
function renderNotes(notes) {
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        emptyLi.textContent = 'No notes available.';
        notesList.appendChild(emptyLi);
        return;
    }

    notes.forEach(note => {
        notesList.appendChild(createNoteElement(note));
    });
}

// Task 1: Load notes (GET)
async function loadNotes() {
    loadBtn.disabled = true;
    setStatus('Loading notes...', 'loading');

    try {
        const data = await request(`${API_URL}?_limit=10`);
        renderNotes(data);
        setStatus(`Loaded ${data.length} notes from the server.`, 'success');
    } catch (error) {
        setStatus(`Failed to load notes: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
    }
}

// Task 2: Create note (POST)
async function createNote(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation
    if (!title) {
        setStatus('Validation Error: Title is required.', 'error');
        return;
    }
    if (title.length > 100) {
        setStatus('Validation Error: Title must be 100 characters or fewer.', 'error');
        return;
    }

    submitBtn.disabled = true;
    setStatus('Creating note...', 'loading');

    try {
        const responseData = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        const newNoteEl = createNoteElement(responseData);

        // Remove empty state if present
        const emptyState = notesList.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        notesList.prepend(newNoteEl);

        setStatus(`Note created (status 201, id ${responseData.id}).`, 'success');
        noteForm.reset();
    } catch (error) {
        setStatus(`Failed to create note: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

// Task 3: Delete note (DELETE)
async function deleteNote(id, element) {
    setStatus(`Deleting note ${id}...`, 'loading');

    try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        element.remove();
        
        if (notesList.children.length === 0) {
            renderNotes([]);
        }

        setStatus(`Note ${id} deleted successfully.`, 'success');
    } catch (error) {
        setStatus(`Failed to delete note ${id}: ${error.message}`, 'error');
    }
}

// Event Listeners
loadBtn.addEventListener('click', loadNotes);
noteForm.addEventListener('submit', createNote);
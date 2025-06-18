const STORAGE_KEY = 'notes';

document.addEventListener('DOMContentLoaded', displayNotes);

function popup() {
    const wrapper = document.createElement('div');
    wrapper.id = 'popupContainer';
    wrapper.innerHTML = `
    <h1>New Note</h1>
    <div class="input-group">
        <input type="text" id="note-title" placeholder="Enter title...">
    </div>
    <textarea id="note-text" placeholder="Enter your note..."></textarea>
    <div id="btn-container">
       <button id="submitBtn">Create</button>
       <button id="closeBtn">Close</button>
    </div>`;
    document.body.appendChild(wrapper);

    wrapper.querySelector('#submitBtn').onclick = createNote;
    wrapper.querySelector('#closeBtn').onclick = () => wrapper.remove();
}

function createNote() {
    const title = document.getElementById('note-title').value.trim();
    const text = document.getElementById('note-text').value.trim();
    if (!text) return;

    const notes = getNotes();
    notes.push({ id: Date.now(), title, text });
    saveNotes(notes);

    document.getElementById('popupContainer').remove();
    displayNotes();
}

function displayNotes() {
    const ul = document.getElementById('notes-list');
    ul.innerHTML = '';

    getNotes().forEach(({ id, title, text }) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <h2>${title || 'Untitled'}</h2>
      <p>${text}</p>
      <div class="btn-group">
         <button class="edit-btn"><i class="fa-solid fa-pen"></i>Edit</button>
         <button class="delete-btn"><i class="fa-solid fa-trash"></i>Delete</button>
      </div>`;
        li.querySelector('.edit-btn').onclick = () => editNote(id);
        li.querySelector('.delete-btn').onclick = () => deleteNote(id);

        ul.appendChild(li);
    });
}

function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    saveNotes(notes);
    displayNotes();
}

function editNote(id) {
    const note = getNotes().find(n => n.id === id);
    if (!note) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'editing-container';
    wrapper.dataset.id = id;
    wrapper.innerHTML = `
    <h1>Edit Note</h1>
    <div class="input-group">
        <input type="text" id="edit-title" value="${note.title}" placeholder="Enter title...">
    </div>
    <textarea id="edit-text">${note.text}</textarea>
    <div id="btn-container">
      <button id="submitBtn">Done</button>
      <button id="closeBtn">Cancel</button>
    </div>`;
    document.body.appendChild(wrapper);

    wrapper.querySelector('#submitBtn').onclick = updateNote;
    wrapper.querySelector('#closeBtn').onclick = () => wrapper.remove();
}

function updateNote() {
    const wrapper = document.getElementById('editing-container');
    const id = Number(wrapper.dataset.id);
    const title = document.getElementById('edit-title').value.trim();
    const text = document.getElementById('edit-text').value.trim();
    if (!text) return;

    const notes = getNotes().map(n => n.id === id ? { ...n, title, text } : n);
    saveNotes(notes);

    wrapper.remove();
    displayNotes();
}

function getNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
function saveNotes(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
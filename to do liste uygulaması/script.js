document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const clearCompleted = document.getElementById('clearCompleted');

    // Local Storage'dan görevleri yükle
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Görevleri ekrana yazdır
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.setAttribute('draggable', true);
            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
                <button>Sil</button>
            `;

            // Görevi tamamla/geri al
            todoItem.querySelector('input').addEventListener('click', () => {
                todo.completed = !todo.completed;
                saveAndRender();
            });

            // Görevi sil
            todoItem.querySelector('button').addEventListener('click', () => {
                todos = todos.filter(t => t !== todo);
                saveAndRender();
            });

            // Drag and Drop işlevselliği
            todoItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', todos.indexOf(todo));
            });

            todoItem.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            todoItem.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedIndex = e.dataTransfer.getData('text/plain');
                const targetIndex = todos.indexOf(todo);
                todos.splice(targetIndex, 0, todos.splice(draggedIndex, 1)[0]);
                saveAndRender();
            });

            todoList.appendChild(todoItem);
        });
    }

    // Yeni görev ekle
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTodo = {
            text: todoInput.value,
            completed: false
        };
        todos.push(newTodo);
        saveAndRender();
        todoInput.value = '';
    });

    // Tamamlanan görevleri temizle
    clearCompleted.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    });

    // Görevleri kaydet ve ekrana yazdır
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // İlk yüklemede görevleri göster
    renderTodos();
});

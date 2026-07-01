document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');

    // Carregar tarefas salvas ou iniciar lista vazia
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Guardar no LocalStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Atualizar o contador de itens pendentes
    function updateStats() {
        const activeTodos = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${activeTodos} ${activeTodos === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;
    }

    // Renderizar a lista de tarefas no ecrã
    function renderTodos() {
        todoList.innerHTML = '';
        
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <div class="todo-content" data-index="${index}">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                </div>
                <button class="delete-btn" data-index="${index}">&times;</button>
            `;

            todoList.appendChild(li);
        });

        updateStats();
    }

    // Adicionar nova tarefa
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    });

    // Eventos de clique na lista (Concluir ou Eliminar)
    todoList.addEventListener('click', (e) => {
        const index = e.target.closest('[data-index]')?.getAttribute('data-index');
        if (index === undefined) return;

        // Se clicou no conteúdo ou checkbox -> Alterna Concluído
        if (e.target.classList.contains('todo-checkbox') || e.target.closest('.todo-content')) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        } 
        // Se clicou no botão de eliminar -> Remove da lista
        else if (e.target.classList.contains('delete-btn')) {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }
    });

    // Limpar todas as concluídas
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    });

    // Inicializar app
    renderTodos();
});

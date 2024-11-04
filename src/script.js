class TodoApp {
	constructor() {
		this.todos = [];
		this.isSortedAsc = false;
		this.init();
	}

	init() {
		this.addButton = document.querySelector('.add');
		this.inputField = document.querySelector('.todo-input');
		this.todoList = document.querySelector('.todo-list');
		this.cancelButton = document.querySelector('.cancel-image');
		this.sortButton = document.querySelector('.white-down');
		this.showButton = document.querySelector('#show-button');
		this.submitContainer = document.querySelector('.submit');
		this.formContainer = document.querySelector('.form');

		this.todoList.classList.add('hidden');

		this.addButton.addEventListener('click', () => {
			if (this.formContainer.style.display === 'block') {
				this.addTodo();
			} else {
				this.formContainer.style.display = 'block';
			}
		});

		this.cancelButton.addEventListener('click', () => this.toggleView());
		this.sortButton.addEventListener('click', () => this.toggleSort());
		this.showButton.addEventListener('click', () => this.showList());

		this.sortButton.addEventListener('mouseover', () =>
			this.changeIconToBlack()
		);
		this.sortButton.addEventListener('mouseout', () =>
			this.changeIconToWhite()
		);

		this.inputField.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				this.addTodo();
			}
		});
	}

	addTodo() {
		const todoText = this.inputField.value.trim();
		if (todoText) {
			this.todos.push(todoText);
			this.displayTodos();
			this.clearInput();
			this.isSortedAsc = false;
		} else {
			alert('Please add a to-do');
		}
	}

	displayTodos() {
		this.todoList.innerHTML = '';
		this.todos.forEach((todoText, index) =>
			this.createTodoItem(todoText, index)
		);
	}

	createTodoItem(todoText, index) {
		const todoItem = document.createElement('li');
		todoItem.innerText = todoText;
		todoItem.draggable = true;
		todoItem.dataset.index = index;

		todoItem.addEventListener('dragstart', (e) => this.dragStart(e));
		todoItem.addEventListener('dragover', (e) => this.dragOver(e));
		todoItem.addEventListener('drop', (e) => this.drop(e));

		todoItem.addEventListener('dblclick', () =>
			this.editTodoItem(todoItem, index)
		);

		const deleteButton = document.createElement('img');
		deleteButton.src = '../svg/cancel.svg';
		deleteButton.alt = 'Delete';
		deleteButton.classList.add('delete-todo');
		todoItem.appendChild(deleteButton);
		this.todoList.appendChild(todoItem);

		deleteButton.addEventListener('click', () => {
			this.todos = this.todos.filter((todo, i) => i !== index);
			this.displayTodos();
		});
	}

	dragStart(event) {
		event.dataTransfer.setData('text/plain', event.target.dataset.index);
		event.target.classList.add('dragging');
	}

	dragOver(event) {
		event.preventDefault();
		event.target.classList.add('drag-over');
	}

	drop(event) {
		event.preventDefault();
		const draggedIndex = event.dataTransfer.getData('text/plain');
		const targetIndex = event.target.dataset.index;

		if (draggedIndex !== targetIndex) {
			const [draggedItem] = this.todos.splice(draggedIndex, 1);
			this.todos.splice(targetIndex, 0, draggedItem);
			this.displayTodos();
		}
		event.target.classList.remove('drag-over');
	}

	editTodoItem(todoItem, index) {
		const currentText = todoItem.innerText;
		const input = document.createElement('input');
		input.type = 'text';
		input.value = currentText;
		input.classList.add('edit-input');

		todoItem.innerText = '';
		todoItem.appendChild(input);
		input.focus();

		const saveEdit = () => {
			const newText = input.value.trim();
			if (newText) {
				this.todos[index] = newText;
				this.displayTodos();
			} else {
				alert('Todo cannot be empty');
				this.displayTodos();
			}
		};
		input.addEventListener('blur', saveEdit);
		input.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') saveEdit();
		});
	}

	clearInput() {
		this.inputField.value = '';
		this.inputField.focus();
		this.formContainer.style.display = 'block';
	}

	toggleSort() {
		this.isSortedAsc = !this.isSortedAsc;
		this.todos.sort((a, b) => {
			const aNum = parseFloat(a);
			const bNum = parseFloat(b);

			if (!isNaN(aNum) && !isNaN(bNum)) {
				return this.isSortedAsc ? aNum - bNum : bNum - aNum;
			} else {
				return this.isSortedAsc ? a.localeCompare(b) : b.localeCompare(a);
			}
		});

		this.sortButton.src = this.isSortedAsc
			? '../svg/up-sort-black.svg'
			: '../svg/down-sort-black.svg';

		this.displayTodos();
	}

	changeIconToBlack() {
		if (this.isSortedAsc) {
			this.sortButton.src = '../svg/up-sort-black.svg';
		} else {
			this.sortButton.src = '../svg/down-sort-black.svg';
		}
	}

	changeIconToWhite() {
		if (this.isSortedAsc) {
			this.sortButton.src = '../svg/up-sort.svg';
		} else {
			this.sortButton.src = '../svg/down-sort.svg';
		}
	}

	toggleView() {
		this.formContainer.style.display = 'none';
		// this.sortButton.style.display = 'none';
		if (this.todos.length === 0) {
			this.sortButton.style.display = 'none';
		}
	}

	showList() {
		this.todoList.classList.remove('hidden');
		this.toggleView();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new TodoApp();
});

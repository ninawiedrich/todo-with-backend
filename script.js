const todoListElement = document.querySelector(".todo-list");
const newTodoForm = document.querySelector("#new-todo-form");
const newTodo = document.querySelector("#new-todo");

const addBtn = document.querySelector("#btn-add");
const deleteBtn = document.querySelector("#btn-delete");

let stateArr = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((respons) => respons.json())
    .then((data) => {
      stateArr = data;
      render();
    });
}

// function to show todos (rendering)
function render() {
  todoListElement.innerHTML = "";
  stateArr.forEach((todo) => {
    //create list element
    const newLi = document.createElement("li");
    //create todo text
    const text = document.createTextNode(todo.description);
    //create checkbox element
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = todo.done;

    //add eventhandler for input
    check.addEventListener("change", () => updateTodo(todo));

    //append text and check elements to list element
    newLi.append(check, text);
    //append li to ul
    todoListElement.appendChild(newLi);
  });
}

//creat new todo with API -> new todo is sent to backend
function addToDo(event) {
  event.preventDefault();

  const newToDo = {
    description: newTodo.value,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newToDo),
  })
    .then((response) => response.json())
    .then((newTodoFromApi) => {
      /*stateArr.push(newToDo);
      render(); -> not so good alternative */
      loadTodos();
    });
}

function updateTodo(todo) {
  //console.log(todo);
  const updateTodo = {
    id: todo.id,
    description: todo.description,
    done: !todo.done,
  };

  fetch("http://localhost:4730/todos/" + todo.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateTodo),
  })
    .then((response) => response.json())
    .then((updateTodoFromApi) => {
      const index = stateArr.findIndex((item) => item.id === todo.id);
      console.log(stateArr);
      stateArr.splice(index, 1, updateTodoFromApi);
      render();
    });
}

loadTodos();

// submit event auf form, text aus input auslesen und an api senden
newTodoForm.addEventListener("submit", addToDo);

function deleteAllComplete() {
  const doneTodos = stateArr.filter((todos) => todos.done === true);
  const deleteFetches = [];
  doneTodos.forEach((item) => {
    deleteFetches.push(
      fetch("http://localhost:4730/todos/" + item.id, {
        method: "DELETE",
      })
    );
  });

  Promise.all(deleteFetches).then(() => {
    loadTodos();
  });
}

deleteBtn.addEventListener("click", deleteAllComplete);

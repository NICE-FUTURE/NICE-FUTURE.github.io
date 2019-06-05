var storage = window.localStorage;

window.onload = () => {
    // bind event listener.
    // add enter keydown Listener only when the input field was focused.
    var addField = document.getElementById("add-task");
    function enterListener(e) {
        if (e.keyCode === 13) addTodo();
    }
    addField.addEventListener("focus", () => {
        addField.addEventListener("keydown", enterListener);
    });
    addField.addEventListener("focusout", () => {
        addField.removeEventListener("keydown", enterListener);
    });

    // add click event listener to buttons
    document.getElementById("add-button").addEventListener("click", addTodo);
    document.getElementById("all").addEventListener("click", ()=>{
        document.getElementById("task-todo").style.display = "block";
        document.getElementById("task-done").style.display = "block";
    });
    document.getElementById("activate").addEventListener("click", ()=>{
        document.getElementById("task-todo").style.display = "block";
        document.getElementById("task-done").style.display = "none";
    });
    document.getElementById("completed").addEventListener("click", ()=>{
        document.getElementById("task-todo").style.display = "none";
        document.getElementById("task-done").style.display = "block";
    });
    document.getElementById("clear-completed").addEventListener("click", ()=>{
        storage.setItem("done", JSON.stringify([]));
        showDone();
    });

    // initialize storage
    initializeStorage();
}

function initializeStorage() {
    // initialize storage
    if (storage.getItem("todo") === null) storage.setItem("todo", JSON.stringify([]));
    if (storage.getItem("done") === null) storage.setItem("done", JSON.stringify([]));
    showTodo();
    showDone();
    updateInfo();
}

function addTodo () {
    var todoContent = document.getElementById("add-task").value;  // get content
    document.getElementById("add-task").value = "";  // clear input

    if (todoContent === "") return;  // no action

    var todos = JSON.parse(storage.getItem("todo"));
    todos.push(todoContent);  // save todo
    storage.setItem("todo", JSON.stringify(todos));
    showTodo();
}

function doneTodo(node) {
    delTodo(node);  // remove todo
    // add to done list
    var target = node.firstChild.innerHTML;
    var dones = JSON.parse(storage.getItem("done"));
    dones.push(target);
    storage.setItem("done", JSON.stringify(dones));
    showDone();
}

function delTodo(node) {
    document.getElementById("task-todo").removeChild(node);  // remove node from page

    var target = node.firstChild.innerHTML;
    var todos = JSON.parse(storage.getItem("todo"));
    for (let i in todos) {  // remove node from list
        if (todos[i] === target) {
            todos.splice(i, 1);
            break;
        }
    }
    storage.setItem("todo", JSON.stringify(todos));
    updateInfo();
}

function showTodo() {
    var todos = JSON.parse(storage.getItem("todo"));
    document.getElementById("task-todo").innerHTML = "";
    for (let item of todos) {
        let liNode = document.createElement("li");  // <li>
        liNode.innerHTML=item;
        liNode.addEventListener("click", (e)=>{
            doneTodo(e.target.parentNode);
        });
        
        let delButton = document.createElement("button");  // <button>
        delButton.innerHTML = "x";
        delButton.style.display = "none";
        delButton.addEventListener("click", (e)=>{
            delTodo(e.target.parentNode);
        });
        
        let node = document.createElement("div");  // <div>
        node.appendChild(liNode);
        node.appendChild(delButton);
        node.addEventListener("mouseover", ()=>{delButton.style.display="inline-block";});
        node.addEventListener("mouseleave", ()=>{delButton.style.display="none";});
        node.addEventListener("click", (e)=>{
            doneTodo(e.target);
        });
    
        document.getElementById("task-todo").appendChild(node);  // add todo
    }
    updateInfo();
}

function showDone() {
    var dones = JSON.parse(storage.getItem("done"))
    document.getElementById("task-done").innerHTML = "";
    for (let item of dones) {
        let li = document.createElement("li");
        li.innerHTML = item;
        document.getElementById("task-done").appendChild(li);
    }
    updateInfo();
}

function updateInfo() {
    var todos = JSON.parse(storage.getItem("todo"));  // update left items count
    document.getElementById("left-count").innerHTML = todos.length;

    if (JSON.parse(storage.getItem("done")).length < 1)  // update clear completed button
        document.getElementById("clear-completed").style.display = "none";
    else
        document.getElementById("clear-completed").style.display = "inline-block";
}
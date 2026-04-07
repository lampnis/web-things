let add_button = document.getElementById('add-button');
let todo_list = document.getElementById('todo-list');
let remove_buttons = [];
let todo_input = document.getElementById("todo-input");


todo_list.innerHTML = "";

function add_task() {
    console.log(todo_input.value);
    let new_li = document.createElement('li');
    new_li.innerHTML = ` <input class='check-uncheck' type='checkbox'></input>${todo_input.value} <button class='remove-button'>REMOVE</button>`;
    remove_button = new_li.querySelector('.remove-button');
    check_uncheck = new_li.querySelector('.check-uncheck');
    check_uncheck.addEventListener("click", function() {
        console.log(check_uncheck.checked);
    })
    remove_button.addEventListener("click", function() {
        new_li.remove()
    });
    todo_list.appendChild(new_li);
}

add_button.addEventListener("click", add_task);

todo_input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        add_task();
    }
});

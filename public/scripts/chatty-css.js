const socket = io();
const MAX_MESSAGES = 50;

let coll = document.getElementsByClassName("collapsible")[0];
let chatVisible = false;
let firstTimeOpen = true;
let userName = "anonymous";
let chat;

function showUsername(sourceID, value) {
    console.log(`We get ${value} of type ${typeof(value)} from ${sourceID}`);
    return value;
}

socket.on('chat-message', (data) => {
    if (chat) {
        chat.addMessage(data);
        const chatBox = document.querySelector(".chat-messages");
        chatBox.innerHTML += chat.renderMessage(data);
        if (chatBox.children.length > MAX_MESSAGES) {
            chatBox.children[0].remove();
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

socket.on('load-history', (history) => {
    const chatBox = document.querySelector(".chat-messages");
    chatBox.innerHTML = "";

    history.forEach(msg => {
        if (chat) {
            chat.addMessage(msg);
            chatBox.innerHTML += chat.renderMessage(msg);
        }
    });
});

socket.on('username-error', (msg) => {
    const input = document.getElementById("user-name-input");
    input.style.border = "2px solid red";
    // alert(msg);
});

socket.on('username-confirmed', (confirmedName) => {
    let loginForm = coll.nextElementSibling;
    let content = loginForm.nextElementSibling;
    firstTimeOpen = false;
    localStorage.setItem('chat-user', confirmedName);
    console.log(`User set as "${confirmedName}"`);
    chat = new ChatWindow(confirmedName);
    socket.emit('request-history');
    loginForm.style.display = "none";
    content.style.display = "block";
});



coll.addEventListener("click", function() {

    // toggle chat window on off
    this.classList.toggle("active");
    let loginForm = this.nextElementSibling;
    let content = loginForm.nextElementSibling;

    if (content.style.display === "block") {
        content.style.display = "none";
        chatVisible = false;
    } else {
        if (firstTimeOpen) {
            loginForm.style.display = "block";
            document.getElementById("submit-username-btn").addEventListener("click", function() {
                chatVisible = true;
                sourceID = document.getElementById("user-name-input");
                value = sourceID.value;
                userName = showUsername(sourceID.id, value);
                socket.emit('set-username', userName);
            });
        } else {
            content.style.display = "block";
            chatVisible = true;
        }
    }
});

document.getElementById("message-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        document.getElementById("send-message-btn").click();
    }
});

document.getElementsByClassName("login-form")[0].addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        document.getElementById("submit-username-btn").click();
    }
});

document.getElementById("send-message-btn").addEventListener("click", () => {
    const input = document.getElementById("message-input");
    const text = input.value;

    if (text.trim() !== "") {
        const messageData = {
            user: userName,
            text: text,
            timestamp: new Date()
        };
        socket.emit('send-message', messageData);
        input.value = "";
    }
});

const savedName = localStorage.getItem('chat-user');
if (savedName) {
    userName = savedName;
    firstTimeOpen = false;
    chat = new ChatWindow(userName);
    socket.emit('set-username', userName);
    socket.emit('request-history');
}


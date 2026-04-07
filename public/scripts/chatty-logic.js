function formatTime(timestamp) {
    let date = new Date(timestamp);
    return date.getHours() + ":" + date.getMinutes().toString().padStart(2, '0');
}

class ChatWindow {
    constructor(user="anonymous") {
        this.messages = [];
        this.maxMessages = 3;
        this.username = user;
        this.isCollapsed = true;
    }

    sendMessage(text) {
        const message = {
            text: text,
            user: this.username,
            timestamp: new Date()
        };
        this.addMessage(message);
    }

    addMessage(message) {
        this.messages.push(message);
    }

    renderMessage(message) {
        return `
        <div class="message">
            <span class="message-time">${formatTime(message.timestamp)}</span>
            <span class="message-user">${message.user} </span>
            <div class="message-text"> ${message.text}</div>
        `;
    }

    updateDisplay() {
        const messagesHTML = this.messages
            .map(msg => this.renderMessage(msg))
            .join('');
    }
}
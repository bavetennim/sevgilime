async function sendMessage() {
    const inputElement = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const messageText = inputElement.value.trim();

    if (!messageText) return;

    // Kullanıcı mesajını ekrana ekle
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'message user';
    userMsgDiv.textContent = messageText;
    chatMessages.appendChild(userMsgDiv);

    inputElement.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Geçmiş mesajları topla
    const messages = [];
    chatMessages.querySelectorAll('.message').forEach(msg => {
        if (msg.classList.contains('user')) {
            messages.push({ role: 'user', content: msg.textContent });
        } else if (msg.classList.contains('ai')) {
            messages.push({ role: 'assistant', content: msg.textContent });
        }
    });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        const data = await response.json();

        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'message ai';
        if (data.reply) {
            aiMsgDiv.textContent = data.reply;
        } else {
            aiMsgDiv.textContent = data.error || "Bir şeyler yanlış gitti sevgilim...";
        }
        chatMessages.appendChild(aiMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error('Hata:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message ai';
        errorDiv.textContent = "Bağlantı kurulamadı sevgilim...";
        chatMessages.appendChild(errorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Enter tuşu ile mesaj gönderme desteği
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
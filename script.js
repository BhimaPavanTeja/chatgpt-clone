const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.querySelector("#chat-input");
    const sendButton = document.querySelector("#send-btn");
    const chatContainer = document.querySelector(".chat-container");
    const deleteButton = document.querySelector("#delete-btn");

    let userText = null;
    const API_KEY = "YOUR_API_KEY";

    const loadDataFromLocalStorage = () => {
        chatContainer.innerHTML = localStorage.getItem("all-chats");
        chatContainer.scrollTo(0, chatContainer.scrollHeight);

        const defaultText = `<div class="default-text">
                                <img src="./chatgpt-logo.jpg" alt="" width="100" height="100">
                                <h1>Welcome to ChatGPT</h1>
                                <h3>Start a conversation with me. I am a helpful assistant.</h3> <br> <p>Ask me anything and your chat will be displayed here.</p>
                                </div>`
        chatContainer.innerHTML = chatContainer.innerHTML || defaultText;
    }

    loadDataFromLocalStorage();

    const createElement = (html, className) => {
        const chatDiv = document.createElement('div');
        chatDiv.classList.add("chat", className);
        chatDiv.innerHTML = html;
        return chatDiv;
    }

    const getChatResponse = async (incomingChatDiv) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const pElement = document.createElement("p");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": userText
                    }
                ]
                  })
        }
        try {
            const response = await (await fetch(API_URL, requestOptions)).json();
            pElement.textContent = response.choices[0].message.content.trim();
        } catch(error) {
            pElement.classList.add("error");
            pElement.textContent = "Sorry, I am unable to process your request at the moment or network issues!. Please try again later.";
        }
        incomingChatDiv.querySelector(".typing-animation").remove();
        incomingChatDiv.querySelector(".chat-message").appendChild(pElement);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
        localStorage.setItem("all-chats", chatContainer.innerHTML);
    }

    
    
    const showTypingAnimation = () => {
        if (userText !== "") {
        const html = `<div class="chat-box" id="special">
                        <div class="chat-message">
                           <img src="./chatgpt-logo.jpg" alt="" width="50" height="50">
                               <div class="typing-animation">
                                    <div class="dot" style="--delay: 0.2s"></div>
                                    <div class="dot" style="--delay: 0.3s"></div>
                                    <div class="dot" style="--delay: 0.4s"></div>
                               </div>
                        </div>
                        <span onclick="copyResponse(this)" class="material-symbols-outlined">
                            content_copy
                        </span>
                    </div>`;
            const incomingChatDiv = createElement(html, "incoming");
            chatContainer.appendChild(incomingChatDiv);
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
            getChatResponse(incomingChatDiv);
        }
    }

    const handleOutgoingChat = () => {
        userText = chatInput.value.trim();
        if (userText !== "") {
            const html = `<div class="chat-box">
                            <div class="chat-message">
                                <img src="./sunny.jpg" alt="" width="50" height="50">
                                <p></p>
                            </div>
                        </div>`;
            const outgoingChatDiv = createElement(html, "outgoing");
            outgoingChatDiv.querySelector("p").textContent = userText;
            document.querySelector(".default-text")?.remove();
            chatContainer.appendChild(outgoingChatDiv);
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
            chatInput.value = ""; // Clear input after sending
            setTimeout(showTypingAnimation, 500);
        }
    }

    sendButton.addEventListener("click", handleOutgoingChat);


    //theme switcher
    const body = document.querySelector("body");
    const lightModeButton = document.querySelector("#light-mode-btn");
    const inputBox = document.querySelector(".input-box");

lightModeButton.addEventListener("click", () => {
    //console.log("clicked");
    if(body.style.backgroundColor == "rgb(34, 35, 41)") {
    body.style.backgroundColor = "rgb(42, 145, 111)";
    inputBox.style.backgroundColor = "white";
    inputBox.style.border = "none";
    chatInput.style.backgroundColor = "white";
    chatInput.style.border = "2px solid black";
    chatInput.style.color = "black";
    sendButton.style.color = "black";
    lightModeButton.innerText = "dark_mode";
    } else {    
    body.style.backgroundColor = "rgb(34, 35, 41)";
    inputBox.style.backgroundColor = "rgb(34, 35, 41)";
    inputBox.style.border = "1px solid #4f4f4f";
    chatInput.style.backgroundColor = "#444654";
    chatInput.style.border = "none";
    chatInput.style.color = "white";
    sendButton.style.color = "white";
    lightModeButton.innerText = "light_mode";
    }
});

    //delete chat
    deleteButton.addEventListener("click", () => {
        if(confirm("Are you sure you want to delete all chats?")) {
            localStorage.removeItem("all-chats");
            loadDataFromLocalStorage();
        }
    });

    
    // chatInput.addEventListener("keydown", (event) => {
    //     if(event.key === "Enter") {
    //         handleOutgoingChat();
    //     }
    // });

});

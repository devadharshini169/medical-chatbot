import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((previous) => [
      ...previous,
      { sender: "user", text: userMessage }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        { sender: "bot", text: data.response }
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text: "Unable to connect to the medical chatbot. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">

      <div className="chat-container">

        {/* Header */}
        <div className="header">

          <div className="header-left">
            <div className="logo">🩺</div>

            <div>
              <h2>MedAssist</h2>
              <span className="online">
                <span className="online-dot"></span>
                Online
              </span>
            </div>
          </div>

          <button className="clear-button" onClick={clearChat}>
            Clear Chat
          </button>

        </div>

        {/* Chat area */}
        <div className="messages">

          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="welcome">

              <div className="welcome-icon">
                🩺
              </div>

              <h1>Welcome to MedAssist</h1>

              <p>
                Your AI-powered medical information assistant.
              </p>

              <p className="welcome-small">
                Ask questions about symptoms, health conditions,
                general wellness and more.
              </p>

              <div className="suggestions">

                <button
                  onClick={() => setMessage("What is fever?")}
                >
                  🌡️ What is fever?
                </button>

                <button
                  onClick={() => setMessage("What are the symptoms of flu?")}
                >
                  🤒 Flu symptoms
                </button>

                <button
                  onClick={() => setMessage("How can I stay healthy?")}
                >
                  💚 Healthy lifestyle
                </button>

              </div>

            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "user-message"
                  : "bot-message"
              }
            >
              {msg.text}
            </div>
          ))}

          {/* Thinking indicator */}
          {loading && (
            <div className="bot-message thinking">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

        </div>

        {/* Input */}
        <div className="input-area">

          <input
            type="text"
            placeholder="Ask a medical question..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          ⚠️ For general medical information only. This chatbot does not
          provide diagnosis or replace professional medical advice.
        </div>

      </div>

    </div>
  );
}

export default App;
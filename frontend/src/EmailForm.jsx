import { useState } from "react";

export default function EmailForm({ userEmail }) {
    const [to, setTo] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);

    async function handleSend() {
        if (!to) {
            alert("Please enter recipient email");
            return;
        }

        if (!message && !file) {
            alert("Please enter a message or attach a file");
            return;
        }

        setSending(true);

        // Add message to chat immediately
        const newMessage = {
            text: message,
            fileName: file?.name,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sending"
        };
        setMessages(prev => [...prev, newMessage]);

        const formData = new FormData();
        formData.append("user_email", userEmail);
        formData.append("to", to);
        formData.append("subject", "Message from Email Chat");
        formData.append("message", message || "(File attached)");
        if (file) {
            formData.append("file", file);
        }

        try {
            const response = await fetch("http://localhost:8000/send", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.status === "sent") {
                // Update message status to sent
                setMessages(prev =>
                    prev.map((msg, idx) =>
                        idx === prev.length - 1 ? { ...msg, status: "sent" } : msg
                    )
                );

                // Clear inputs
                setMessage("");
                setFile(null);
            } else {
                // Update message status to failed
                setMessages(prev =>
                    prev.map((msg, idx) =>
                        idx === prev.length - 1 ? { ...msg, status: "failed" } : msg
                    )
                );
                alert("Failed to send: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Send error:", error);
            setMessages(prev =>
                prev.map((msg, idx) =>
                    idx === prev.length - 1 ? { ...msg, status: "failed" } : msg
                )
            );
            alert("Error sending message");
        } finally {
            setSending(false);
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.avatar}>
                        {to ? to[0].toUpperCase() : "?"}
                    </div>
                    <div style={styles.headerInfo}>
                        <input
                            type="email"
                            placeholder="Enter recipient email..."
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            style={styles.recipientInput}
                        />
                        <div style={styles.userEmail}>From: {userEmail}</div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div style={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>💬</div>
                        <p style={styles.emptyTitle}>No messages yet</p>
                        <p style={styles.emptyHint}>Enter recipient email and start sending!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} style={styles.messageWrapper}>
                            <div style={styles.messageBubble}>
                                {msg.text && <div style={styles.messageText}>{msg.text}</div>}
                                {msg.fileName && (
                                    <div style={styles.fileAttachment}>
                                        📎 {msg.fileName}
                                    </div>
                                )}
                                <div style={styles.messageFooter}>
                                    <span style={styles.timestamp}>{msg.timestamp}</span>
                                    <span style={styles.status}>
                                        {msg.status === "sending" && "⏳"}
                                        {msg.status === "sent" && "✓✓"}
                                        {msg.status === "failed" && "❌"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div style={styles.inputContainer}>
                {file && (
                    <div style={styles.filePreview}>
                        <span style={styles.filePreviewText}>📎 {file.name}</span>
                        <button
                            onClick={() => setFile(null)}
                            style={styles.removeFile}
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div style={styles.inputBar}>
                    <label style={styles.attachButton}>
                        📎
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={styles.fileInput}
                        />
                    </label>

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={styles.messageInput}
                        disabled={sending}
                    />

                    <button
                        onClick={handleSend}
                        style={{
                            ...styles.sendButton,
                            opacity: (!message && !file) || sending ? 0.5 : 1,
                            cursor: (!message && !file) || sending ? 'not-allowed' : 'pointer'
                        }}
                        disabled={sending || (!message && !file)}
                    >
                        {sending ? "⏳" : "➤"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "min(1200px, 100%)",
        margin: "0 auto",
        backgroundColor: "#e5ddd5",
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        boxShadow: "0 0 40px rgba(0,0,0,0.15)",
    },
    header: {
        backgroundColor: "#075e54",
        color: "white",
        padding: "18px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 10,
    },
    headerContent: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        maxWidth: 1000,
        margin: "0 auto",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "#25d366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        fontWeight: "bold",
        flexShrink: 0,
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    headerInfo: {
        flex: 1,
    },
    recipientInput: {
        width: "100%",
        padding: "10px 14px",
        fontSize: 16,
        border: "none",
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "white",
        outline: "none",
        transition: "background-color 0.2s",
    },
    userEmail: {
        fontSize: 13,
        opacity: 0.85,
        marginTop: 6,
    },
    messagesContainer: {
        flex: 1,
        overflowY: "auto",
        padding: "30px 24px",
        backgroundImage: `
            repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.02) 0px,
                rgba(0,0,0,0.02) 1px,
                transparent 1px,
                transparent 30px
            )
        `,
        maxWidth: 1000,
        margin: "0 auto",
        width: "100%",
    },
    emptyState: {
        textAlign: "center",
        color: "#667781",
        marginTop: "15vh",
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
        opacity: 0.6,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 500,
        marginBottom: 8,
    },
    emptyHint: {
        fontSize: 15,
        opacity: 0.7,
    },
    messageWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 16,
        animation: "slideIn 0.2s ease-out",
    },
    messageBubble: {
        backgroundColor: "#dcf8c6",
        padding: "10px 14px",
        borderRadius: "10px",
        maxWidth: "65%",
        minWidth: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        position: "relative",
    },
    messageText: {
        fontSize: 15,
        color: "#111",
        wordWrap: "break-word",
        lineHeight: 1.5,
        marginBottom: 4,
    },
    fileAttachment: {
        fontSize: 14,
        color: "#075e54",
        backgroundColor: "rgba(0,0,0,0.06)",
        padding: "8px 12px",
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 4,
        fontWeight: 500,
    },
    messageFooter: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },
    timestamp: {
        fontSize: 11,
        color: "#667781",
    },
    status: {
        fontSize: 14,
        color: "#53bdeb",
    },
    inputContainer: {
        backgroundColor: "#f0f2f5",
        padding: "16px 24px 20px",
        borderTop: "1px solid #d1d7db",
        maxWidth: 1000,
        margin: "0 auto",
        width: "100%",
    },
    filePreview: {
        backgroundColor: "white",
        padding: "10px 14px",
        borderRadius: 10,
        marginBottom: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    filePreviewText: {
        color: "#075e54",
        fontWeight: 500,
    },
    removeFile: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        color: "#667781",
        padding: "4px 8px",
        borderRadius: 4,
        transition: "background-color 0.2s",
    },
    inputBar: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        backgroundColor: "white",
        borderRadius: 30,
        padding: "10px 16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    attachButton: {
        fontSize: 24,
        cursor: "pointer",
        color: "#667781",
        display: "flex",
        alignItems: "center",
        padding: "6px",
        borderRadius: "50%",
        transition: "background-color 0.2s",
    },
    fileInput: {
        display: "none",
    },
    messageInput: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: 16,
        padding: "10px 14px",
        backgroundColor: "transparent",
        color: "#111",
    },
    sendButton: {
        backgroundColor: "#075e54",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: 46,
        height: 46,
        fontSize: 20,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
};

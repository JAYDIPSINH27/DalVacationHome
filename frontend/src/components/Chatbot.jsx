import { AuthenticationContext } from "../AuthenticationContextProvider";
import React, { useContext, useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, Fab } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import { sendMessageToLex } from "../services/lexService";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { userAttributesMap, userRole } = useContext(AuthenticationContext);
  const userId = userAttributesMap.current?.sub;

  const [sessionId] = useState(`session_${Date.now()}`);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      isUser: true,
    };
    setMessages([...messages, userMessage]);
    setInputMessage("");

    try {
      const response = await sendMessageToLex(inputMessage, sessionId, userRole, userId);
      console.log(userId)
      const lexMessage = {
        text: response,
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, lexMessage]);
    } catch (error) {
      console.error("Error in Lex response:", error);
    }
  };

  const handleToggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const isHtml = (text) => /<a\b[^>]*>(.*?)<\/a>/i.test(text);


  return (
    <div>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleToggleChatbot}
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px"
        }}>
        <ChatIcon />
      </Fab>
      {isOpen && (
        <Box
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: "400px",
            position: "fixed",
            bottom: "80px",
            right: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
          }}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index} alignItems="flex-start" sx={{ justifyContent: message.isUser ? "flex-end" : "flex-start" }}>
                {isHtml(message.text) ? (
                  <ListItemText
                    primary={<span dangerouslySetInnerHTML={{ __html: message.text }} />}
                    sx={{ backgroundColor: message.isUser ? "#1976d2" : "#e0e0e0", borderRadius: "10px", p: 1, color: message.isUser ? "#fff" : "#000" }}
                  />
                ) : (
                  <ListItemText
                    primary={message.text}
                    sx={{ backgroundColor: message.isUser ? "#1976d2" : "#e0e0e0", borderRadius: "10px", p: 1, color: message.isUser ? "#fff" : "#000" }}
                  />
                )}
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ ml: 2 }}>
              Send
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Chatbot;

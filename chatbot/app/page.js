'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NoteIcon from '@mui/icons-material/Note';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SavingsIcon from '@mui/icons-material/Savings';
import { Fira_Code } from 'next/font/google';

const firaCode = Fira_Code({
  weight: ['700', '300'], // Specify 700 weight
  subsets: ['latin'],
});

export default function Home() {
  const [messages, setMessages] = useState([]); // Start with an empty message list
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false); // Track if the chat has started

  const sendMessage = async (messageToSend) => {
    if (!messageToSend.trim()) return; 

    // If it's the first message, set the chat as started
    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    // Store the user message with the role
    const newMessage = { role: 'user', content: messageToSend };
  
    // Append the user's message and a placeholder for the assistant's response
    setMessages((messages) => [
      ...messages,
      newMessage,
      { role: 'assistant', content: '' },
    ]);
    setMessage('');
    setIsLoading(true); 
  
    try {
      const response = await fetch('http://localhost:8000/pinecone-wikipedia/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: messageToSend }), // Only send the question to the server
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const { result } = await response.json(); // Assuming your server returns the result as {"result": "the assistant's response"}
  
      // Update the last message (which was the assistant's placeholder) with the actual response
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: result }, // Update the content with the actual response
        ];
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="900px"
        height="700px"
        p={2}
        spacing={3}
        justifyContent="center"  // Ensures vertical centering
        alignItems="center"  // Ensures horizontal centering
      >
        {/* Conditionally render the welcome box or the chat interface */}
        {!isChatStarted ? (
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white for dark mode
              backdropFilter: 'blur(10px)', // Apply blur to the background
              borderRadius: '16px', // Rounded corners
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
              padding: '20px', // Padding for inner content
              color: 'white', // Text color for dark mode
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Center content vertically within the box
              alignItems: 'center', // Center content horizontally within the box
              height: '500px',
              width: '700px',
            }}
          >
            <Image
              src={`/moneyhub_short.png`}
              width={80}
              height={80}
              alt="MoneyHub Logo"
            />
            <h1 style={{ fontFamily: firaCode.style.fontFamily, fontWeight: 700 }}> Welcome to MoneyHub </h1>
            <p style={{ fontFamily: firaCode.style.fontFamily, fontWeight: 300 }}>Select a prompt or type your message below to get started</p>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              width="510px"
              padding="20px"
            >
              <Button
              
              sx={{
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white for dark mode
                backdropFilter: 'blur(10px)', // Apply blur to the background
                borderRadius: '16px', // Rounded corners
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                padding: '20px', // Padding for inner content
                color: 'white', // Text color for dark mode
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center content vertically within the box
                alignItems: 'center', // Center content horizontally within the box
                height: '150px',
                width: '150px',
              }}
              onClick={() => {
                sendMessage('What is investing?');
              }}
              >
                  <ShowChartIcon />
                  <p style={{ fontFamily: firaCode.style.fontFamily, fontWeight: 300 }}> What is investing? </p>
              </Button>

              <Button
              sx={{
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white for dark mode
                backdropFilter: 'blur(10px)', // Apply blur to the background
                borderRadius: '16px', // Rounded corners
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                padding: '20px', // Padding for inner content
                color: 'white', // Text color for dark mode
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center content vertically within the box
                alignItems: 'center', // Center content horizontally within the box
                height: '150px',
                width: '150px',
              }}
              onClick={() => sendMessage("How do I create a budget")}
              >
                <NoteIcon />
                <p style={{ fontFamily: firaCode.style.fontFamily, fontWeight: 300 }}> How do I create a budget? </p>
              </Button>
              <Button
              sx={{
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white for dark mode // what is investing, how to budget, what percent for emergency savings
                backdropFilter: 'blur(10px)', // Apply blur to the background
                borderRadius: '16px', // Rounded corners
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                padding: '20px', // Padding for inner content
                color: 'white', // Text color for dark mode
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center content vertically within the box
                alignItems: 'center', // Center content horizontally within the box
                height: '150px',
                width: '150px',
              }}
              onClick={() => {
                sendMessage('What percent of my income should I put in my emergency savings?');
              }}
              >
                <SavingsIcon />
                <p style={{ fontFamily: firaCode.style.fontFamily, fontWeight: 300, fontSize: '10px'}}> What percent of my income should I put in my emergency savings? </p>
              </Button>

            </Box>
            <Box 
              display="flex"
              alignItems="center" // Center items vertically
              spacing={1} 
              width="600px"
              height="50px"
              sx={{ 
                bgcolor: '#F4F4F4', 
                borderRadius: 2, 
                padding: '0 8px', // Optional: Add some padding inside the box
              }}
            >
              <TextField
                variant="standard"
                placeholder='Ask me anything!'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{ 
                  flexGrow: 1, 
                  marginRight: '8px', 
                }}
                InputProps={{
                  disableUnderline: true,
                }}
                fullWidth // Ensures the TextField occupies its full flex space
              />
              <Button 
                variant="contained" // Use 'contained' for a more visible button
                onClick={() => sendMessage(message)}
                disabled={isLoading}
                sx={{
                  width: '5%',
                  backgroundColor: '#7FBFE2' // Button takes up 20% of the parent Box
                }}
              >
                {isLoading ? 'Sending...' : <ExpandLessIcon/>}
              </Button>
            </Box>

          </Box>
        ) : (
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  bgcolor={message.role === 'assistant' ? '#F4F4F4' : '#7FC1E3'}
                  color={message.role === 'assistant' ? 'black' : 'white'}
                  borderRadius={message.role === 'assistant' ? "16px 16px 16px 0px" : "16px 16px 0px 16px"}
                  p={2}
                  maxWidth={'500px'}

                >
                  {message.content === '' ? '...' : message.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
            <Box 
              display="flex"
              alignItems="center" // Center items vertically
              spacing={1} 
              width="600px"
              height="50px"
              sx={{ 
                bgcolor: '#F4F4F4', 
                borderRadius: 2, 
                padding: '0 8px', // Optional: Add some padding inside the box
              }}
            >
              <TextField
                variant="standard"
                placeholder='Ask me anything!'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{ 
                  flexGrow: 1, 
                  marginRight: '8px', 
                }}
                InputProps={{
                  disableUnderline: true,
                }}
                fullWidth // Ensures the TextField occupies its full flex space
              />
              <Button 
                variant="contained" // Use 'contained' for a more visible button
                onClick={() => sendMessage(message)}
                disabled={isLoading}
                sx={{
                  width: '5%',
                  backgroundColor: '#7FBFE2' // Button takes up 20% of the parent Box
                }}
              >
                {isLoading ? 'Sending...' : <ExpandLessIcon/>}
              </Button>
            </Box>
          </Stack>

          
        )}
      
      </Stack>
    </Box>
  )
}

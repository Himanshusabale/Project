// Backend: server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost/chat_app', { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}));

const Message = mongoose.model('Message', new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
}));

// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied.');
  try {
    const verified = jwt.verify(token, 'secretKey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

// Routes
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.send('User registered successfully.');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found.');
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).send('Invalid credentials.');

  const token = jwt.sign({ _id: user._id }, 'secretKey');
  res.json({ token });
});

app.get('/users', authMiddleware, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.json(users);
});

app.get('/messages', authMiddleware, async (req, res) => {
  const { userId } = req.query;
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: userId },
      { senderId: userId, receiverId: req.user._id },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    io.to(receiverId).emit('receiveMessage', newMessage);
  });

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// Frontend: React components
// 1. Install dependencies: npm install react-router-dom axios socket.io-client
// 2. Set up pages: Login, Signup, Chat
// 3. Main Chat component with socket integration:

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Chat = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const res = await axios.get(`http://localhost:3000/messages?userId=${selectedUser._id}`, {
          headers: { Authorization: token },
        });
        setMessages(res.data);
      };
      fetchMessages();
      socket.emit('joinRoom', selectedUser._id);
    }
  }, [selectedUser, token]);

  const sendMessage = () => {
    socket.emit('sendMessage', { senderId: 'loggedInUserId', receiverId: selectedUser._id, message });
    setMessages([...messages, { senderId: 'loggedInUserId', receiverId: selectedUser._id, message }]);
    setMessage('');
  };

  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
  }, []);

  return (
    <div className="chat-container">
      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} onClick={() => setSelectedUser(user)}>
            {user.username}
          </div>
        ))}
      </div>
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === 'loggedInUserId' ? 'sent' : 'received'}>
            {msg.message}
          </div>
        ))}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

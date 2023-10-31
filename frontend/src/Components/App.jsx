import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Header } from "./Header";

const socket = io('http://localhost:3000'); // Replace with your server's URL
function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
  }, []);

  return (
    <div>
      <Header />
    </div>
  );
}

export default App;



/* 'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Mengambil riwayat chat saat halaman dimuat
    const fetchChatHistory = async () => {
      const response = await fetch('/api/chatHistory');
      const chatHistory = await response.json();
      setMessages(chatHistory);
    };

    fetchChatHistory();

    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        console.log(event)
        const newMessage = JSON.parse(event.data);
        // Mengabaikan pesan "Connected"
        if (newMessage.message !== 'Connected') {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          username: username,
          time: Date.now(),
        }),
      });
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.username}: {msg.message}</li>
        ))}
      </ul>
      <label htmlFor='uname'>Username: </label>
      <input
        id='uname'
        type="text"
        className='border-solid border border-black'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Type Username..."
      />
      <br/>
      <label htmlFor='text'>Text: </label>
      <input
        id='text'
        type="text"
        className='border-solid border border-black'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
} */


import { frijole } from "./ui/fonts";
import Gamecode from "./Gamecode";

export default function Page() {
  return (
    <>
      <div className="mincomp flexcenter h-[70vh] flex-col pt-14 mb-20">
        <h1 className={`${frijole.className} text-3xl text-rose-700`}>W<b className="font-normal text-red-600">O</b>LFMAN</h1>
        <Gamecode />
      </div>
      <div className="mincomp bst py-8 ">
        <article className="mincomp flex flex-col gap-3">
          <h1 className="text-2xl "><b className={`font-normal ${frijole.className} text-rose-800`}>WOLFMAN</b>: mainkan bersama teman secara langsung!</h1>
          <p className="text-base text-justify first-letter:ml-4">
            Website ini membantu kamu bermain game <i>Werewolf</i> secara luring bersama teman-temanmu, namun tanpa merugikan <i>role-role tertentu</i>.
          </p>
          <p className="text-base text-justify first-letter:ml-4">
            Dengan menggunakan website ini, <i>role-role</i> yang membutuhkan kerahasiaan dapat menjadi sedikit lebih bebas untuk berkomunikasi satu sama lain tanpa takut ketahuan oleh pemain lainnya dengan fitur chat bawaan website ini.
          </p>
        </article>

      </div>
    </>
  );
}

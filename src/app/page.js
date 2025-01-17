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
import Gamecode from "@/app/component/Gamecode";
import InfiniteCarousel from "./component/InfiniteCarousel";

export default function Page() {
  return (
    <>
      <div className="mincomp flexcenter h-[75vh] flex-col pt-14 mb-20">
        <h1 className={`${frijole.className} text-3xl text-rose-700`}>W<b className="font-normal text-red-600">O</b>LFMAN</h1>
        <Gamecode />
      </div>
      <div className="mincomp bst py-8 ">
        <article className="mincomp flex flex-col gap-3 xs:px-6 sm:px-10 md:px-16 lg:px-32 xl:px-52 2xl:px-64">
          <h1 className="text-2xl "><b className={`font-normal ${frijole.className} text-rose-800`}>WOLFMAN</b>: mainkan bersama teman secara langsung!</h1>
          <p className="text-base lg:text-lg text-justify first-letter:ml-4 xm">
          <b>WOLFMAN</b> adalah permainan Werewolf klasik di mana para warga bekerja sama untuk menebak dan menyingkirkan semua Werewolf yang bersembunyi di antara mereka. Tantangannya adalah para warga tidak dapat mengetahui siapa di antara mereka yang sebenarnya adalah Werewolf. Oleh karena itu, warga harus menyusun strategi untuk mengungkap identitas para Werewolf, sementara Werewolf juga harus merancang taktik agar tidak ketahuan.
          </p>
          <p className="text-base lg:text-lg text-justify first-letter:ml-4 xm">
          Permainan berlangsung dalam dua fase: siang dan malam. Pada siang hari, warga melakukan diskusi dan voting untuk menentukan siapa yang akan dibunuh, dengan harapan bahwa yang terpilih adalah Werewolf. Sebaliknya, pada malam hari, warga harus <i>"tertidur"</i>, memberikan kesempatan bagi Werewolf untuk diam-diam memilih dan membunuh salah satu warga.
          </p>
        </article>

      </div>
      <div className="mincomp pt-10">
        <InfiniteCarousel />
      </div>
    </>
  );
}

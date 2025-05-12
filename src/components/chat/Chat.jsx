import React, { useEffect, useState } from 'react';

export default function Chat() {
  const [signedInUser, setSignedInUser] = useState(null);
  const [chatPartners, setChatPartners] = useState([]);
  const [chatWith, setChatWith] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('SignedInUser'));
    const students = JSON.parse(localStorage.getItem('Students')) || [];
    const admins = JSON.parse(localStorage.getItem('Admins')) || [];

    if (!user) {
      console.error('No user is signed in.');
      return;
    }

    setSignedInUser(user);

    if (user.role === 'Admin') {
      setChatPartners(students);
    } else if (user.role === 'Student') {
      setChatPartners(admins);
    }
  }, []);

  const getChatKey = (user1, user2) => {
    return `chat_${[user1, user2].sort().join('_')}`;
  };

  const loadChat = (partner) => {
    setChatWith(partner);
    const key = getChatKey(signedInUser.username, partner.username);
    const history = JSON.parse(localStorage.getItem(key)) || [];
    setMessages(history);
  };

  const sendMessage = () => {
    if (!input.trim() || !chatWith) return;

    const key = getChatKey(signedInUser.username, chatWith.username);
    const newMessage = {
      sender: signedInUser.username,
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(key, JSON.stringify(updatedMessages));
    setInput('');
  };

  const renderChatPartnerName = (partner) => {
    return signedInUser.role === 'Admin'
      ? `${partner.username} (ID: ${partner.universityId})`
      : `${partner.username} (Admin)`;
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white p-6">
      {/* Sidebar */}
      <div className="w-1/4">
        <h2 className="text-xl font-bold mb-2 mx-3">
          List of {signedInUser?.role === 'Admin' ? 'Students' : 'Admins'}
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-[90vh] pr-2">
          {chatPartners.map((partner, index) => (
            <div
              key={index}
              className="bg-[#444444] p-3 rounded cursor-pointer hover:bg-[#333333] transition mb-2 w-80 mx-4"
              onClick={() => loadChat(partner)}
            >
              {renderChatPartnerName(partner)}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-3/4 pl-6">
        <div className="ring-1 ring-neutral-600 bg-[#2a2a2a] p-4 rounded-lg shadow-md/40 h-[300px] mt-5 mx-5 flex flex-col">
          <h3 className="text-lg font-semibold mb-3">
            {chatWith
              ? `Chatting with ${chatWith.username}...`
              : 'Select someone to chat with'}
          </h3>

          {/* Message Area */}
          <div className="flex-grow overflow-auto space-y-2 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded w-fit max-w-full ${
                  msg.sender === signedInUser.username
                    ? 'bg-blue-500 text-white w-full mb-2'
                    : 'bg-green-500 ml-auto text-white text-right w-full mb-2'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          {chatWith && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="ring-1 ring-neutral-600 flex-grow bg-[#333333] text-white px-4 py-2 mx-3 rounded outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 px-3 py-2 rounded hover:bg-green-600"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

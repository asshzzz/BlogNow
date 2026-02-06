import { useState } from "react";

export default function Contact() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent: " + message);
    setMessage("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Contact</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." className="border p-2" />
        <button className="bg-blue-600 text-white px-4 py-2">Send</button>
      </form>
    </div>
  );
}

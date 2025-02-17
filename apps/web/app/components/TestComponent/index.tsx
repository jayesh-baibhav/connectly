'use client'
import { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketProvider";

interface MessageFormData {
  senderId: string;
  receiverId: string;
  message: string;
}

const TestComponent: React.FC = () => {
  const { sendMessage, messages } = useSocket();
  const [formData, setFormData] = useState<MessageFormData>({
    senderId: "",
    receiverId: "",
    message: "",
  });

  useEffect(()=>{
    console.log(messages)
  },[messages])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      createdAt: Date.now(),
    };
    console.log("Updated Form Data:", updatedFormData);
    sendMessage(updatedFormData); // Send the updated form data
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <div>
        <label htmlFor="senderId">Sender ID:</label>
        <input
          type="text"
          id="senderId"
          name="senderId"
          value={formData.senderId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="receiverId">Receiver ID:</label>
        <input
          type="text"
          id="receiverId"
          name="receiverId"
          value={formData.receiverId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <button type="submit">Send</button>
    </form>
  );
};

export default TestComponent;

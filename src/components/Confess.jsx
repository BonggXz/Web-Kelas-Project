import React, { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

function Menfess() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const menfessCollectionRef = collection(db, "menfess");

  const sendMenfess = async () => {
    if (from.trim() === "" || to.trim() === "" || message.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "All fields are required",
        text: "Please fill in all fields before sending the message.",
        customClass: {
          container: "sweet-alert-container",
        },
      });
      return;
    }

    const trimmedMessage = message.trim().substring(0, 60);

    try {
      await addDoc(menfessCollectionRef, {
        from: from.trim(),
        to: to.trim(),
        message: trimmedMessage,
        timestamp: new Date(),
      });

      // Berhasil kirim, tampilkan notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been successfully sent.",
        customClass: {
          container: "sweet-alert-container",
        },
      });

      // Reset input setelah sukses
      setFrom(""); 
      setTo("");
      setMessage("");
    } catch (error) {
      // Tampilkan error jika ada masalah saat mengirim
      Swal.fire({
        icon: "error",
        title: "Oops, something went wrong!",
        text: "Failed to send your message. Please try again later.",
        customClass: {
          container: "sweet-alert-container",
        },
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMenfess();
    }
  };

  return (
    <div className="menfess">
      <div className="text-center text-4xl font-semibold" id="menfessglow">
        Kirim Menfess
      </div>

      <div className="menfess-box">
        <input
          className="menfess-input"
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From"
        />
        <input
          className="menfess-input"
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
        />
        <textarea
          className="menfess-input message-box"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message"
        ></textarea>
        <button onClick={sendMenfess} className="send-button">
          <img src="/paper-plane.png" alt="" className="h-4 w-4 lg:h-6 lg:w-6" />
        </button>
      </div>
    </div>
  );
}

export default Menfess;

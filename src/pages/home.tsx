import React, { useRef } from "react";
import { firestore } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Home = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  const ref = collection(firestore, "messages");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (!message) return;
    console.log(message);

    try {
      await addDoc(ref, { message });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    messageRef.current!.value = "";
  };

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSave}>
        <label>Enter message:</label>
        <input type="text" ref={messageRef} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Home;

import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import { getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import { IoMdSend } from 'react-icons/io'
import { BiImageAdd } from 'react-icons/bi'


const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);


  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async (e) => {
    if (img) {
      const storageRef = ref(storage, uuid);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          // setErr(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );

    }
    else {
      await updateDoc(doc(db, "chats", data.chatID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatID + ".lastMessage"]: {
        text
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatID + ".lastMessage"]: {
        text
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' value={text} onChange={e => setText(e.target.value)} />

      <div className="send">
        <input type="file" style={{ display: "none" }} id="file" onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <BiImageAdd />
        </label>
        <button onClick={handleSend}><IoMdSend/></button>
      </div>

    </div>
  )
}

export default Input
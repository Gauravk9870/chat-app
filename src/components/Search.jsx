import React,{ useState, useContext } from 'react'
import { collection, query, where, getDocs, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { doc , setDoc} from 'firebase/firestore';

const Search = () => {

  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async() => {
    console.log("Searching "+username+"...");
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        console.log(doc.data());        
      });
    }
    catch(err){
      setErr(true);
    }
  }

  const handleKey=(e)=>{
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async(e) => {
    // check whether the group(chats in firestore) already exists, if not create it
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid; 
    console.log("Combined Id: "+combinedId);

    try{
      const res = await getDoc(doc(db, "chats", combinedId));
      
      if(!res.exists()){
        //create chat in chats collection
        console.log("Creating chat in chats collection");
        await setDoc(doc(db, "chats", combinedId), {messages: []});


        //create user chats
        
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"] :{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL, 
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"] :{
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL, 
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        
      }
    }
    catch(err){
      setErr(true);
      console.log(err);
    }


    // create user chats
    setUser(null);
    setUsername('');
  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='find a friend' value={username} onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)}/>
      </div>

      {/* {err && <span className='err'>User not found!</span>} */}
      {user && <div className='userChat' onClick={handleSelect}>
        <img src={user.photoURL} alt="" />

        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>

      </div>}
    </div>
  )
}

export default Search
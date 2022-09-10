import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { IoIosVideocam, IoMdCall, IoMdMore } from 'react-icons/io'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className='chat'>
      <div className="chatInfo">
        <div className="chatInfo__left">
          <img src={data.user?.photoURL} alt="" />
          <span>{data.user?.displayName}</span>
        </div>
        <div className="chatIcons">
          <IoIosVideocam />
          <IoMdCall />
          <IoMdMore />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
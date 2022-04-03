import "./Room.scss";
import { useEffect, useState, useRef } from "react";
import ChatMessage from "./ChatMessage";
import VideoScreen from "./VideoScreen";
import { useSelector, useDispatch } from "react-redux";
import { setUser, resetUser } from "../../features/userSlice";
import { useParams } from "react-router";
import {
  sendMessage,
  receiveMessage,
  receiveNotification,
} from "../../features/messageSlice";
import { socket } from "../../common/socket";

import React from "react";

const MessageWindow = ({ messages }) => {
  const scroller = useRef(null);

  const scrollToBottom = () => {
    messages.length && scroller.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-window">
      {messages &&
        messages.map((msg, id) => {
          return (
            <>
              <ChatMessage
                key={id}
                type={msg.type}
                time={msg.time || null}
                user={msg.user || null}
                message={msg.message}
                received={msg.received || null}
              />
              <div className="scroller-div" ref={scroller} />
            </>
          );
        })}
    </div>
  );
};

const Room = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const messages = useSelector((state) => state.messages);
  const [chatView, setChatView] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const user = useSelector((state) => state.user);

  const handleMessageSubmit = () => {
    if (!currentMessage.length) return;

    console.log(currentMessage.length, " => ", currentMessage);
    const message = {
      user: user.name,
      message: currentMessage,
    };

    dispatch(sendMessage(message));
    setCurrentMessage(() => "");
  };
  const handleUserNameChange = (data) => {
    setUserName(() => data.trim());
  };
  const handleUserNameSubmit = () => {
    dispatch(setUser({ name: userName, room: params.roomid }));
  };
  const handleOnTyping = (data) => {
    setCurrentMessage(() => data);
  };
  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      handleMessageSubmit();
    }
  };

  const socketListener = () => {
    socket.on("message:toClient", (data) => {
      dispatch(receiveMessage(data));
    });
    socket.on("notification:toClient", (data) => {
      console.log("test");
      dispatch(receiveNotification(data));
    });

    socket.on("roomData:toClient", (data) => {
      setTotalUsers(() => data.totalUsers);
    });

    socket.on("kick", () => {
      dispatch(resetUser());
    });
  };

  useEffect(() => {
    socketListener();
    return () => dispatch(resetUser());
  }, []);

  return (
    <div className="room-container">
      <div className="video-wrapper">
      {user.name ? (<VideoScreen />) : null}
      </div>

      <div className="chat-wrapper">
        {user.name ? (
          <div className="chat-tabs">
            <button
              className={`chat-panel-button ${
                chatView ? "active" : null
              }`.trim()}
              onClick={() => {
                setChatView(true);
              }}
            >
              Chat
            </button>
            <button
              className={`chat-settings-button ${
                !chatView ? "active" : null
              }`.trim()}
              onClick={() => {
                setChatView(false);
              }}
            >
              Settings
            </button>
          </div>
        ) : null}
        {user.name ? (
          chatView ? (
            <div className="chat-box">
              <div className="chat-window-wrapper">
                <MessageWindow messages={messages} />
              </div>

              <div className="chat-panel-wrapper">
                <div className="chat-panel">
                  <div className="chat-input-wrapper">
                    <div className="chat-input">
                      <textarea
                        autoComplete="on"
                        autoCorrect="off"
                        spellCheck="false"
                        rows="1"
                        name=""
                        id=""
                        placeholder="Type a message..."
                        value={currentMessage}
                        onChange={(e) => handleOnTyping(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    <div className="chat-send-button">
                      <button
                        disabled={!currentMessage}
                        onClick={handleMessageSubmit}
                      >
                        send
                      </button>
                    </div>
                  </div>

                  <div className="chat-buttons">
                    <div className="chat-emoji-button-wrapper">
                      {/* <button className="chat-emoji-button"></button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat-settings">
              <div className="chat-share-container">
                <h1 className="chat-share-heading">Send invite</h1>
                <span className="chat-share-subheading">
                  Use this link to invite others and watch together. They can
                  join cine nights on their computer.
                </span>

                <div className="chat-share-link">
                  <div className="chat-share-link-title">Link:</div>
                  <div className="chat-share-link-url">
                    {window.location.href}
                  </div>
                </div>

                <div className="chat-share-button-wrapper">
                  <button
                    className="chat-share-button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.href}`);
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="chat-details-container">
                <span className="chat-details">Details</span>
                <div className="chat-people">Users: {totalUsers}</div>
                <div className="chat-end-button-wrapper">
                  {/* <button className="chat-end-button">End Watch Party</button> */}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="chat-login">
            <div className="login-info">
              <div className="login-heading">Let’s get the party started</div>
              <div className="login-subheading">
                Watch and chat with your friends and family.
              </div>
            </div>
            <div className="login-input">
              <div className="login-user-name">
                <span>Chat name:</span>
              </div>
              <div className="login-user-name-input">
                <input
                  value={userName}
                  type="text"
                  placeholder="Enter Name"
                  onChange={(e) => handleUserNameChange(e.target.value)}
                />
              </div>
              <div className="login-button">
                <button onClick={handleUserNameSubmit}>Join Watch Party</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;

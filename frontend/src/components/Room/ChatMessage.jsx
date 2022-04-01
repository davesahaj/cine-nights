import moment from "moment";
import "./ChatMessage.scss";
const ChatMessage = (props) => {
  return props.type === "message" ? (
    <div
      className={`message-wrapper ${props.received ? "received" : null}`.trim()}
    >
      {props.received ? (
        <div className="message-info-wrapper">
          <span className="message-username">{props.user}</span>
          {" • "}
          <span className="message-time">
            {moment(props.time).local().fromNow()}
          </span>
        </div>
      ) : null}

      <div className="message-text">{props.message}</div>
    </div>
  ) : (
    <div className="notification-wrapper">
      <p className="notification-body">
        <span className="notification-text">{props.message}</span>
      </p>
    </div>
  );
};

export default ChatMessage;

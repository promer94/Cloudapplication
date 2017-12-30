import React from "react";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import TypeWindow from "./TypeWindow";

function ChatWindow(props) {
  return (
    <div id="chat window container" className="Paper-background">
      <Paper />
      <Divider />
      <TypeWindow />
    </div>
  );
}

export default ChatWindow;

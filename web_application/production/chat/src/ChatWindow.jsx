//React config
import React from "react";

//Material UI components
import Divider from "material-ui/Divider";
import Input, { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import Send from "material-ui-icons/Send";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";

//Npm react-custom-scrollbars component
import { Scrollbars } from "react-custom-scrollbars";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%"
  },
  input: {
    marginLeft: theme.spacing.unit - 20,
    marginRight: theme.spacing.unit - 20,
    width: 100
  },
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    width: 120
  })
});

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyMessages: [],
      newMessages: [],
      inputmassage: ""
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.textChangeHandler = this.textChangeHandler.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      //Remove previous listener
      const currentChannel = this.props.currentChannel;
      currentChannel.removeAllListeners();
      //Get history of another channel and set up a new listener.
      let newMessages = [];
      const newChannel = nextProps.currentChannel;
      const setState = this.setState.bind(this);

      let scrollToBottom = this.scrollToBottom.bind(this); //Auto scrollToBottom *******
      newChannel.getMessages().then(function(messages) {

        setState({ newMessages:[]});  //Clear History input *******
        setState({ historyMessages: messages.items });
        scrollToBottom();
      });
      newChannel.on("messageAdded", function(message) {

        newMessages = newMessages.concat(message);
        setState({ newMessages: newMessages });
        scrollToBottom();
      });
    }
  }

  componentDidMount() {
    const currentChannel = this.props.currentChannel;
    let newMessages = [];
    const setState = this.setState.bind(this);
    let scrollToBottom = this.scrollToBottom.bind(this);
    currentChannel.getMessages().then(function(messages) {
        console.log('didMount');
        console.log(messages.items)
      setState({ historyMessages: messages.items });
      scrollToBottom();
    });
    currentChannel.on("messageAdded", function(message) {
      console.log('didMount');
      console.log(message)
      newMessages = newMessages.concat(message);
      setState({ newMessages: newMessages });
      scrollToBottom();
    });
  }

  componentWillUnmount() {
    //Remove the listener in case of memory leak;
    const currentChannel = this.props.currentChannel;
    currentChannel.removeListener("messageAdded");
  }

  scrollToBottom() {
    this.scrollbar.scrollToBottom();
  }

  submitHandler(event) {
    // Stop the form from refreshing the page on submit
    const channel = this.props.currentChannel;
    channel.sendMessage(this.state.inputmassage);
    this.setState({ inputmassage: "" });
    this.scrollToBottom();
    event.preventDefault();
  }

  textChangeHandler(event) {
    this.setState({ inputmassage: event.target.value });
  }

  render() {
    const classes = this.props;
    const currentChannel = this.props.currentChannel;
    const currentUser = this.props.currentUser;
    if (currentChannel) {
      return (
        <div id="chat window">
          <Divider />
          <Scrollbars
            style={{ width: "100%", height: 650 }}
            ref={Scrollbars => {
              this.scrollbar = Scrollbars;
            }}
          >
            <div id="historymessages">
              {this.state.historyMessages.map(data => {
                if (data.author === currentUser) {
                  return (
                    <div>
                      <Typography align="right" color="primary" type="display2">
                        {data.body}
                      </Typography>
                      <Typography align="right" color="primary" type="caption">
                        {data.timestamp.toLocaleString()}
                      </Typography>
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <Typography
                        align="left"
                        color="sceondary"
                        type="display2"
                      >
                        {data.body}
                      </Typography>
                      <Typography align="left" color="sceondary" type="caption">
                        {data.timestamp.toLocaleString()}
                      </Typography>
                    </div>
                  );
                }
              })}
            </div>
            <div id="newmessage">
              {this.state.newMessages.map(data => {
                if (data.author === currentUser) {
                  return (
                    <div>
                      <Typography align="right" color="primary" type="display2">
                        {data.body}
                      </Typography>
                      <Typography align="right" color="primary" type="caption">
                        {data.timestamp.toLocaleString()}
                      </Typography>
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <Typography
                        align="left"
                        color="sceondary"
                        type="display2"
                      >
                        {data.body}
                      </Typography>
                      <Typography align="left" color="sceondary" type="caption">
                        {data.timestamp.toLocaleString()}
                      </Typography>
                    </div>
                  );
                }
              })}
            </div>
            <Divider />
          </Scrollbars>
          <div id="typewindow">
            <form
              id="type window form"
              className="chat-input"
              onSubmit={this.submitHandler}
            >
              <div id="type window container" className={classes.container}>
                <InputLabel htmlFor="chat-input" />
                <Input
                  multiline={true}
                  className={classes.input}
                  onChange={this.textChangeHandler}
                  value={this.state.inputmassage}
                  id="chat-input"
                  placeholder="Write a message..."
                  required
                />
                <Button color="primary" type="submit">
                  <Send />
                </Button>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <Typography align="right" color="Error" type="caption">
          Select or create a channle to start;
        </Typography>
      );
    }
  }
}
export default withStyles(styles)(ChatWindow);

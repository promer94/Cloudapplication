import React from "react";
import Chip from "material-ui/Chip";
import { withStyles } from "material-ui/styles";
import Avatar from "material-ui/Avatar";
import FaceIcon from "material-ui-icons/Face";
import red from "material-ui/colors/red";
import Chat from "twilio-chat";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import Input from "material-ui/Input";
import Divider from "material-ui/Divider";
import List from "material-ui/List/List";

const axios = require("axios");
const styles = theme => ({
  chip: {
    margin: theme.spacing.unit
  },
  svgIcon: {
    color: red[200]
  },
  row: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  button: {
    margin: theme.spacing.unit - 5,
    width: "40%"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: 240
  },
  input: {
    marginLeft: theme.spacing.unit - 20,
    marginRight: theme.spacing.unit - 20,
    width: 100
  }
});
class ChannelManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contectList: [],
      isListReady: false,
      error: null,
      chatClient: "",
      channelFriendlyName: ""
    };
    this.loadContectList = this.loadContectList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //TODO:Add listener for update channel list
  componentDidMount() {
    this.loadContectList();
    const updateContectList = this.loadContectList.bind(this);
    axios
      .get("/token")
      .then(response => {
        if (!response.data.token) {
          console.log(response);
        } else {
          let twilioToken = response.data.token;
          let chatClient = new Chat(twilioToken);
          chatClient.on('channelAdded', function(channel) {
            console.log('Channel added: ' + channel.friendlyName);
            updateContectList();
          });
          // A channel is no longer visible to the Client
          chatClient.on('channelRemoved', function(channel) {
            console.log('Channel removed: ' + channel.friendlyName);
            updateContectList();
          });
        }
      })
      .catch(function(error) {
        console.log(error)
      });
  }

  //TODO: Remove listener
  componentWillUnmount() {
    let chatClient = this.state.chatClient;
    chatClient.removeListener("channelAdded");
    console.log("listener removed")
    chatClient.removeListener("channelRemoved");
    console.log("listener removed")
  }

  //TODO: Load contect list from twilio list
  loadContectList() {
    const setState = this.setState.bind(this);
    axios
      .get("/token")
      .then(response => {
        if (!response.data.token) {
          console.log(response);
        } else {
          let twilioToken = response.data.token;
          let chatClient = new Chat(twilioToken);
          chatClient.getSubscribedChannels().then(function(paginator) {
            let contectList = paginator.items.map(data => {
              return data;
            });

            setState({ contectList });
            setState({ isListReady: true });
            setState({ chatClient });
          });
        }
      })
      .catch(function(error) {
        setState({ error });
      });
  }
  //TODO:
  //Delete channels
  handleDelete = data => () => {
    const contectList = [...this.state.contectList];
    const contectToDelete = contectList.indexOf(data);
    contectList[contectToDelete].delete().then(function(channel) {
      console.log("Deleted channel: " + channel.uniqueName);
    });
    //contectList.splice(contectToDelete, 1);
    //this.setState({ contectList });
  };

  //TODO:Swich between channels
  handleClick = data => () => {
    const changeChannel = this.props.changeChannel;
    const contectList = [...this.state.contectList];
    const channelToJoin = contectList.indexOf(data);
    changeChannel(contectList[channelToJoin]);
    console.log("joined channel: " + contectList[channelToJoin].uniqueName);
  };

  //TODO:Form action for creating a new Channel
  handleChange(e) {
    this.setState({ channelFriendlyName: e.target.value });
  }

  handleSubmit(e) {
    const chatClient = this.state.chatClient;
    const props = this.props;
    try {
      chatClient
        .createChannel({
          uniqueName: "Private channel with " + this.state.channelFriendlyName,
          friendlyName: this.state.channelFriendlyName,
          isPrivate: true
        })
        .then(function(channel) {
          channel.join().catch(function(err) {
            console.error(
              "Couldn't join channel " +
                channel.friendlyName +
                " because " +
                err
            );
          });
          props.changeChannel(channel);
        });
    } catch (err) {
      console.log(err.message);
    }
    e.preventDefault();
  }

  render() {
    const classes = this.props;
    const { error, isListReady, contectList } = this.state;
    if (error) {
      return (
        <div id="error happens">
          <Typography>Error: {error.message}</Typography>
        </div>
      );
    } else if (!isListReady) {
      return (
        <div id="loding">
          <Typography>Loading...</Typography>
        </div>
      );
    } else {
      return (
        <div id="ChannelManager">
          <div id="form for channel creator">
            <form onSubmit={this.handleSubmit}>
              <Input
                className={classes.input}
                id="Create a channel"
                onChange={this.handleChange}
                placeholder="Enter a name for channel "
              />
              <Button
                fab
                mini
                dense
                color="accent"
                aria-label="add"
                className={classes.button}
                type="submit"
              >
                <Icon color="contrast">add_circle</Icon>
              </Button>
            </form>
            <Divider />
          </div>
          <div id="contect list">
            <List>
              <div id="contects" className={classes.row}>
                {contectList.map(data => {
                  return (
                    <Chip
                      avatar={
                        <Avatar>
                          <FaceIcon className={classes.svgIcon} />
                        </Avatar>
                      }
                      label={data.uniqueName}
                      key={data.sid}
                      onDelete={this.handleDelete(data)}
                      onClick={this.handleClick(data)}
                      className={classes.chip}
                    />
                  );
                })}
              </div>
            </List>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(ChannelManager);

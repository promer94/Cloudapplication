//Source A
//React config
import React from "react";

//Material UI components
import Chip from "material-ui/Chip";
import { withStyles } from "material-ui/styles";
import Avatar from "material-ui/Avatar";
import FaceIcon from "material-ui-icons/Face";
import red from "material-ui/colors/red";
import Chat from "twilio-chat";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import Input, { InputLabel } from "material-ui/Input";
import Divider from "material-ui/Divider";
import List from "material-ui/List/List";
import { CircularProgress } from "material-ui/Progress";
import purple from "material-ui/colors/purple";
import Snackbar from "material-ui/Snackbar";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";

//AJAX library
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
  },
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`
  },
  close: {
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10
  }
});
class ChannelManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contectList: [],
      invitationList: [],
      currentChannel: "",
      isContectListReady: false,
      isInvitationListReady: false,
      isChannelReady: false,
      invitationSnackBarOpen: false,
      snackInvitationmessage: "",
      invitateSnackBarOpen: false,
      snakeInvitatemessage: "",
      error: null,
      chatClient: "",
      newChannlename: "",
      emailAdress: ""
    };
    this.loadContectList = this.loadContectList.bind(this);
    this.hadnleNewChannleChange = this.hadnleNewChannleChange.bind(this);
    this.handleNewChannleSubmit = this.handleNewChannleSubmit.bind(this);
    this.handleInvitaionChange = this.handleInvitaionChange.bind(this);
    this.handleInvitationSubmit = this.handleInvitationSubmit.bind(this);
  }

  //TODO:Add listener for update channel list
  componentDidMount() {
    this.loadContectList();
    const updateContectList = this.loadContectList.bind(this);
    const setState = this.setState.bind(this);
    axios
      .get("/token")
      .then(response => {
        if (!response.data.token) {
          console.log(response);
        } else {
          console.log(response.data.token);
          let twilioToken = response.data.token;
          let chatClient = new Chat(twilioToken);
          chatClient.on("channelAdded", function(channel) {
            setState({ isContectListReady: false });
            updateContectList();
          });
          chatClient.on("channelRemoved", function(channel) {
            setState({ isContectListReady: false });
            updateContectList();
          });
          chatClient.on("channelInvited", function(channel) {
            let message = "Invited to channel " + channel.friendlyName;
            setState({ snackInvitationmessage: message });
            setState({ invitationSnackBarOpen: true });
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //TODO: Remove listener
  componentWillUnmount() {
    let chatClient = this.state.chatClient;
    console.log(chatClient);
    chatClient.removeAllListeners();
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
            setState({ contectList: contectList });
            setState({ chatClient: chatClient });
            setState({ isContectListReady: true });
          });
        }
      })
      .catch(function(error) {
        setState({ error: error });
      });
  }
  //TODO:
  //Delete channels
  handleChannelDelete = data => () => {
    const contectList = [...this.state.contectList];
    const contectToDelete = contectList.indexOf(data);
    contectList[contectToDelete].delete().then(function(channel) {});
    //contectList.splice(contectToDelete, 1);
    //this.setState({ contectList });
  };

  //TODO:Swich between channels
  handleChannelSwitch = data => () => {
    const changeChannel = this.props.changeChannel;
    const contectList = [...this.state.contectList];
    const channelToJoin = contectList.indexOf(data);
    changeChannel(contectList[channelToJoin]);
    contectList[channelToJoin].join().catch(function(err) {
      console.log("switch channel error catched");
      console.log(err);
    });

    this.setState({ currentChannel: contectList[channelToJoin] });
    this.setState({ isChannelReady: true });
  };

  //TODO:
  //Delete channels

  /*  acceptInvitation = data => () => {
    const changeChannel = this.props.changeChannel;
    const invitationList = [...this.state.invitationList];
    const invitationToAccept = invitationList.indexOf(data);
    changeChannel(invitationList[invitationToAccept]);
    invitationList[invitationToAccept].join();
    this.setState({ currentChannel: invitationList[invitationToAccept] });
    console.log(
      "joined channel: " + invitationList[invitationToAccept].uniqueName
    );
    invitationList.splice(invitationToAccept,1);
  };
*/

  /*  deleteInvitaion = data => () => {
    const invitationList = [...this.state.invitationList];
    const invitationToDelete = invitationList.indexOf(data);
    invitationList.splice(invitationToDelete, 1);
    this.setState({ invitationList:invitationList});
  };
*/
  //TODO:Form action for creating a new Channel
  hadnleNewChannleChange(e) {
    this.setState({ newChannlename: e.target.value });
  }

  handleNewChannleSubmit(e) {
    const chatClient = this.state.chatClient;
    const props = this.props;
    const setState = this.setState.bind(this);
    try {
      chatClient
        .createChannel({
          uniqueName: "Private channel called" + this.state.newChannlename,
          friendlyName: this.state.newChannlename,
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
          setState({ currentChannel: channel });
          setState({ isChannelReady: true });
        });
    } catch (err) {
      console.log(err.message);
    }
    this.setState({ newChannlename: "" });
    e.preventDefault();
  }
  //TODO: Create invitaions
  handleInvitaionChange(e) {
    this.setState({ emailAdress: e.target.value });
  }

  handleInvitationSubmit(e) {
    const currentChannel = this.state.currentChannel;
    const setState = this.setState.bind(this);
    currentChannel.invite(this.state.emailAdress).then(function() {
      let message =
        "Your friend has been invited to " + currentChannel.friendlyName;
      setState({ snakeInvitatemessage: message });
      setState({ invitateSnackBarOpen: true });
    });
    this.setState({ emailAdress: "" });
    e.preventDefault();
  }

  handleInvitationSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ invitationSnackBarOpen: false });
  };

  handleInviteSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ invitateSnackBarOpen: false });
  };

  render() {
    const classes = this.props;
    const {
      error,
      isContectListReady,
      //   isLocked,
      contectList,
      isChannelReady
    } = this.state;
    // console.log("ChannelManager isLocked value is " + isLocked);
    const isLocked = this.props.isLocked;
    if (error) {
      return (
        <div id="error happens">
          <Typography>Error: {error.message}</Typography>
        </div>
      );
    } else if (!isContectListReady) {
      return (
        <div id="loding">
          <CircularProgress
            className={classes.progress}
            style={{ color: purple[500] }}
            thickness={7}
          />
        </div>
      );
    } else {
      return (
        <div>
          {isLocked ? (
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
                        label={data.friendlyName}
                        key={data.sid}
                        onDelete={this.handleChannelDelete(data)}
                        onClick={this.handleChannelSwitch(data)}
                        className={classes.chip}
                      />
                    );
                  })}
                </div>
              </List>
            </div>
          ) : (
            <div id="ChannelManager">
              <div id="form for channel creator">
                <form onSubmit={this.handleNewChannleSubmit}>
                  <Input
                    className={classes.input}
                    id="Create a channel"
                    onChange={this.hadnleNewChannleChange}
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
                <Typography
                  type="body1"
                  color="default"
                  children="Contects"
                  noWrap
                />
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  open={this.state.invitationSnackBarOpen}
                  autoHideDuration={3000}
                  onClose={this.handleInvitationSnack}
                  message={this.state.snackInvitationmessage}
                  action={[
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleInvitationSnack}
                    >
                      <CloseIcon />
                    </IconButton>
                  ]}
                />
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
                          label={data.friendlyName}
                          key={data.sid}
                          onDelete={this.handleChannelDelete(data)}
                          onClick={this.handleChannelSwitch(data)}
                          className={classes.chip}
                        />
                      );
                    })}
                  </div>
                </List>
              </div>
              <Divider />
              <div id="invitation list" />
              <div id="invitation form">
                <div>
                  {isChannelReady ? (
                    <form
                      id="invitation creator form"
                      onSubmit={this.handleInvitationSubmit}
                    >
                      <div
                        id="invitation creator container"
                        className={classes.container}
                      >
                        <Snackbar
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left"
                          }}
                          open={this.state.invitateSnackBarOpen}
                          autoHideDuration={3000}
                          onClose={this.handleInviteSnack}
                          message={this.state.snakeInvitatemessage}
                          action={[
                            <IconButton
                              key="close"
                              aria-label="Close"
                              color="inherit"
                              className={classes.close}
                              onClick={this.handleInviteSnack}
                            >
                              <CloseIcon />
                            </IconButton>
                          ]}
                        />
                        <InputLabel htmlFor="AddFriend">
                          <Typography
                            type="body1"
                            color="default"
                            children="Add your friends here"
                            noWrap
                          />
                        </InputLabel>
                        <Input
                          className={classes.input}
                          id="AddFriend"
                          onChange={this.handleInvitaionChange}
                          placeholder="Enter your friends email"
                          value={this.state.emailAdress}
                        />
                        <Button
                          fab
                          mini
                          color="accent"
                          aria-label="add"
                          className={classes.button}
                          type="submit"
                        >
                          <Icon color="defalut">add_circle</Icon>
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

export default withStyles(styles)(ChannelManager);

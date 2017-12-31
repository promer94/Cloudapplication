import "./HomePage.css";
import "./BackgroudImage.css";
import logo from "./logo.svg";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import List from "material-ui/List";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import Button from "material-ui/Button";
import PersonInfoAvatars from "./PersonInfoAvatars";
//import ChannelCreator from "./ChannelCreator";
import Chatwindow from "./ChatWindow";
//import ContectList from "./ContectList";
import Chat from "twilio-chat";
import ChannelManager from "./ChannelManager";


const axios = require("axios");

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: "100%",
    height: 900,
    overflow: "hidden"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%",
    color: "primary"
  },
  appBar: {
    position: "absolute",
    width: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: "#ECEFF1"
  },
  button: {
    position: "relative",
    margin: theme.spacing.unit,
    left: `calc(100% - ${drawerWidth}px)`
  },
  drawerPaper: {
    position: "relative",
    height: "100%",
    width: drawerWidth,
    backgroundColor: "#ECEFF1"
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    padding: theme.spacing.unit * 3,
    height: "calc(100%)",
    marginTop: 56,
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% )",
      marginTop: 64
    }
  },
  row: {
    display: "flex",
    justifyContent: "center"
  }
});

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      isChatSetUp: false,
      isFirstLogin: false,
      isLocked: false,
      currentUserName: "",
      currentUserEmail: "",
      currentUserPicture: "",
      currentChatClient: "",
      currentChannel: "",
      currentChannelName: "",
      twilioIdentity: "",
      twilioToken: "",
      contectList:[],
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.changeChannel = this.changeChannel.bind(this);
  }

  componentDidMount() {
    //Get userinfo from our python backend
    axios
      .get("/userinfo")
      .then(response => {
        if (!response.data.user_status) {
          console.log(response);
        } else {
          let currentUserName = response.data.user_name;
          let currentUserEmail = response.data.user_email;
          let currentUserPicture = response.data.user_picture;
          let currentUserStatus = response.data.user_status;
          let isFirstLogin = response.data.user_isFirsttime;
          this.setState({ isLogin: currentUserStatus });
          this.setState({ isFirstLogin: isFirstLogin });
          this.setState({ currentUserName });
          this.setState({ currentUserEmail });
          this.setState({ currentUserPicture });
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    //Get twilio Token from our python backend
    axios
      .get("/token")
      .then(response => {
        if (!response.data.token) {

        } else {
          let twilioIdentity = response.data.identity;
          let twilioToken = response.data.token;
          let chatClient = new Chat(twilioToken);
          this.setState({ twilioIdentity });
          this.setState({ twilioToken });
          this.setState({ currentChatClient: chatClient });
          this.setState({ isChatSetUp: true });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  login() {
    //Redirect to google
    window.location.href = "http://127.0.0.1:5000/login";
  }

  logout() {
    //Tell backend to clear all the session.
    window.location.href = "http://127.0.0.1:5000/logout";
    this.setState({ isChatSetUp: false });
  }

  //This function will be passed to ChannelCreator and ContectList.
  changeChannel(channel) {
    this.setState({ currentChannel: channel });
    this.setState({ currentChannelName: channel.friendlyName });
  }

  render() {
    const { classes } = this.props;
    const isLogin = this.state.isLogin;
    const isChatSetUp = this.state.isChatSetUp;
    const isFirstLogin = this.state.isFirstLogin;
    const isLocked = this.state.isLocked;
    const currentChannelName =
      "Chating service is running ! Your are currently in " +
      this.state.currentChannelName;
    const drawer = (
      <Drawer
        type="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div
          id="person info container"
          className={classes.drawerHeader}
          children={
            <div className={classes.row} id="person info display after login">
              {isLogin ? (
                <PersonInfoAvatars
                  name={this.state.currentUserName}
                  email={this.state.currentUserEmail}
                  picture={this.state.currentUserPicture}
                />
              ) : (
                <img src={logo} className="App-logo" alt="logo" />
              )}
            </div>
          }
        />
        <Divider />
        <div id="Contects container">
          {isLogin ? (
            //Contect List
            <div id="contects list title">
              <Typography
                type="title"
                color="default"
                children="Contect List"
                noWrap
              />
              <Divider />
              <ChannelManager changeChannel ={this.changeChannel}/>
            </div>
          ) : (
            <div id="loading list" />
          )}
        </div>

        <Divider />
        <div id="invitation container">
          {isLocked ? (
            //Invitation List
            <div id="invitation hide for lock mode" />
          ) : (
            <div id="invitation list">
              <Typography
                type="title"
                color="default"
                children="Invitation List"
                noWrap
              />
              <List />
            </div>
          )}
        </div>
        <Divider />
        <div id="invitaion creator container">
          {isLocked ? (
            <div id="locked invitation creator" />
          ) : (
            <div id="invitation creator">
              <h3>addfriendshere</h3>
            </div>
          )}
        </div>
      </Drawer>
    );

    return (
      <div id="home page container">
        <div id="root" className={classes.root}>
          <div id="appFrame" className={classes.appFrame}>
            <AppBar className={classNames(classes.appBar)}>
              {isLogin ? (
                <Toolbar>
                  <Typography type="title" color="default" noWrap>
                    Welcome Back!
                  </Typography>
                  <Button
                    className={classNames(classes.button)}
                    color="default"
                    onClick={this.logout}
                  >
                    Logout
                  </Button>
                </Toolbar>
              ) : (
                <Toolbar>
                  <Typography type="title" color="default" noWrap>
                    Designed for kids
                  </Typography>
                  <Button
                    className={classNames(classes.button)}
                    color="default"
                    onClick={this.login}
                  >
                    Login
                  </Button>
                </Toolbar>
              )}
            </AppBar>
            {drawer}
            <main className={classNames(classes.content, "background")}>
              <div id="chat window">
                {isLogin ? (
                  <div id="display window">
                    {isChatSetUp ? (
                      <div id="twilio service running ">
                        <Typography type="title" color="default" noWrap>
                          {currentChannelName}
                        </Typography>
                        <Chatwindow client={this.state.chatClient} />
                      </div>
                    ) : (
                      <Typography type="title" color="default" noWrap>
                        Chat service disconnected -.-
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div id="no login no window" />
                )}
              </div>
            </main>
          </div>
        </div>
        )
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomePage);

import React from "react";
import Chip from "material-ui/Chip";
import { withStyles } from "material-ui/styles";
import Avatar from "material-ui/Avatar";
import FaceIcon from "material-ui-icons/Face";
import red from "material-ui/colors/red";
import Chat from "twilio-chat";
import Typography from "material-ui/Typography";


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
  }
});
class ContectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contectList: [],
      isListReady:false,
      error:null,
      chatClient:""
    };
    this.loadCotectList = this.loadCotectList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
 
    
  }

 loadCotectList(){
    const setState = this.setState.bind(this);
    const state  = this.state;
    axios.get("/token").then(response => {
      if (!response.data.token) {
      console.log(response);
      } else {
          let twilioToken = response.data.token;
          let chatClient = new Chat(twilioToken);
          chatClient.getSubscribedChannels().then(function(paginator){
          let contectList = paginator.items.map(data=>{return data})
          console.log(contectList);
          setState({contectList});
          setState({isListReady:true})
          setState({chatClient})
          console.log(state);
          });         
        }
    }).catch(function(error) {
      setState({error})
      console.log(state);
   });
  };

  handleDelete = data => () => {
    const contectList = [...this.state.contectList];
    const contectToDelete = contectList.indexOf(data);
    contectList[contectToDelete].delete().then(function(channel) {
      console.log('Deleted channel: ' + channel.uniqueName);
    })
    contectList.splice(contectToDelete, 1);
    this.setState({ contectList });
  };

  handleClick = data => () =>{
    const changeChannel = this.props.changeChannel;
    const contectList = [...this.state.contectList];
    const channelToJoin = contectList.indexOf(data);
    changeChannel(contectList[channelToJoin]);
    console.log('joined channel: ' + contectList[channelToJoin].uniqueName);
  } 

  render() {
    const classes = this.props;
    const {error, isListReady, contectList} = this.state;
    console.log("render page.");
    if(error){
      return <div id ="error happens"><Typography>Error: {error.message}</Typography></div>
    } else if(!isListReady){
      return <div id = 'loding'><Typography>Loading...</Typography></div>
    } else{
    return (
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
              onClick ={this.handleClick(data)}
              className={classes.chip}
            />
          );
        })}
      </div>
    );
    }
  }
}

export default withStyles(styles)(ContectList);

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import Input from "material-ui/Input";
import Divider from "material-ui/Divider";
import Chat from "twilio-chat";
const styles = theme => ({
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

class ChannelCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { channelFriendlyName: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ channelFriendlyName: e.target.value });
  }

  handleSubmit(e) {
    const chatClient = new Chat(this.props.token);
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
    return (
      <div id="form for channel creator">
        <Divider />
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
            width={50}
          >
            <Icon color="contrast">add_circle</Icon>
          </Button>
        </form>
      </div>
    );
  }
}

ChannelCreator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ChannelCreator);

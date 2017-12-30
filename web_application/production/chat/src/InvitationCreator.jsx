import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import Input, { InputLabel } from "material-ui/Input";
import { blue } from "material-ui/colors";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit - 5,
    backgroundColor: blue[50]
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: 240
  },
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 120
  }
});

class InvitationCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { emailAdress: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ emailAdress: e.target.value });
  }

  handleSubmit(e) {
    const currentChannel = this.props.currentChannel;
    currentChannel.invite(this.state.emailAdress).then(function() {
      console.log(
        "Your friend has been invited to " + currentChannel.friendlyName
      );
    });
    e.preventDefault();
  }

  render() {
    const classes = this.props;
    return (
      <form id="invitation creator form" onSubmit={this.handleSubmit}>
        <div id="invitation creator container" className={classes.container}>
          <InputLabel htmlFor="AddFriend">
            {" "}
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
            onChange={this.handleChange}
            placeholder="Enter your friends email"
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
    );
  }
}

InvitationCreator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvitationCreator);

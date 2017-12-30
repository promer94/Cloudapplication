import React from "react";
import PropTypes from "prop-types";
import Input, { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import Send from "material-ui-icons/Send";

class TypeWindow extends React.Component {
  constructor(props) {
    super(props);
    // Set initial state of the chatInput so that it is not undefined
    this.state = { chatInput: "" };

    // Bind 'this' to event handlers by default
    this.submitHandler = this.submitHandler.bind(this);
    this.textChangeHandler = this.textChangeHandler.bind(this);
  }

  submitHandler(event) {
    // Stop the form from refreshing the page on submit
    console.log(this.state);
    event.preventDefault();

    // Call the onSend callback with the chatInput message
    //this.props.onSend(this.state.chatInput);
    // Clear the input box
    this.setState({ chatInput: "" });
  }

  textChangeHandler(event) {
    this.setState({ chatInput: event.target.value });
  }

  render() {
    const classes = this.props;
    return (
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
            value={this.state.chatInput}
            id="chat-input"
            placeholder="Write a message..."
            required
          />
          <Button color="primary" type="submit">
            <Send />
          </Button>
        </div>
      </form>
    );
  }
}

TypeWindow.defaultProps = {
  classes: PropTypes.object.isRequired
};

export default TypeWindow;

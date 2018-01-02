import React, { Component } from "react";
import "./LockButton.css";
import Button from "material-ui/Button";
// import Input from "react-validation/build/input";

const axios = require("axios");

class LockButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLocked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.validatePin = this.validatePin.bind(this);
  }

  handleClick() {
    let isLocked = !this.state.isLocked;
    if (isLocked) {
      this.setState({ isLocked });
      this.props.changeStatus(this.state.isLocked);
    } else {
      if (this.validatePin()) {
        this.setState({ isLocked });
        this.props.changeStatus(this.state.isLocked);
      }
    }
  }

  validatePin() {
    const inputPin = document.getElementById("PIN").value;
    console.log("InputPin is " + inputPin);
    axios
      .get("/pin")
      .then(response => {
        if (!response.data.pin) {
          console.log(response);
        } else {
          const correctPin = response.data.pin;
          if (inputPin === correctPin) {
            return true;
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    return false;
  }

  render() {
    const isLocked = this.state.isLocked;

    return isLocked ? (
      <div>
        <Button type="submit" className="locked" onClick={this.handleClick} />
        <input type="password" id="PIN" placeholder="PIN" maxlength="4" />
      </div>
    ) : (
      <div>
        <Button type="submit" className="unlocked" onClick={this.handleClick} />
      </div>
    );
  }
}

export default LockButton;

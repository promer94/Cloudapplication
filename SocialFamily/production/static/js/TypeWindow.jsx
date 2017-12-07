import React from 'react';

class TypeWindow extends React.Component {

	constructor(props) {
		super(props);
		// Set initial state of the chatInput so that it is not undefined
		this.state = { chatInput: '' };

		// Bind 'this' to event handlers by default
		this.submitHandler = this.submitHandler.bind(this);
		this.textChangeHandler = this.textChangeHandler.bind(this);
	}

	submitHandler(event) {
		// Stop the form from refreshing the page on submit
		event.preventDefault();

		// Call the onSend callback with the chatInput message
		this.props.onSend(this.state.chatInput);

		// Clear the input box
		this.setState({ chatInput: '' });
	}

	textChangeHandler(event) {
		this.setState({ chatInput: event.target.value });
	}

	render() {
		return (
			<form className="chat-input" onSubmit={this.submitHandler}>
				<input type="text"
					onChange={this.textChangeHandler}
					value={this.state.chatInput}
					placeholder="Write a message..."
					required />
			</form>
		);
	}

}

TypeWindow.defaultProps = {
};

export default TypeWindow;
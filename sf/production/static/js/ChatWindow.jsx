require('../css/ChatWindow.css');

import React from 'react';
// import io from 'socket.io-client';				// <------ js server part

import TypeWindow from './TypeWindow';
import Messages from './Messages';

class ChatWindow extends React.Component {

	// socket = {};

	constructor(props) {
		super(props);
		this.state = { messages: [] };
		this.sendHandler = this.sendHandler.bind(this);

		// Connect to the server
		// this.socket = io(config.api, { query: `username=${props.username}` }).connect();

		// Listen for messages from the server
		// this.socket.on('server:message', message => {
		// 	this.addMessage(message);
		// });
	}

	sendHandler(message) {
		const messageObject = {
			username: this.props.username,
			message
		};

		// Emit the message to the server
		// this.socket.emit('client:message', messageObject);

		messageObject.fromMe = true;
		this.addMessage(messageObject);
	}

	addMessage(message) {
		// Append the message to the component state
		const messages = this.state.messages;
		messages.push(message);
		this.setState({ messages });
	}

	componentDidMount() {
		// this.message = "Hello World!";
		// this.addMessage(this.message);
	}

	componentWillUnmount() {

	}

	render() {
		return (
			<div className="ChatWindow">
				
				<Messages messages={this.state.messages} />
				<TypeWindow onSend={this.sendHandler} />

			</div>
		);
	}

}

export default ChatWindow;
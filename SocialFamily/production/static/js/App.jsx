require('../css/App.css');

import React from "react";

// import LoginWindow from "./LoginWindow";
// import { PageHeader } from "react-bootstrap";

import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";

// require('../css/fullstack.css');
// var $ = require('jquery');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { username: '' };

		// Bind 'this' to event handlers. React ES6 does not do this by default
		// this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
		// this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
	}

	// usernameChangeHandler(event) {
	// 	this.setState({ username: event.target.value });
	// }

	// usernameSubmitHandler(event) {
	// 	event.preventDefault();
	// 	this.setState({ submitted: true, username: this.state.username });
	// }

	render() {
		return (
			<div className="row">
				<div className="col-sm-3" id="ContactList">
					<div>
						<p className="header">Username and photo</p>
						<ContactList />
					</div>
				</div>

				{/* <div className="col-sm-9" id="ChatWindow" onClick={this.usernameSubmitHandler}> */}
				<div className="col-sm-9" id="ChatWindow">
					{/* <ChatWindow username={this.state.username}/> */}
					{<ChatWindow />}
				</div>
			</div>
		);
	}

}

App.defaultProps = {
};

export default App;
import React from "react";
// import LoginWindow from "./LoginWindow";
import ContactList from "./ContactList";
import { PageHeader } from "react-bootstrap";
import ChatWindow from "./ChatWindow";

// require('../css/fullstack.css');
// var $ = require('jquery');

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-3" id="ContactList">
					<div>
						<p className="header">Contacts</p>
						<ContactList />
					</div>
				</div>

				<div className="col-sm-9" id="ChatWindow">
					<ChatWindow />
				</div>
			</div>
		);
	}

}

import React from 'react';
import Contact from "./Contact";

class ContactList extends React.Component {
	constructor(props) {
		super(props);
		this.props = {
			name: {default: 'Default Name'}
		};

	}
	

	render() {
		return (
			<div className="contactList">
				<div className="row">
					<Contact name="Nunzio" />
					<Contact name="Sushmita" />
					<Contact />
					{/* <div className="contact">{this.props.name}</div> */}
					{/* className="col-sm-4" */}
				</div>

			</div>
		);
	}

}

export default ContactList;
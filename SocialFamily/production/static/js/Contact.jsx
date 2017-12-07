import React from 'react';

class Contact extends React.Component {
	constructor(props) {
		super(props);
		this.props = {
			name: { default: 'Default Name' }
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		console.log('The contact was clicked.');
	};

	render() {
		return (
			<div className="contact" onClick={this.handleClick}>
				{this.props.name}
			</div>
		);
	}

}

export default Contact;
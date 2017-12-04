import React from 'react';

class ChatWindow extends React.Component {

	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		this.setState({
			date: new Date()
		});
	}

	render() {
		return (
			<div className="chatWindow">
				<div className="row">
					<p className="header">Messages</p>
					<div>Date is {this.state.date.toLocaleDateString()}</div>
					<div>Time is {this.state.date.toLocaleTimeString()}</div>
				</div>

			</div>
		);
	}

}

export default ChatWindow;
import React from 'react';
import CurrentUser from '../../utils/current-user';
import CrudFacade from '../../api/rest-api';
import './home.scss';
import TextBox from 'devextreme-react/text-box';
import TextArea from 'devextreme-react/text-area';
import { useAuth } from '../../contexts/auth';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {},
			task: {},
		};
	}

	componentDidMount() {
		// fetch('/users/6004c59c982dabeb26774c61')
		// 	.then((res) => res.json())
		// 	.then((user) => {
		// 		this.setState({ user: user });
		// 	});

		const oUser = CurrentUser();
		this.oCrudFacade = CrudFacade();
		this.setState({ user: oUser });
		// const sReq = '/tasks/' + oUser.username;

		this.oCrudFacade.getTasksForUser(oUser.username, (tasks) => {
			if (!tasks.sort) {
				tasks = [];
			}
			if (tasks.length === 0) {
				tasks.push({ title: '', description: '', date_starts: null });
			} else {
				tasks.sort((a, b) => a.date_starts > b.date_starts);
			}
			this.setState({ task: tasks[0] });
		});

		// fetch(sReq)
		// 	.then((res) => res.json())
		// 	.then((tasks) => {
		// 		tasks.sort((a, b) => a.date_starts > b.date_starts);
		// 		if (tasks.length === 0) {
		// 			tasks.push({ title: '', description: '', date_starts: null });
		// 		}
		// 		this.setState({ task: tasks[0] });
		// 	});
	}

	render() {
		return (
			<div className="form" style={{ width: '50%' }}>
				<div className="dx-fieldset">
					<div className="dx-fieldset-header">
						Hello, {this.state.user.firstname}
					</div>
					<div className="dx-field">
						<div className="dx-field-label">Next Task</div>
						<div className="dx-field-value-static">{this.state.task.title}</div>
					</div>
					<div className="dx-field">
						<div className="dx-field-label">Description</div>
						<div className="dx-field-value-static">
							{this.state.task.description}
						</div>
					</div>
					<div className="dx-field">
						<div className="dx-field-label">Deadline</div>
						<div className="dx-field-value-static">
							{this.state.task.date_starts}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;

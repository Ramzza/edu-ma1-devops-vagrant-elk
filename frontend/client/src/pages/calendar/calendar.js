import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import './calendar.scss';
import CurrentUser from '../../utils/current-user';

const currentDate = new Date(2021, 0, 18);
const views = ['week', 'month'];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tasks: [],
		};
	}

	componentDidMount() {
		const oUser = CurrentUser();
		this.setState({ user: oUser });
		const sReq = '/tasks/' + oUser.username;

		fetch(sReq)
			.then((res) => res.json())
			.then((tasks) => {
				let aEntries = [];
				tasks.forEach((element) => {
					aEntries.push({
						text: element.title,
						startDate: element.date_starts,
						endDate: element.date_ends,
					});
				});
				this.setState({ tasks: aEntries });
			});
	}

	render() {
		return (
			<React.Fragment>
				<h2 className={'content-block'}>Calendar</h2>
				<div className={'content-block'}>
					<div className={'dx-card responsive-paddings'}>
						<Scheduler
							timeZone="America/Los_Angeles"
							dataSource={this.state.tasks}
							views={views}
							defaultCurrentView="month"
							defaultCurrentDate={currentDate}
							height={600}
							startDayHour={9}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default App;

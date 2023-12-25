import React from 'react';
import CurrentUser from '../../utils/current-user';
import CrudFacade from '../../api/rest-api';
import './profile.scss';
import Form, { Item } from 'devextreme-react/form';

const aNotVisibleFields = [
	'_id',
	'car',
	'pc',
	'__v',
	'password',
	'date_end',
	'cnp',
	'username',
	'comments',
	'date_started',
];
const aDisabledFields = ['cnp', 'username'];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {},
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
	}

	customizeItem(item) {
		if (aNotVisibleFields.indexOf(item.dataField) !== -1) {
			item.visible = false;
		}

		if (aDisabledFields.indexOf(item.dataField) !== -1) {
			item.disabled = true;
		}
	}

	onFieldDataChanged(oField) {
		debugger;
		console.log(JSON.stringify(this.state.user));

		this.oCrudFacade.patchUser(this.state.user, (user) => {
			console.log(user);
		});

		// fetch('/users/6004c59c982dabeb26774c61', {
		// 	method: 'PATCH',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(this.state.user),
		// })
		// 	.then((res) => res.json())
		// 	.then((user) => {
		// 		console.log(user);
		// 	});
	}

	render() {
		return (
			<React.Fragment>
				<h2 className={'content-block'}>Profile</h2>

				<div className={'content-block dx-card responsive-paddings'}>
					<div className={'form-avatar'}>
						<img
							alt={''}
							src={`https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/${this.state.user.Picture}`}
						/>
					</div>
					<div>{this.state.user.username}</div>
					<div>{this.state.user.cnp}</div>
				</div>

				<div className={'content-block dx-card responsive-paddings'}>
					<Form
						id={'form'}
						formData={this.state.user}
						onFieldDataChanged={this.onFieldDataChanged.bind(this)}
						labelLocation={'top'}
						colCountByScreen={colCountByScreen}
						customizeItem={this.customizeItem}
					></Form>
				</div>
			</React.Fragment>
		);
	}
}

const colCountByScreen = {
	xs: 1,
	sm: 2,
	md: 3,
	lg: 4,
};

export default App;

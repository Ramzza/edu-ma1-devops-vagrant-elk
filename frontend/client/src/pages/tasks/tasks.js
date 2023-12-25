import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
	Column,
	Pager,
	Paging,
	FilterRow,
	Editing,
	Button,
	Lookup,
} from 'devextreme-react/data-grid';
import CurrentUser from '../../utils/current-user';
import { Toast } from 'devextreme-react';
import CrudFacade from '../../api/rest-api';

const dataSource = {
	store: {
		type: 'odata',
		key: 'Task_ID',
		url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
	},
	expand: 'ResponsibleEmployee',
	select: [
		'Task_ID',
		'Task_Subject',
		'Task_Start_Date',
		'Task_Due_Date',
		'Task_Status',
		'Task_Priority',
		'Task_Completion',
		'ResponsibleEmployee/Employee_Full_Name',
	],
};

const priorities = [
	{ name: 'High', value: 4 },
	{ name: 'Urgent', value: 3 },
	{ name: 'Normal', value: 2 },
	{ name: 'Low', value: 1 },
];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tasks: [],
		};

		this.allowDeleting = this.allowDeleting.bind(this);
		this.onEditorPreparing = this.onEditorPreparing.bind(this);
		this.onRowValidating = this.onRowValidating.bind(this);
		this.isCloneIconVisible = this.isCloneIconVisible.bind(this);
		this.cloneIconClick = this.cloneIconClick.bind(this);
		this.deleteIconClick = this.deleteIconClick.bind(this);
	}

	componentDidMount() {
		const oUser = CurrentUser();
		this.oCrudFacade = CrudFacade();
		this.setState({ user: oUser });

		this.oCrudFacade.getTasksForUser(oUser.username, (tasks) => {
			if (tasks.length === 0) {
				tasks.push({
					title: '',
					description: '',
					_id: '1',
					owner: oUser.username,
				});
			}
			this.setState({ tasks: tasks });
		});

		// const sReq = '/tasks/' + oUser.username;

		// fetch(sReq)
		// 	.then((res) => res.json())
		// 	.then((tasks) => {
		// 		if (tasks.length === 0) {
		// 			tasks.push({
		// 				title: '',
		// 				description: '',
		// 				_id: '1',
		// 				owner: oUser.username,
		// 			});
		// 		}
		// 		this.setState({ tasks: tasks });
		// 	});
	}

	isChief(position) {
		return false;
		// return position && ['CEO', 'CMO'].indexOf(position.trim().toUpperCase()) >= 0;
	}
	allowDeleting(e) {
		return !this.isChief(e.row.data.Position);
	}
	onRowValidating(e) {
		const position = e.newData.Position;

		if (this.isChief(position)) {
			e.errorText = `The company can have only one ${position.toUpperCase()}. Please choose another position.`;
			e.isValid = false;
		}

		let oFinalData = e.oldData;
		for (let sAttr in e.oldData) {
			if (e.newData[sAttr] !== undefined) {
				oFinalData[sAttr] = e.newData[sAttr];
				break;
			}
		}

		this.editTask(oFinalData);
	}

	onEditorPreparing(e) {
		if (e.parentType === 'dataRow' && e.dataField === 'Position') {
			e.editorOptions.readOnly = this.isChief(e.value);
		}
	}
	isCloneIconVisible(e) {
		return !e.row.isEditing && !this.isChief(e.row.data.Position);
	}
	cloneIconClick(e) {
		const tasks = [...this.state.tasks];
		const clonedItem = { ...e.row.data };

		tasks.splice(e.row.rowIndex, 0, clonedItem);
		this.setState({ tasks: tasks });
		this.duplicateTask(e.row.data, e.row.rowIndex);
		e.event.preventDefault();
	}

	deleteIconClick(e) {
		const tasks = [...this.state.tasks];

		tasks.splice(e.row.rowIndex, 1);
		this.setState({ tasks: tasks });
		this.deleteTask(e.row.data);
		e.event.preventDefault();
	}

	duplicateTask(oTask, rowIndex) {
		this.oCrudFacade.postTask(oTask, (newTask) => {
			const tasks = [...this.state.tasks];
			tasks.splice(rowIndex, 1);
			tasks.splice(rowIndex, 0, newTask);
			this.setState({ tasks: tasks });
		});

		// fetch('/tasks/', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(oTask),
		// })
		// 	.then((res) => res.json())
		// 	.then((newTask) => {
		// 		const tasks = [...this.state.tasks];
		// 		tasks.splice(rowIndex, 1);
		// 		tasks.splice(rowIndex, 0, newTask);
		// 		this.setState({ tasks: tasks });
		// 	});
	}

	deleteTask(oTask) {
		this.oCrudFacade.deleteTask(oTask._id, (task) => {
			console.log(task);
		});

		// const sReq = '/tasks/' + oTask._id;
		// fetch(sReq, {
		// 	method: 'DELETE',
		// })
		// 	.then((res) => res.json())
		// 	.then((task) => {
		// 		console.log(task);
		// 	});
	}

	editTask(oTask) {
		this.oCrudFacade.patchTask(oTask, (newTask) => {
			console.log(newTask);
		});

		// const sReq = '/tasks/' + oTask._id;
		// fetch(sReq, {
		// 	method: 'PATCH',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(oTask),
		// })
		// 	.then((res) => res.json())
		// 	.then((task) => {
		// 		console.log(task);
		// 	});
	}

	render() {
		return (
			<React.Fragment>
				<h2 className={'content-block'}>Tasks</h2>

				<DataGrid
					className={'dx-card wide-card'}
					dataSource={this.state.tasks}
					showBorders={false}
					focusedRowEnabled={true}
					defaultFocusedRowIndex={0}
					keyExpr="_id"
					columnAutoWidth={true}
					columnHidingEnabled={true}
					onRowValidating={this.onRowValidating}
					onEditorPreparing={this.onEditorPreparing}
				>
					<Paging defaultPageSize={10} />
					<Pager showPageSizeSelector={true} showInfo={true} />
					<FilterRow visible={true} />

					<Editing
						mode="row"
						useIcons={true}
						allowUpdating={true}
						allowDeleting={this.allowDeleting}
					/>
					<Column type="buttons" width={110}>
						<Button name="edit" />
						<Button name="delete" onClick={this.deleteIconClick} />
						<Button
							hint="Clone"
							icon="repeat"
							visible={this.isCloneIconVisible}
							onClick={this.cloneIconClick}
						/>
					</Column>

					{/* <Column dataField={'_id'} width={90} hidingPriority={2} /> */}
					<Column
						dataField={'title'}
						width={190}
						caption={'Subject'}
						hidingPriority={8}
						allowEditing="false"
					/>
					<Column
						dataField={'description'}
						width={190}
						caption={'Description'}
						hidingPriority={8}
						allowEditing="false"
					/>
					<Column dataField={'is_done'} caption={'Status'} hidingPriority={6} />
					{/* <Column
						dataField={'Task_Priority'}
						caption={'Priority'}
						hidingPriority={5}
					>
						<Lookup
							dataSource={priorities}
							valueExpr={'value'}
							displayExpr={'name'}
						/>
					</Column> */}
					<Column
						dataField={'owner'}
						caption={'Assigned To'}
						allowSorting={false}
						hidingPriority={7}
					/>
					<Column
						dataField={'date_starts'}
						caption={'Start Date'}
						dataType={'date'}
						hidingPriority={3}
					/>
					<Column
						dataField={'date_ends'}
						caption={'Due Date'}
						dataType={'date'}
						hidingPriority={4}
					/>
					{/* <Column
						dataField={'Task_Priority'}
						caption={'Priority'}
						hidingPriority={1}
					/> */}
					{/* <Column
						dataField={'Task_Completion'}
						caption={'Completion'}
						hidingPriority={0}
					/> */}
					<Column
						dataField={'created_at'}
						caption={'Created on'}
						hidingPriority={0}
					/>
				</DataGrid>
			</React.Fragment>
		);
	}
}

export default App;

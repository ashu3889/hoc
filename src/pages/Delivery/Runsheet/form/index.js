import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Grid from 'material-ui/Grid';
import {Paper, TextField, MenuItem, Button, Chip} from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import {styles} from '../../../css';
import SearchableDropDown from '../../../../components/searchableDropDown';
import EnhancedTableHead from './extComps/tableHead';
import ReactMaterialUiNotifications from '../../../../components/ReactMaterialUiNotifications';
import {postJsonEntity, putJsonEntity, getEntity} from '../../../../actions/entity';

class DeliveryOrderForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			req_driver_id: '',
			req_connote_id: '',
			connotes: [],
			status: '',
			zipcode_allow: [],
		};
	}

	componentWillMount() {
		this.props.getEmployeesCourier();
		if (this.props.edit) {
			getEntity(`delivery/${this.props.match.params.id}`, null).then((res) => {
				const {data} = res.data;
				console.log('status', data.status_name);
				data.delivery_detail.forEach((detail) => this.props.getConnoteById(detail.connote_no));
				this.setState({
					req_driver_id: data.courier_id,
					status: data.status_name,
				});
			});
		}
	}

	componentWillReceiveProps(nextProps) {
				if (this.props.connoteInfo !== nextProps.connoteInfo) {
					const {connoteNumber, toZipCode, nodePosition, actualWeight} = nextProps.connoteInfo;
					const newConnote = {
						connoteNumber,
						toZipCode,
						status: nodePosition.nodeDetail.status,
						actualWeight,
					};
					
					if (!this.state.connotes.find((connote) => connote.connoteNumber === newConnote.connoteNumber)) {
						this.setState({
							connotes: [
								newConnote,
								...this.state.connotes,
							],
							req_connote_id: '',
						});
					}
				}
		
	}

  handleChange = (name) => (value) => {
    this.setState({
      [name]: value,
    });
    getEntity(`driver/${value}/zipcode`, null).then((res) => {
		const {data} = res.data;
		this.setState({
	     zipcode_allow	: data,
	    });
	});
  };

  handleChangeText = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

	handleScannedConnote = (event) => {
		const {zipcode_allow,req_connote_id} = this.state;
		if (event.key === 'Enter') {
			getEntity(`connote/${req_connote_id}`, null).then((res) => {
        const {data} = res.data;
        var matches = zipcode_allow.filter(function (item) {
          return item.zip_code == to_zip_code;
        });
        if(matches.length == 0){
          this.setState({
              req_connote_id: '',
          });
          alert('Zipcode not allowed!');
          return false;
        }
        this.props.getConnoteById(this.state.req_connote_id);
      });

		}
	}

	handleRemoveConnote = (connoteNumber) => {
		this.setState({
			connotes: [
				...this.state.connotes.filter((connote) => connote.connoteNumber !== connoteNumber),
			],
		});
	}

	updateEntity = (status) => {
    const {id} = this.props.match.params;
    putJsonEntity(`delivery/${id}`, {
			node: sessionStorage.getItem('userNodeId'),
			connote_number: this.state.connotes.map((connote) => connote.connoteNumber),
			driver_id: this.state.req_driver_id,
			status,
    }).then((response) => this.entitySubmitSuccess());
  };

	saveEntity = (status) => {
    postJsonEntity('delivery', {
			node: sessionStorage.getItem('userNodeId'),
			connote_number: this.state.connotes.map((connote) => connote.connoteNumber),
			driver_id: this.state.req_driver_id,
			status,
		}).then((response) => this.entitySubmitSuccess());
  };

	entitySubmitSuccess = () => {
    this.showNotification('delivery');
    this.props.history.push(`/delivery/runsheet`);
  };

	showNotification = (entity) => {
    ReactMaterialUiNotifications.showNotification({
      text: this.props.edit
        ? `Edit ${entity} success`
        : `Add ${entity} success`,
    });
  };

	render() {
		const {req_driver_id, req_connote_id, connotes,zipcode_allow} = this.state;
		const {classes, edit} = this.props;
		let {employees} = this.props;
		employees = employees.map((employee) => ({
			...employee,
			displayValue: `${employee.firstName ? employee.firstName : ''} ${employee.lastName ? employee.lastName	: ''} - ${employee.employeeID}`,
		}));
		return (
			<div className={classes.root}>
				<div className={classes.headerWrapper}>
					<div className={classes.pageTitle}>
						<div className={classes.breadCrumbs}>
							Delivery /
							<span className={classes.transactionBreadcrumbs}> Runsheet /</span>
							<span className={classes.transactionBreadcrumbs}>
								{' '}
								{edit ? `Edit Runsheet` : `New Runsheet`}
							</span>
						</div>
						<br />
						<p className={classes.titleWrapper}>
							{edit ? `Edit Runsheet` : `New Runsheet`}
						</p>
					</div>
				</div>
				<div>
					<Grid container>
						<Paper className={classes.formWrapper}>
							<Grid item xs={12} sm={6} md={4}>
								<SearchableDropDown
									disabled={this.props.edit}
									autoFocus
									className={classes.textField}
									value={req_driver_id}
									selectedValue={req_driver_id}
									selectOptions={employees}
									valueKey={'employeeID'}
									labelKey={'displayValue'}
									searchkey={'s'}
									placeholder={'Driver'}
									onUpdate={this.handleChange('req_driver_id')}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12}>
								<div className={classes.scanConnotesWrapper}>
									<TextField
										disabled={this.state.status === 'DEPART' || !(req_driver_id && req_driver_id !== '')}
										onKeyDown={this.handleScannedConnote}
										onChange={this.handleChangeText('req_connote_id')}
										id="req_connote_id"
										label="Scan Connote Here"
										type="text"
										value={req_connote_id}
										className={classes.scanConnotes}
									/>
									<div className={classes.scanConnotesTotal}>
										{
											`Total: ${this.state.connotes.length} connotes (${
												this.state.connotes.reduce((total, current) => {
													return total + Number(current.actualWeight);
												}, 0)
											} kg)`
										}
									</div>
								</div>
							</Grid>
							<Grid item xs={12} sm={12} md={12}>
								<Table className={classes.table}>
									<TableHead>
										<TableRow
											tabIndex={-1}
										>
											<TableCell padding="none">Connote Number</TableCell>
											<TableCell padding="dense">ZipCode</TableCell>
											<TableCell padding="dense">Status</TableCell>
											<TableCell />
										</TableRow>
									</TableHead>
									<TableBody>
										{
											connotes.map((connote) => {
												return (
													<TableRow
														hover
														tabIndex={-1}
														key={connote.connoteNumber}
													>
														<TableCell padding="none">{connote.connoteNumber}</TableCell>
														<TableCell padding="dense">{connote.toZipCode}</TableCell>
														<TableCell padding="dense">{connote.status}</TableCell>
														<TableCell>
															<Button
																dense="true"
																color="secondary"
																onClick={() => this.handleRemoveConnote(connote.connoteNumber)}
															>
																Remove
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
                    {(4 - connotes.length) > 0 && (
                      <TableRow style={{height: 49 * (4 - connotes.length)}}>
                        <TableCell colSpan={5} />
                      </TableRow>
                    )}
									</TableBody>
                </Table>
							</Grid>
							<Grid item xs={12} sm={12} md={12} className={classes.runsheetSubmits}>
								<Button
									disabled={this.state.status === 'DEPART' || !(req_driver_id && req_driver_id !== '' && connotes.length > 0)}
									variant="raised"
									color="secondary"
									style={{marginRight: 20}}
									onClick={() => this.props.edit ? this.updateEntity('0') : this.saveEntity('0')}
								>
									Save
								</Button>
								<Button
									disabled={this.state.status === 'DEPART' || !(req_driver_id && req_driver_id !== '' && connotes.length > 0)}
									variant="raised"
									color="primary"
									onClick={() => this.props.edit ? this.updateEntity('1') : this.saveEntity('1')}
								>
									Depart
								</Button>
							</Grid>
						</Paper>
					</Grid>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	employees: state.employee.employees,
	connoteInfo: state.connoteSearch.detailInfo,
});

const mapDispatchToProps = (dispatch) => ({
	getEmployeesCourier: () => {
		dispatch({
			type: 'GET_EMPLOYEES_COURIER_REQUESTED',
		});
	},
	getConnoteById: (connoteNumber) => {
		dispatch({
			type: 'GET_CONNOTE_BY_ID_REQUESTED',
			id: connoteNumber,
		});
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(DeliveryOrderForm)));

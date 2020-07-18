import React, { Component } from 'react';
import '../App.css';
class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            status: false,
        }
    }

    //Bất đồng bộ Synchronous và Asynchronous 
    UNSAFE_componentWillMount() {
        if (this.props.task) {
            this.setState({
                id: this.props.task.id,
                name: this.props.task.name,
                status: this.props.task.status,
            }, () => {
                //console.log(this.state);
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.task) {
            this.setState({
                id: nextProps.task.id,
                name: nextProps.task.name,
                status: nextProps.task.status,
            }, () => {
                //console.log(this.state);
            })      //nextProps && nextProps.task === null
        } else if (!nextProps.task) {
            //Sửa -> thêm
            this.setState({
                id: '',
                name: '',
                status: false,
            });
        }
    }

  

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        if (name === "status") {
            value = target.value === 'true' ? true : false;
        }
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state);
        this.onClear();
        this.onCloseForm();
    }

    onClear = () => {
        this.setState({
            name: '',
            status: false
        });
    }

    onCloseForm = () => {
        this.props.onCloseForm();
    }

    render() {
        var { id } = this.state;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">{id !== '' ? 'Update công việc' : 'Thêm Công Việc'}
                        <span className="fa fa-times-circle text-right padding195" onClick={this.onCloseForm}></span>
                    </h3>

                </div>
                <div className="panel-body">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Tên :</label>
                            <input type="text" className="form-control" name="name" onChange={this.onChange} value={this.state.name} />
                        </div>
                        <label>Trạng Thái :</label>
                        <select className="form-control" required="required" name="status" value={this.state.status} onChange={this.onChange}>
                            <option value={true}>Kích Hoạt</option>
                            <option value={false}>Ẩn</option>
                        </select>
                        <br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning" >Lưu lại</button>&nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.onClear}>Hủy Bỏ</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}



export default TaskForm;
import React, { Component } from 'react';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';
import _ from 'lodash';

//Truyền dữ liệu từ cha vào con thì dung props function
class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isDisplayForm: false,
            taskEditing: null,
            filter: {
                name: '',
                status: -1
            },
            keyword: '',
            sortBy: 'name',
            sortValue: 1
        }
        //this.isDisplayForm = this.setState.bind(this);
    }

    //Chỉ được gọi duy nhất 1 lần khi load lại trang
    UNSAFE_componentWillMount() {
        //Lưu vào state
        if (localStorage && localStorage.getItem('tasks')) {
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            this.setState({
                tasks: tasks
            });
        }
    }

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    //Tạo ID Random
    GenerateID() {
        return this.s4() + this.s4() + '-' + this.s4() + this.s4() + '-' + this.s4() + this.s4() + '-' + this.s4() + this.s4() + '-' + this.s4() + this.s4();
    }

    // onGenerateData = () => {
    //     var tasks = [
    //         {
    //             id: this.GenerateID(),
    //             name: 'Học lập trình',
    //             status: true
    //         },
    //         {
    //             id: this.GenerateID(),
    //             name: 'PHP',
    //             status: true
    //         },
    //         {
    //             id: this.GenerateID(),
    //             name: 'TypeScript',
    //             status: true
    //         }

    //     ];
    //     // console.log(tasks);
    //     // this.setState({
    //     //     tasks: tasks
    //     // });
    //     localStorage.setItem('tasks', JSON.stringify(tasks));
    // }



    showFormAdd = () => { //Thêm task

        //đang mở form và có giá trị
        if (this.state.isDisplayForm && this.state.taskEditing !== null) {
            this.setState({
                isDisplayForm: true,
                taskEditing: null
            });
        } else {
            this.setState({
                isDisplayForm: !this.state.isDisplayForm,
                taskEditing: null
            });
        }
    }

    onCloseForm = () => {
        this.setState({
            isDisplayForm: false
        });
    }

    onSubmit = (data) => {
        //Thêm
        console.log(data);
        var { tasks } = this.state;
        if (data.id === '') {
            data.id = this.GenerateID();
            //var a = this.GenerateID;
            tasks.push(data);
        } else {
            var index = this.findIndex(data.id);
            tasks[index] = data;
        }
        this.setState({
            tasks: tasks
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    onUpdateStatus = (id) => {
        var { tasks } = this.state;
        // var index = this.findIndex(id);
        //console.log(index);

        var index = _.findIndex(tasks, (task) => {
            return task.id === id;
        });
        if (index !== -1) {
            tasks[index].status = !tasks[index].status;
        }
        this.setState({
            tasks: tasks,
            //taskEditing: null
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));

    }

    onDelete = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        //console.log(index);
        if (index !== -1) {
            tasks.splice(index, 1);
            this.setState({
                tasks: tasks
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        this.onCloseForm();
    }

    onShowForm = () => {
        this.setState({
            isDisplayForm: true
        });
    }

    onUpdate = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        this.setState({
            taskEditing: tasks[index]
        }, () => { });

        this.onShowForm();
    }


    findIndex = (id) => {
        var { tasks } = this.state;
        var result = -1;
        tasks.forEach((task, index) => {
            if (task.id === id) {
                result = index;
            }
        });
        return result;
    }

    onFilter = (filterName, filterStatus) => {
        // console.log(filterName + "-" + filterStatus);
        this.setState({
            filter: {
                name: filterName.toLowerCase(),
                status: parseInt(filterStatus, 10)
            }
        });
    }


    onSearch = (keyword) => {
        this.setState({
            keyword: keyword
        });
    }

    onSort = (sortBy, sortValue) => {
        this.setState({
            sortBy: sortBy,
            sortValue: sortValue
        });
    }

    render() {
        //Tương tự var tasks = this.state.tasks
        var { tasks, isDisplayForm, filter, keyword, sortBy, sortValue } = this.state;

        if (filter) {
            if (filter.name) {
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1;
                });
            }

            tasks = tasks.filter((task) => {
                if (filter.status === -1) {
                    return task;
                } else {
                    return task.status === (filter.status === 1 ? true : false)
                }
            });


        }

        //Search
        if (keyword) {
            // tasks = tasks.filter((task) => {
            //     return task.name.toLowerCase().indexOf(keyword) !== -1;
            // });

            tasks = _.filter(tasks, (task) => {
                return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
            })
        }


        //Sort By, Sort Value

        if (sortBy === 'name') {
            tasks.sort((a, b) => {
                if (a.name > b.name) {
                    return sortValue;
                } else if (a.name < b.name) {
                    return -sortValue;
                } else {
                    return 0;
                }
            });
        } else {
            tasks.sort((a, b) => {
                if (a.status > b.status) {
                    return -sortValue;
                } else if (a.status < b.status) {
                    return +sortValue;
                } else {
                    return 0;
                }
            });
        }

        var elmTaskForm = isDisplayForm ? <TaskForm
            onCloseForm={this.onCloseForm}
            onSubmit={this.onSubmit}
            task={this.state.taskEditing}
        /> : '';
        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr />
                </div>
                <div className="row">
                    {/* form Thêm công việc */}
                    <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
                        {/* <TaskForm /> */}
                        {elmTaskForm}
                    </div>
                    <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <button type="button" className="btn btn-primary" onClick={this.showFormAdd}>
                            <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                        </button>
                        {/* <button type="button" className="btn btn-danger ml-5" onClick={this.onGenerateData}>
                            Generate Data
                        </button> */}
                        <div className="row mt-15">
                            <Control onSearch={this.onSearch}
                                onSort={this.onSort}
                                sortBy={sortBy}
                                sortValue={sortValue} />
                        </div>
                        <div className="row mt-15">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <TaskList tasks={tasks} onUpdateStatus={this.onUpdateStatus} onDelete={this.onDelete} onUpdate={this.onUpdate} onFilter={this.onFilter} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
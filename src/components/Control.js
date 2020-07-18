import React, { Component } from 'react';
import Search from './control/Search';
import Sort from './control/Sort';
class Control extends Component {
    render() {
        return (
            <div>
                <Search onSearch={this.props.onSearch} />
                <Sort   onSort={this.props.onSort}
                        sortBy={this.props.sortBy}
                        sortValue={this.props.sortValue}
                />
            </div>
        );
    }
}

export default Control;
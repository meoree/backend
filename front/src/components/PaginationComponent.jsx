import React, {Component, Fragment} from 'react';
import {connect} from "react-redux"


class PaginationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageLimit: this.props.pageLimit,
            totalRecords: this.props.totalRecords,
            pageNeighbours: this.props.pageNeighbours,
            currentPage: 1,
            totalPages: Math.ceil(this.props.totalRecords / this.props.pageLimit),
        }
    }


    fetchPageNumbers = () => {
        const currentPage = this.state.currentPage;
        const pageNeighbours = this.state.pageNeighbours;
        const totalNumbers = (this.state.pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;
    }

       gotoPage = page => {
       const {onPageChanged = f => f} = this.props;
       this.setState({currentPage: page}, () => onPageChanged((page)));
    }
    render() {
        const totalRecords = this.props.totalRecords;
        const totalPages = Math.ceil(this.props.totalRecords / this.state.pageLimit);
        if (!totalRecords || totalPages === 1) return null;
        const {currentPage} = this.state;
        const pages = this.fetchPageNumbers();
    }

};

export default connect()(PaginationComponent);
import React, { Component } from 'react'
import EntryView from './partials/entryView';
const backendRoutes = require('../routes/index');

class ViewAllEntries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    componentDidMount(){
        this.fetchAllEntries();
    }

    fetchAllEntries = () => {
        var _this = this;

        let url = backendRoutes.getAllEntry;
        fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        }).then(([statusCode, data]) => {
            if (statusCode === 200) {
                _this.setState({
                    data: data.data,
                });
            } else {
                console.error(statusCode, data);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {

        const entries = this.state.data.map((entry) => {
            return (
                <EntryView data={entry} key={entry.id}/>
            );
        });

        return (
            <div className="container">
                <div className="row">
                    {entries}
                </div>
            </div>
        )
    }
}

export default ViewAllEntries;
import React, { Component } from 'react';
const backendRoutes = require('../../routes/index');

class EntryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: true
        }
    }

    handleDelete = () => {
        let entryid = this.props.data.id;
        let url = backendRoutes.delete + '/' + entryid;
        var _this = this;
        fetch(url, {
            method: "DELETE",
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
                    display: false,
                });
            } else {
                console.error(statusCode, data);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        const { id, content } = this.props.data;
        return (
            <div className="col s8 centerAlignCol" style={{ "display": ((this.state.display) ? "block" : "none") }}>
                <div className="row">
                    <h5><a href={`/view/${id}`}>{id}</a></h5>
                    <p className="truncate">{content}</p>
                    <button className="waves-effect waves-light btn red" onClick={this.handleDelete}>Delete</button>
                </div>
            </div>
        )
    }
}

export default EntryView;
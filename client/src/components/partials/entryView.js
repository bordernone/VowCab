import React, { Component } from 'react'

class EntryView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, content } = this.props.data;
        return (
            <div className="col s8 centerAlignCol">
                <div className="row">
                    <h5><a href={`/view/${id}`}>{id}</a></h5>
                    <p className="truncate">{content}</p>
                </div>
            </div>
        )
    }
}

export default EntryView;
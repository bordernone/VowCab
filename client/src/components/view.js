import React, { Component } from 'react'
import WordInput from './partials/wordInput';
const apiRoutes = require('../routes/index');

class View extends Component {
    constructor(props) {
        super(props);

        this.entryId = this.props.match.params.id;
        this.state = {
            content: (<span></span>),
            modifiedContent: (<span></span>),
            entries: []
        }
    }

    componentDidMount() {
        this.getContent();
    }

    getContent = () => {
        let url = apiRoutes.getEntry + '/' + this.entryId;
        let _this = this;
        fetch(url, {
            method: 'GET'
        }).then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        }).then(([statusCode, data]) => {
            if (statusCode === 200) {
                _this.setState({
                    content: data.content,
                    entries: data.entries
                }, () => {
                    _this.generateContent();
                });
            } else {
                console.error(statusCode, data);
            }
        }).catch(error => {
            console.error(error);
        });
    }

    inputField({ width }) {
        return (
            <input type="text" style={{ "width": `${width * 2}px` }} />
        )
    }

    generateContent = () => {
        let content = this.state.content;
        let entries = this.state.entries.sort(function (a, b) { return a.startPos - b.startPos });
        // let newContent;
        let previousEntry;
        let finalContent = [];
        entries.forEach((entry, index) => {
            if (index === 0) {
                finalContent.push(
                    <span key={index + "span"}>{content.substring(0, entry.startPos)}
                        <WordInput
                            width={entry.endPos - entry.startPos}
                            entry={entry}
                            word={content.substring(entry.startPos, entry.endPos)} />
                    </span>
                );
                // newContent = content.substring(0, entry.startPos) + this.inputField(entry.endPos - entry.startPos); //"___HIDDEN CONTENT___";
            } else if (index === entries.length - 1) {
                finalContent.push(
                    <span key={index + "span"}>
                        {content.substring(previousEntry.endPos, entry.startPos)}
                        <WordInput
                            width={entry.endPos - entry.startPos}
                            entry={entry}
                            word={content.substring(entry.startPos, entry.endPos)} />
                        {content.substring(entry.endPos, content.length)}
                    </span>
                );

                // newContent += content.substring(previousEntry.endPos, entry.startPos);
                // newContent += this.inputField(entry.endPos - entry.startPos); //"___HIDDEN CONTENT___";
                // newContent += content.substring(entry.endPos, content.length);
            } else {
                finalContent.push(
                    <span key={index + "span"}>
                        {content.substring(previousEntry.endPos, entry.startPos)}
                        <WordInput
                            width={entry.endPos - entry.startPos}
                            entry={entry}
                            word={content.substring(entry.startPos, entry.endPos)} />
                    </span>
                );

                // newContent += content.substring(previousEntry.endPos, entry.startPos);
                // newContent += this.inputField(entry.endPos - entry.startPos); //"___HIDDEN CONTENT___";
            }
            previousEntry = entry;
        });

        this.setState({
            modifiedContent: finalContent,
        })

    }

    render() {

        return (
            <div className="row container">
                <div className="col s12 viewContent">
                    {this.state.modifiedContent}
                </div>
            </div>
        )
    }
}

export default View;
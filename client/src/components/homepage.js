import React, { Component, createRef } from 'react';
import M from 'materialize-css';
import '../assets/css/main.css';

const apiRoutes = require('../routes/index');

class Homepage extends Component {
    constructor(props) {
        super(props);


        this.textarea = createRef();
        this.state = {
            waitForKeyUp: false,
            textareaVal: '',
            defBreaks: [],
            newDef: '',
            locked: false,
        }
    }

    componentDidMount = () => {
        M.Modal.init(this.defInputModal);
    }

    openModal(ref) {
        M.Modal.getInstance(ref).open();
    }

    closeModal(ref) {
        M.Modal.getInstance(ref).close();
    }

    handleKeyDown = (e) => {
        if (!this.state.waitForKeyUp) {
            if (e.keyCode === 69 && e.ctrlKey) {
                this.setState({
                    waitForKeyUp: true,
                });
                console.warn("Both pressed");
                this.openModal(this.defInputModal);
            }
        }
    }

    handleKeyUp = (e) => {
        if (e.keyCode === 69 || e.ctrlKey) {
            this.setState({
                waitForKeyUp: false,
            });
        }
    }

    handleAddNewDefTrigger = () => {
        let textVal = this.textarea.current;
        let cursorStart = textVal.selectionStart;
        let cursorEnd = textVal.selectionEnd;

        if (cursorStart !== cursorEnd) {
            var currentDefs = this.state.defBreaks;
            var def = this.state.newDef;
            currentDefs.push({
                startPos: cursorStart,
                endPos: cursorEnd,
                def: def,
            });

            this.setState({
                defBreaks: currentDefs,
                newDef: '',
                waitForKeyUp: false,
            });
        }
    }

    handleLockIt = (e) => {
        e.preventDefault();
        this.setState({
            locked: true,
        });
    }

    handleTextChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    }

    handleSubmit = () => {
        let url = apiRoutes.newEntry;
        let _this = this;
        fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "entries": _this.state.defBreaks,
                "content": _this.state.textareaVal
            })
        }).then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        }).then(([statusCode, data]) => {
            if (statusCode === 200) {
                console.log(data);
            } else {
                console.error(statusCode, data);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="row container">
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea
                                id="textareaVal"
                                className="materialize-textarea"
                                style={{ "height": "400px" }}
                                onKeyDown={this.handleKeyDown}
                                onKeyUp={this.handleKeyUp}
                                ref={this.textarea}
                                value={this.state.textareaVal}
                                onChange={this.handleTextChange}
                                readOnly={(this.state.locked) ? "readonly" : ""}></textarea>
                            <label htmlFor="textareaVal">Textarea</label>
                        </div>
                    </div>
                </form>

                <div className="row">
                    <div className="col s8 centerAlignCol center-align">
                        <div className="col s4">
                            <a
                                className="waves-effect waves-light btn"
                                onClick={this.handleLockIt}>Lock it</a>
                        </div>
                        <div className="col s4">
                            <a
                                className="waves-effect waves-light btn"
                                onClick={this.handleSubmit}>Submit</a>
                        </div>
                    </div>
                </div>


                <div id="modal1" className="modal" ref={modal => { this.defInputModal = modal }}>
                    <div className="modal-content">
                        <h4>Modal Header</h4>
                        <input
                            id="newDef"
                            onChange={this.handleTextChange}
                            className="validate"
                            placeholder="Definition"
                            value={this.state.newDef} />
                    </div>
                    <div className="modal-footer">
                        <a
                            href="#!"
                            className="modal-close waves-effect waves-green btn-flat"
                            onClick={this.handleAddNewDefTrigger}>Done</a>
                    </div>
                </div>
            </div>
        );
    }
}


export default Homepage;
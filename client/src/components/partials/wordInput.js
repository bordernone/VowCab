import React, { Component } from 'react';
import M from 'materialize-css';

class WordInput extends Component {
    constructor(props) {
        super(props);

        this.word = this.props.word;
        this.entry = this.props.entry;
        this.meaning = this.entry.def;
        if (this.entry.imgurl && (this.entry.imgurl).length > 0){
            this.popoverContentHtml = this.meaning+"<br/><img src=\"" + this.entry.imgurl + "\" class=\"defImg\"/>";
        } else {
            this.popoverContentHtml = this.meaning;
        }

        this.state = {
            userInput: '',
        }
    }

    componentDidMount() {
        M.AutoInit();
    }

    handleCheckBtnClick = () => {
        if (this.state.userInput === this.word){
            alert("Correct!");
        } else {
            alert("Incorrect");
        }
    }

    handleInputChange = (e) => {
        this.setState({
            userInput: e.target.value,
        });
    }

    render() {
        const width = this.props.width;
        return (
            <div className="wordInputWrapper">
                <input
                    type="text"
                    style={{ "width": `${width * 15}px` }}
                    className="noMargin"
                    onChange={this.handleInputChange}
                    value={this.state.userInput}
                />
                <div className="wordInputCheckBtn">
                    <a
                        className="waves-effect waves-teal btn-flat tooltipped"
                        data-position="bottom"
                        data-html="true"
                        data-tooltip={this.popoverContentHtml}
                        onClick={this.handleCheckBtnClick}>
                        <i className="tiny material-icons ">check</i>
                    </a>
                </div>
            </div>
        )
    }
}

export default WordInput;
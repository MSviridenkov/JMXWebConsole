'use strict';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import ReactTooltip from 'react-tooltip';

import styles from '../style';

var j4p = new Jolokia("/jolokia");

class Operation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {args: new Array(props.data.args.length), hidden: true};
        this.handleClick = this.handleClick.bind(this);
        this.handleArgsClick = this.handleArgsClick.bind(this);
        this.argumentChange = this.argumentChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.props.data) {
            document.getElementById("op"+this.props.node.fullName + this.props.data.id).style.height = '40px';
            this.setState({args: new Array(nextProps.data.args.length), hidden: true});
        }
    }

    handleArgsClick() {
        if (this.state.hidden) {
            var len = 40 + 30 * this.props.data.args.length;
            document.getElementById("op"+this.props.node.fullName+this.props.data.id).style.height = len + 'px';
        } else {
            document.getElementById("op"+this.props.node.fullName+this.props.data.id).style.height = '40px'
        }
        this.setState({hidden: !this.state.hidden});
    }

    argumentChange(event) {
        var newArgs = this.state.args;
        newArgs[event.target.getAttribute('data-index')] = event.target.value;
        this.setState({args: newArgs});
    }

    handleClick() {
        j4p.request({type: "exec", mbean: this.props.node.root + ":" + this.props.node.fullName, operation: this.props.data.name, arguments: this.state.args},
            { success: function(response) {
                toastr.success("Success: " + response.value + " was returned");
            },
                error: function(response) {
                    toastr.error("Error: " + response.error);
                }
            });
        this.setState({args: new Array(this.props.data.args.length)});
    }

    render() {
        var count = 0;
        return <li key={this.props.data.id} style={{height:'40px'}} id={"op"+this.props.node.fullName + this.props.data.id}>
            <a data-tip data-for={this.props.node.root + ":" + this.props.node.name + ":" + this.props.data.name} style={styles.name}>
                {this.props.data.name}
            </a>
            <ReactTooltip
                id={this.props.node.root + ":" + this.props.node.name + ":" + this.props.data.name}
                type='light'
                effect='solid'>
                <p><b>{this.props.data.ret}</b></p>
                <p>{this.props.data.desc}</p>
            </ReactTooltip>
            <div style={styles.textField}>
                <button
                    style={(this.props.data.args.length == 0) ? styles.compositeButton : styles.compositeButton.enabled}
                    value={this.state.args}
                    onClick={this.handleArgsClick}>
                    {(this.props.data.args.length == 0) ? "No Arguments" :
                        ((this.state.hidden) ? "Show Arguments" : "Hide Arguments")}
                </button>
                {(this.state.hidden) ? null : <ul style={styles.textFieldList}>
                    {this.props.data.args.map(function (arg) {
                        return <li style={styles.compositeElement}>
                            <a data-tip data-for={this.props.node.root + ":" + this.props.node.fullName + ":" + arg.name} style={styles.name}>
                                {arg.name}
                            </a>
                            <ReactTooltip
                                id={this.props.node.root + ":" + this.props.node.fullName + ":" + arg.name}
                                type='light'
                                effect='solid'>
                                <p><b>{arg.type} </b></p>
                                <p>{arg.desc}</p>
                            </ReactTooltip>
                            <textarea
                                style={styles.compositeTextArea}
                                value={this.state.args[count]}
                                data-index={count++}
                                onChange={this.argumentChange}
                            />
                        </li>
                    }.bind(this))}
                </ul>}
            </div>

            <button
                onClick={this.handleClick}
                style={styles.execButton}>
                Execute
            </button>

        </li>
    }
}

export default Operation
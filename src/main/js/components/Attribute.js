'use strict';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import ReactTooltip from 'react-tooltip';

import styles from '../style';
import TabularDataViewer from './TabularDataViewer'

var j4p = new Jolokia("/jolokia");

class Attribute extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCompositeClick = this.handleCompositeClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.compositeDataChange = this.compositeDataChange.bind(this);
        this.updateAttributeValue = this.updateAttributeValue.bind(this);

        var result = this.loadAttributeValue(props);
        this.state = {
            hidden: true,
            value: (result.unavailable) ? result.errorValue : result.response,
            unavailable: result.unavailable
        };
    }

    updateAttributeValue() {
        var result = this.loadAttributeValue(this.props);
        this.setState({value: (result.unavailable) ? result.errorValue : result.response, unavailable: result.unavailable});
    }

    loadAttributeValue(props) {
        var errorValue = "";
        var unavailable = false;
        var response = j4p.getAttribute(props.data.equalControl, props.data.attribute, "",
            {
                error: function (response) {
                    if (response.error.indexOf("java.lang.UnsupportedOperationException")) {
                        unavailable = true;
                        errorValue = response.error_value.message;
                    }
                },
                serializeException: true
            });
        /* ObjectName View */
        if (props.data.type=="javax.management.ObjectName" && !unavailable) {
            response = response.objectName;
        }
        return {
            response: response,
            unavailable: unavailable,
            errorValue: errorValue
        }
    }


    componentDidMount() {
        if (this.props.shouldUpdate) {
            this.timer = setInterval(this.updateAttributeValue, this.props.pollInterval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentWillReceiveProps(nextProps) {
        var newHidden = this.state.hidden;
        if (nextProps.data.name != this.props.data.name || nextProps.data.equalControl != this.props.data.equalControl) {
            document.getElementById(this.props.node.fullName + this.props.data.id).style.height = '40px';
            newHidden = true;
        }
        var result = this.loadAttributeValue(nextProps);
        this.setState({
            value: (result.unavailable) ? result.errorValue : result.response,
            unavailable: result.unavailable,
            hidden: newHidden
        });
        clearInterval(this.timer);
        if(nextProps.shouldUpdate) {
            this.timer = setInterval(this.updateAttributeValue, nextProps.pollInterval);
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    compositeDataChange(event) {
        var newValue = this.state.value;
        newValue[event.target.getAttribute('data-key')] = event.target.value;
        this.setState({value: newValue});
    }

    handleClick() {
        j4p.setAttribute(this.props.node.root + ":" + this.props.node.fullName, this.props.data.name, this.state.value,
            { success: function(response) {
                toastr.success("Success!");
            }, error: function(response) {
                toastr.error("Error: " + response.error);
            }
            });
    }

    handleCompositeClick(rowLength) {
        if (this.state.hidden) {
            var len = 40 + 30 * Object.keys(this.state.value).length;
            if (this.props.data.type == "javax.management.openmbean.TabularData") {
                len = 40 + 30 * (rowLength+1);
            }
            if (this.props.data.isArray) {
                if (this.props.data.type == "javax.management.openmbean.CompositeData") {
                    len = 40 + 30 * (rowLength+1);
                } else {
                    len = 40 + 30 * rowLength;
                }
            }
            document.getElementById(this.props.node.fullName+this.props.data.id).style.height = len + 'px';
        } else {
            document.getElementById(this.props.node.fullName+this.props.data.id).style.height = '40px'
        }
        this.setState({hidden: !this.state.hidden});
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleClick();
        }
    }

    render() {
        var displayAndSubmitAttributeForm =
            <input
                type="text"
                value={this.state.value}
                style={(this.state.unavailable) ? styles.textFieldArea : styles.textFieldArea.enabled}
                readOnly={!this.props.data.rw || this.state.unavailable}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
            />;

        var compositeData;
        var rows = [];
        var dataType;
        var rowLength = 0;


        /* TabularData View */
        if (this.props.data.type=="javax.management.openmbean.TabularData") {
            dataType = "Tabular Data";
            var queue = [];
            $.each(this.state.value , function (k, v) {
                if (typeof(v)=='object') {
                    queue.push(v);
                } else {
                    rows.push({key: k, value: v});
                }
            });
            if (queue.length > 0) {
                rows = []
            }
            while(queue.length > 0) {
                var el = queue.shift();
                var isRow = true;
                $.each(el , function (k, v) {
                    if (typeof(v)=='object') {
                        isRow = false;
                        queue.push(v);
                    }

                });
                if (isRow) {
                    rows.push(el);
                }
            }
            compositeData = <TabularDataViewer rows={rows} />;
            rowLength = Object.keys(rows[0]).length;
        }

        /* CompositeData View */
        if (this.props.data.type=="javax.management.openmbean.CompositeData" && this.state.value != null && !this.state.unavailable) {
            dataType = "Composite Data";
            if (this.props.data.isArray) {
                dataType += " Array";
                compositeData = <TabularDataViewer rows={this.state.value} />;
                rowLength = Object.keys(this.state.value[0]).length;
            } else {
                compositeData =
                    <ul style={styles.textFieldList}>
                        {Object.keys(this.state.value).map(function (k) {
                            return {key: k, value: this.state.value[k]}
                        }.bind(this)).map(function (result) {
                                return <li style={styles.compositeElement}>
                                    <div style={styles.name}>
                                        {result.key.toString()}
                                    </div>
                                    <textarea
                                        style={styles.compositeTextArea}
                                        readOnly={!this.props.data.rw }
                                        value={result.value.toString()}
                                        data-key={result.key}
                                        onChange={this.compositeDataChange}
                                    />
                                </li>;
                            }.bind(this)
                        )}
                    </ul>;
            }
        }
        /* Array View */
        if (compositeData == null && this.props.data.isArray) {
            dataType = " Array";
            compositeData = <ul style={styles.textFieldList}>
                {this.state.value.map(function (result, index) {
                    return <li style={styles.compositeElement}>
                        <textarea style={styles.arrayTextArea}
                                  readOnly={!this.props.data.rw}
                                  value={result.toString()}
                                  data-key={index}
                                  onChange={this.compositeDataChange} />
                    </li>
                }.bind(this))}
            </ul>;
            rowLength = this.state.value.length;
        }

        var compositeButton = <button style={styles.compositeButton.enabled}
                                      onClick={this.handleCompositeClick.bind(null, rowLength)}>
            {(this.state.hidden) ? "Show "+dataType : "Hide "+dataType}
        </button>;

        return <li key={this.props.data.id} id={this.props.node.fullName+this.props.data.id} style={{height:'40px', overflow:'visible'}}>
            <a data-tip data-for={this.props.node.root + ":" + this.props.node.name + ":" + this.props.data.name} style={styles.name}>
                {this.props.data.name}
            </a>
            <ReactTooltip
                id={this.props.node.root + ":" + this.props.node.name + ":" + this.props.data.name}
                type={(!this.state.unavailable) ? 'light' : 'error'}
                effect='solid'>

                <p><b>{(this.props.data.isArray) ? "[" + this.props.data.type + "]" : this.props.data.type}
                    {(this.state.unavailable) ? '(UNAVAILABLE)' : ''}</b></p>
                <p>{this.props.data.desc}</p>
            </ReactTooltip>
            <div style={styles.textField}>
                {((this.props.data.type == "javax.management.openmbean.CompositeData" ||
                this.props.data.type == "javax.management.openmbean.TabularData" || this.props.data.isArray) &&
                this.state.value != null &&
                !this.state.unavailable)
                    ? compositeButton : displayAndSubmitAttributeForm}
                {(this.state.hidden) ? null : compositeData}
            </div>
            <button
                disabled={!this.props.data.rw || this.state.unavailable}
                onClick={this.handleClick}
                style={((this.props.data.rw && !this.state.unavailable) ? styles.button.enabled : styles.button)}>
                OK
            </button>
        </li>
    }
}

export default Attribute
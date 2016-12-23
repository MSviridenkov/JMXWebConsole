'use strict';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import ReactTooltip from 'react-tooltip';

import styles from '../style';
import * as filters from '../filter';
import AttributesList from './AttributesList'
import {createJSONChildren, treeSort} from '../tree-creator'

const DEFAULT_POLL_INTERVAL = 2000; // in ms
const DEFAULT_SHOULD_UPDATE = false;


var j4p = new Jolokia("/jolokia");

toastr.options.positionClass = "toast-bottom-right";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            backupData: {},
            pollInterval: DEFAULT_POLL_INTERVAL,
            shouldUpdate: DEFAULT_SHOULD_UPDATE
        };
        this.onToggle = this.onToggle.bind(this);
        this.loadMBeansFromServer = this.loadMBeansFromServer.bind(this);
        this.onFilterMouseUp = this.onFilterMouseUp.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.changePollInterval = this.changePollInterval.bind(this);
    }

    loadMBeansFromServer() {
        var list = j4p.list();
        var data = treeSort(createJSONChildren(list, null));
        this.setState({data:data, backupData:data});
    }

    componentDidMount() {
        this.loadMBeansFromServer();
        //setInterval(this.loadMBeansFromServer, POLL_INTERVAL);
    }

    onToggle(node, toggled) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({cursor: node});
    }

    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            return this.setState({data: this.state.backupData});
        }
        var filtered = filters.filterArrayTree(this.state.backupData, filter);
        var expandedFiltered = [];
        for (var i = 0; i<filtered.length; i++) {
            if (filters.defaultMatcher(filter, filtered[i]) || filtered[i].children.length > 0) {
                expandedFiltered.push(filters.expandFilteredNodes(filtered[i], filter));
            }
        }
        this.setState({data: expandedFiltered});
    }
    /*
     handleChange(event) {
     this.setState({pollInterval: event.target.value});
     }
     */

    handleCheckboxChange(event) {
        this.setState({shouldUpdate: !this.state.shouldUpdate});
    }

    isPositiveInteger(str) {
        return /^(0|[1-9]\d*)$/.test(str);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.changePollInterval(event.target.value);
        }
    }

    changePollInterval(interval) {
        if (this.isPositiveInteger(interval)) {
            toastr.success("New interval: " + interval + " seconds");
            this.setState({pollInterval: interval * 1000});
        } else {
            toastr.error("Incorrect format! Please, input a positive integer.");
        }
    }

    handleClick() {
        this.forceUpdate();
    }

    render() {
        decorators.Header = (props) => {
            var headerWithTip = <div>
                <a data-tip data-for={props.node.fullName} style={styles.treeHeader}>
                    {props.node.name}
                </a>
                <ReactTooltip
                    id={props.node.fullName}
                    effect='solid'
                    type='light'
                    place='right'>
                    <p>{props.node.desc}</p>
                </ReactTooltip>
            </div>;
            return <div style={styles.treeHeader}>
                {(props.node.hasOwnProperty("desc")) ? headerWithTip : props.node.name}
            </div>;
        };
        return (
            <StyleRoot>
                <div style={styles.component}>
                    <div style={styles.searchBox}>
                        <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"></i>
                        </span>
                        <input type="text"
                            className="form-control"
                            placeholder="Search..."
                            onKeyUp={this.onFilterMouseUp.bind(this)}
                        />
                        </div>
                    </div>
                    <Treebeard
                        data={this.state.data}
                        onToggle={this.onToggle}
                        decorators={decorators}
                    />
                </div>
                <div style={styles.component}>
                    <div style={styles.pollIntervalInput}>
                        <input
                            type="checkbox"
                            onChange={this.handleCheckboxChange}
                        />
                        <input
                            type="text"
                            defaultValue={DEFAULT_POLL_INTERVAL / 1000}
                            id="intervalInput"
                            //onChange={this.handleChange}
                            // onKeyPress={this.handleKeyPress}
                            />
                            <button
                                onClick={this.handleClick}>
                                Refresh
                            </button>
                    </div>
                    <AttributesList node={this.state.cursor} pollInterval={this.state.pollInterval} shouldUpdate={this.state.shouldUpdate}/>
                </div>
            </StyleRoot>
        );
    }
}

export default Main
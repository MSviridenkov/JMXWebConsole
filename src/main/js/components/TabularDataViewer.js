'use strict';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import styles from '../style';

class TabularDataViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {index: 0};
        this.onPreviousClick = this.onPreviousClick.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
    }

    onPreviousClick() {
        this.setState({index: this.state.index-1});
    }

    onNextClick() {
        this.setState({index: this.state.index+1});
    }

    render() {
        return <div style={styles.tabularData}>
            <button onClick={this.onPreviousClick}
                    style={(this.state.index==0) ? styles.previousButton : styles.previousButton.enabled}
                    disabled={(this.state.index==0)}>
                Previous
            </button>
            <button onClick={this.onNextClick}
                    style={(this.state.index==this.props.rows.length - 1) ? styles.nextButton : styles.nextButton.enabled}
                    disabled={(this.state.index==this.props.rows.length - 1)}>
                Next
            </button>
            <ul style={styles.textFieldList}>
                {Object.keys(this.props.rows[this.state.index]).map(function (k) {
                    return {key: k, value: this.props.rows[this.state.index][k]}
                }.bind(this)).map(function (result) {
                        return <li style={styles.compositeElement}>
                            <div style={styles.name}>
                                {result.key.toString()}
                            </div>
                            <textarea
                                style={styles.compositeTextArea}
                                readOnly={true}
                                //disabled={!this.props.data.rw || this.props.data.unavailable}
                                value={result.value.toString()}
                                data-key={result.key}
                            />
                        </li>
                    }.bind(this)
                )}
            </ul>
        </div>
    }
}

export default TabularDataViewer
'use strict';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import styles from '../style';
import Attribute from './Attribute'
import Operation from './Operation'

var j4p = new Jolokia("/jolokia");

class AttributesList extends React.Component {
    constructor(props) {
        super(props);
        this.attrs = [];
        this.ops = [];
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !!(nextProps.node && nextProps.node.json);
    }
    /*
     componentWillReceiveProps(nextProps) {
     if (nextProps.pollInterval != this.props.pollInterval) {
     this.setState({pollInterval: nextProps.pollInterval});
     }
     }*/

    render() {
        if (this.props.node != null && this.props.node.json != null) {
            this.attrs = [];
            this.ops = [];
            let cur = this.props.node;
            let curLst = [];
            let count = 0;
            if (cur.json.attr != null) {
                $.each(cur.json.attr, function (k, v) {
                    var isArray = v.type.indexOf("[L")==0;
                    var attribute = {
                        id: count++,
                        name: k.toString(),
                        isArray: isArray,
                        type: (isArray) ? v.type.substring(2, v.type.length-1) : v.type,
                        rw: v.rw,
                        desc: v.desc.toString(),
                        equalControl: cur.root + ":" + cur.fullName,
                        attribute: k
                    };
                    curLst.push(attribute);
                });
            }
            this.attrs = curLst;
            curLst = [];
            if (cur.json.op != null) {
                count = 0;
                $.each(cur.json.op, function (k, v) {
                    if (Array.isArray(v)) {
                        for (var i = 0; i < v.length; i++) {
                            var attr = {
                                id: count++,
                                name: k.toString(),
                                ret: v[i].ret.toString(),
                                desc: v[i].desc.toString(),
                                args: [],
                                equalControl: cur.root + ":" + cur.fullName
                            };

                            v[i].args.forEach(function (arg, i, arr) {
                                var ar = {
                                    name: arg.name.toString(),
                                    type: arg.type.toString(),
                                    desc: arg.desc.toString()
                                };
                                attr.args.push(ar);
                            });
                            curLst.push(attr);
                        }
                    } else {
                        attr = {
                            id: count++,
                            name: k.toString(),
                            ret: v.ret.toString(),
                            desc: v.desc.toString(),
                            args: [],
                            equalControl: cur.root + ":" + cur.fullName
                        };

                        v.args.forEach(function (arg, i, arr) {
                            var ar = {
                                name: arg.name.toString(),
                                type: arg.type.toString(),
                                desc: arg.desc.toString()
                            };
                            attr.args.push(ar);
                        });
                        curLst.push(attr);
                    }
                });
            }
            this.ops = curLst;

        }

        return (
            <div style={{color:'#9DA5AB', position:'fixed', width: '48%'}}>
                <Tabs >
                    <TabList>
                        <Tab>Attributes</Tab>
                        <Tab>Operations</Tab>
                    </TabList>
                    <TabPanel>
                        <div style={styles.viewer.base}>
                            <ul>
                                {this.attrs.map(function (result) {
                                    //console.log("pollInterval: " + this.pollInterval);
                                    return <Attribute key={result.id} data={result} node={this.props.node} pollInterval={this.props.pollInterval} shouldUpdate={this.props.shouldUpdate}/>;
                                }.bind(this))}
                            </ul>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div style={styles.viewer.base}>
                            <ul>
                                {this.ops.map(function (result) {
                                    return <Operation key={result.id} data={result} node={this.props.node}/>;
                                }.bind(this))}
                            </ul>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

AttributesList.propTypes = {
    node: React.PropTypes.object
};

export default AttributesList
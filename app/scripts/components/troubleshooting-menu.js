import React from 'react';
import { connect } from 'react-redux';

import {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
} from '../actions/app-actions';

class DebugMenu extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { value: 'Initial data...'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  reset() {
    // ev.preventDefault();
    // this.props.resetLocalViewState();
    this.setState({
      value: 'dpdk'
    });
  }

  alertValue() {
    alert(this.state.value);
  }

  handleChange(ev) {
    this.setState({value: ev.target.value});
  }

  handleSubmit(ev) {
    alert(this.state.value);
    ev.preventDefault();
  }

  render() {
    return (
      <div className="troubleshooting-menu-wrapper">
        <div className="troubleshooting-menu-content">
          <h3>Network Control & Monitor</h3>
          <h4>{new Date().toLocaleTimeString()}</h4>
          <h4>{this.props.name}</h4>
          <div className="troubleshooting-menu-item" style={{height: 360, width: 480}}>
            <h4>Post Request</h4>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="flavor">
                Pick your favorite La Croix flavor:
              </label>
              <br />
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              <br />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  toggleTroubleshootingMenu,
  resetLocalViewState,
  clickDownloadGraph
})(DebugMenu);

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

    this.handleClickReset = this.handleClickReset.bind(this);
  }

  handleClickReset(ev) {
    ev.preventDefault();
    this.props.resetLocalViewState();
  }

  render() {
    const reportDownloadUrl = process.env.WEAVE_CLOUD
      ? `${window.location.origin}/api${window.location.pathname}/api/report`
      : 'api/report';
    return (
      <div className="troubleshooting-menu-wrapper">
        <div className="troubleshooting-menu">
          <div className="troubleshooting-menu-content">
            <h3>Network Control & Monitor</h3>
            <div className="troubleshooting-menu-item">
              <a
                className="footer-icon"
                href={reportDownloadUrl}
                post
                title="Save raw data as JSON"
              >
                <span className="fa fa-external-link" />
                <span className="description">
                  Post Request to Monitor Server ...
                </span>
                <input type="text" value="dpdk|  " />
              </a>
            </div>
            <div className="troubleshooting-menu-item">
              <a
                href=""
                className="footer-icon"
                onClick={this.props.clickDownloadGraph}
                title="Save canvas as SVG (does not include search highlighting)"
              >
                <span className="fa fa-download" />
                <span className="description">
                  Save canvas as SVG image
                </span>
              </a>
            </div>
            <div className="troubleshooting-menu-item">
              <a
                href=""
                className="footer-icon"
                title="Reset view state"
                onClick={this.handleClickReset}
              >
                <span className="fa fa-undo" />
                <span className="description">Reset your local view state and reload the page</span>
              </a>
            </div>
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

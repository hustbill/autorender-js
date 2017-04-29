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
    this.state = {value: ''};

    this.handleClickReset = this.handleClickReset.bind(this);
    this.handleClickPost = this.handleClickPost.bind(this);
  }

  handleClickReset(ev) {
    ev.preventDefault();
    this.props.resetLocalViewState();
  }

  handleClickPost(ev) {
    // alert('Post request was submitted: ');
    // const dataStr = 'cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257';
    const blob = new Blob(['cpu_load_short,host=server03,region=us-west value=0.56 1422568543702900258'], {type: 'text/plain'});
    fetch('http://10.145.240.148:8086/write?db=mydb&u=root&p=root', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: blob
//      body: JSON.stringify({
//        firstParam: this.state.value,
//        secondParam: 'yourOtherValue',
//      })
    });


    console.log(this.state.value);
    ev.preventDefault();
    // this.props.resetLocalViewState();
    // this.props.resetLocalViewState();
  }

  render() {
    const reportDownloadUrl = process.env.WEAVE_CLOUD
      ? `${window.location.origin}/api${window.location.pathname}/api/report`
      : 'api/report';
    return (
      <div className="troubleshooting-menu-wrapper">
        <div className="troubleshooting-menu-content">
          <h3>Network Control & Monitor</h3>
          <div className="troubleshooting-menu-item">
            <tr>
              <td>
                <input type="text" value="dpdk|  " />
              </td>
              <td>
                <input type="text" value="Monitor Server" />
              </td>
            </tr>
            <h4>Post Request</h4>
            <tr>
              <td>
                <a
                  className="footer-icon"
                  href={reportDownloadUrl}
                  onClick={this.handleClickPost}
                  title="Post Request to Monitor Server"
                >
                  <span className="fa fa-external-link" />
                  <span className="description">
                    Submit
                  </span>
                </a>
              </td>
              <td>
                <a
                  className="footer-icon"
                  href={reportDownloadUrl}
                  onClick={this.handleClickReset}
                  title="Reset your local view state and reload the page"
                >
                  <span className="fa fa-undo" />
                  <span className="description">
                    Reset
                  </span>
                </a>
              </td>
            </tr>
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

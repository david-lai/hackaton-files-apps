//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The Files Apps view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Dashboard,
  DashboardWidgetLayout,
  DashboardWidgetHeader,
  Title,
  Button
} from 'prism-reactjs';

// Actions
import {
  fetchFsAppData
} from '../actions';

// import image from '../images/DSC_0550.jpg';

const DURATION = 30000;

class FilesApps extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {

    };

    this.renderDashboard = this.renderDashboard.bind(this);
    this.openApp = this.openApp.bind(this);
  }

  // Event handler to open App
  openApp(e) {
    const appUrl = e.currentTarget.getAttribute('data-url');
    window.open(appUrl, '_blank');
  }

  // Returns App dashboard
  renderDashboard(data) {
    const { name, appUrl, imgLink } = data;
    let url = `https://10.48.16.47:9440/${appUrl}`;
    return (
      <div key={ name }>
        <DashboardWidgetLayout
          header={
            <div
              style={
                {
                  margin: '0 auto',
                  padding: '50px 0'
                }
              }
            >
              <DashboardWidgetHeader
                showCloseIcon={ false }
                title={
                  <Title size="h1">
                    {name}
                  </Title>
                }
              />
            </div>
          }
          footer={
            <div
              style={
                {
                  margin: '0 auto',
                  padding: '30px 0'
                }
              }
            >
              <Button data-url={ url } onClick={ this.openApp } >
                Open App
              </Button>
            </div>
          }
          bodyContent={
            <img src={ imgLink } />
          }
          bodyContentProps={
            {
              flexDirection: 'column',
              alignItems: 'stretch'
            }
          }
        />
      </div>
    );
  }


  render() {
    const data = this.props.filesAppsData;
    const pros = {
      layouts: {
        sm: _.map(data, app => {
          return { i: app.name };
        })
      }
    };

    return (
      <Dashboard { ...pros }>
        { _.map(data, app => {
          return this.renderDashboard(app);
        }) }
      </Dashboard>
    );
  }

  // Fetch Apps
  componentWillMount() {
    this.props.fetchFsAppData();
    this.dataPolling = setInterval(
      () => {
        this.props.fetchFsAppData();
      }, DURATION);
  }

  // Stop Polling FS data
  componentWillUnmount() {
    clearInterval(this.dataPolling);
  }
}

const mapStateToProps = state => {
  return {
    filesAppsData: state.groupsapi.filesAppsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFsAppData: () => dispatch(fetchFsAppData())
  };
};

FilesApps.propTypes = {
  fetchFsAppData: PropTypes.func,
  filesAppsData: PropTypes.array
};

// export default FilesApps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesApps);

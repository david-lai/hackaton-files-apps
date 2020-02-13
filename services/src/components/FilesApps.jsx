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
  Button,
  Tooltip
} from 'prism-reactjs';

// Actions
import {
  fetchFsAppData
} from '../actions';

import filesAv from '../images/FilesAv.png';
import filesclean from '../images/FilesClean.png';
import filesAnyn from '../images/FilesAnyn.png';
import filesCustom from '../images/FilesCustom.png';
import filesSearch from '../images/FilesSearch.png';
import FilesMigration from '../images/FilesMigration.png';
import FilesPerformance from '../images/FilesPerformance.png';
import FilesPermission from '../images/FilesPermission.png';

const DURATION = 30000;

const appsProps = {
  files_app_clean: {
    title: 'Delete the files based on size and age',
    desc: `The FilesApps Clean app helps to clean files
      based on size and age with an easy UI interface, this totally avoiding the protocol
      overhead, one do not need to write external scripts to do the same`,
    img: filesclean
  },
  files_app_search: {
    title: 'Search for files and text in share data',
    desc: `The FilesApps Search  app can help you easily
      perform an interactive text search/file search on data stored on the Nutanix Files Platform.
      As data grows exponentially with structured and unstructured Files, customers are often
      unaware of what Files/Data is stored. Customers need to retrieve or take action on files that
      contain specific information to gain business insights or for compliance purposes Files App
      Search lets one to search the Files and Data in Files Platform. The Files Apps Insight app can
      help you easily perform an interactive text search on data stored on the Nutanx Files. The
      file types covered include office, text, pdf’s and zipped folders of these file types. The app
      can be pointed to Nutanix Files Shares.`,
    img: filesSearch
  },
  files_app_anonymize: {
    title: 'Anonymize the files and share',
    desc: `Make your data ready to avoid sharing sensitive
      information, make your files compliance wrt General Data Protection Regulation The IP
      Anonymization feature sets the last octet of IPv4 user IP addresses and the last 80 bits of
      IPv6 addresses to x.x.x.x. The full IP is not leaked. Similarly, SSN's and customer sensive
      information in Anonymized.`,
    img: filesAnyn
  },
  files_app_av: {
    title: 'Run antivirus on files Run antivirus on demand and on files directly',
    desc: `Protecting data on
      your file storage against viruses is important but relying on antivirus sitting outside of
      your NAS environment is inefficient. Moving data over the network for antivirus scans outside
      of your NAS servers adds unnecessary overhead and makes data vulnerable. Now, with the
      integrated AV app offered by Nutanix Files, users can scan the files stored in the Nutanix
      Files DataPlatform directly, without sending the files to an external scanner.`,
    img: filesAv
  },
  files_app_custom: {
    title: 'Create, upload and executed customized script',
    desc: `Creating customized scripts can be complex
      and time-consuming if all script creation elements are not convenient and readily available.
      FilesApps EasyScript provides a rich framework for fast and easy creation, upload, and
      execution of customized scripts while providing access to FilesApps APIs and sample scripts.
      The complexity of setting up the language environment for script creation is removed. There is
      in-app support to search for and leverage APIs and scripts while editing or writing new
      scripts. Scripts can be executed on-demand, on a schedule, or be event-driven. Additionally,
      there is versioning support for scripts to be uploaded.`,
    img: filesCustom
  },
  files_app_permission: {
    title: 'Easy Permission and User Management',
    desc: `One can assign a predefined set of permissions to a group/user, modify the permissions
      for group/user. This is most effective way of setting the permissions without the overhead of
      writing scripts. System with million's of files, writing script takes a lot of time and take
      for ever, this is a easy mechanism to apply the permissions.`,
    img: FilesPermission
  },
  files_app_performance: {
    title: 'Customized Performance Monitoring & Management',
    desc: `Performance Monitoring tool is a system and performance monitoring utility allowing one
      to monitor the CPU usage, memory usage, network transfer rate, operating system performance,
      the status and resource usage of running processes, file system performance, disk space usage,
      disk read activity, disk write activity, disk read transfer rate, disk write transfer rate,
      disk read IOPS and disk write IOPS for individual logical disks or all physical disks
      installed in the computer.`,
    img: FilesPerformance
  },
  files_app_migrate: {
    title: 'Cost-effective Data Migration with zero downtime',
    desc: `Files Migration App is built on a foundation of world-class replication and scanning
      technology that is designed to support nearly all major storage platforms, while meeting the
      needs of IT administrators who want an efficient. Enables you to centralize your backup by
      offering automatic real-time replication from the branch office server to the datacenter`,
    img: FilesMigration
  }
};

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
    const { name, appUrl } = data;
    const url = `https://10.51.48.199:9440/${appUrl}`;
    return (
      <div key={ name }>
        <DashboardWidgetLayout
          header={
            <div
              style={
                {
                  margin: '0 auto',
                  padding: '30px 20px',
                  textShadow: '1px 0px black'
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
                  padding: '35px 20px',
                  textAlign: 'center',
                  width: '100%'
                }
              }
            >
              <Button data-url={ url } onClick={ this.openApp } fullWidth={ true }>
                Open App
              </Button>
              <div
                style={
                  {
                    color: 'green'
                  }
                }>
                <Tooltip theme="light" title={ appsProps[appUrl] && appsProps[appUrl].desc }
                  overlayStyle={
                    {
                      maxWidth: '300px'
                    }
                  }
                >
                  Learn More
                </Tooltip>
              </div>
            </div>
          }
          bodyContent={
            <div
              style={
                {
                  padding: '10px 10px',
                  textAlign: 'center'
                }
              }
            >
              <div>
                <img
                  style={
                    {
                      height: '130px'
                    }
                  }
                  src={ appsProps[appUrl] && appsProps[appUrl].img } />
              </div>
              {appsProps[appUrl] && appsProps[appUrl].title}
            </div>
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
        lg: _.map(data, app => {
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

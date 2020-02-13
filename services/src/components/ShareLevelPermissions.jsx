//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StackingLayout, NavBarLayout, MagGlassIcon, ThemeManager,
  FlexLayout, Checkbox, FormLayout, Select, Button, TextLabel,
  InputPlusLabel, RadioGroup, Radio, Link
} from 'prism-reactjs';

// Actions
import {
  fetchFsData,
  postApp
} from '../actions';

// Helper to translate strings from this module
const DURATION = 30000;

class ShareLevelPermissions extends React.Component {

  static propTypes = {
    fileserver: PropTypes.string,
    path: PropTypes.string,
    recursion: PropTypes.bool,
    allow: PropTypes.string,
    fsData: PropTypes.object,
    fetchFsData: PropTypes.func,
    postApp: PropTypes.func,
    closePermissions: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      fileserver: '',
      path: '',
      username: '',
      recursion: 'true',
      allow: 'true'
    };
    this.handleFsNameChange = this.handleFsNameChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkboxOnClick = this.checkboxOnClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  render() {
    var dataArray = [];
    if (this.props.fsData) {
      const fsName = [];
      for (var i = 0; i < Number(this.props.fsData.total_entity_count); i++) {
        fsName.push(this.props.fsData.group_results[0].entity_results[i].data[0].values[0].values);
      }
      for (var j = 0; j < fsName.length; j++) {
        var data = {
          value: fsName[j][0],
          title: fsName[j][0],
          key: j
        };
        dataArray.push(data);
      }
    }
    const account = <Link type="info">admin@nutanix.com</Link>;
    const header = (
      <StackingLayout>
        <NavBarLayout title="Share Level Permissions" layout={ NavBarLayout.LAYOUTS.LEFT }
          accountInfo={ account }
          prefix={ <MagGlassIcon color={ ThemeManager.getVar('gray-2') } /> } />
      </StackingLayout>
    );

    const body = (
      <StackingLayout>
        <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }>File Server</TextLabel><br />
        <Select
          label="File Server"
          placeholder="Select Option"
          selectOptions={ dataArray }
          dropdownClassName="extra-class"
          className="select-custom-class"
          onChange={ this.handleFsNameChange }
        />
        <InputPlusLabel label="Destination Files directory path" id="path"
          placeholder="e.g. /dir1/"
          onChange={ this.handleInputChange } />
        <InputPlusLabel label="User Name" id="username"
          onChange={ this.handleInputChange } />
        <Checkbox id="recursion" type="toggle" label="Apply Recursively"
          checked={ JSON.parse(this.state.recursion) }
          onChange={ e => { this.checkboxOnClick('recursion', e); } } />
        <RadioGroup defaultValue="allow" id="allow"
          layout="horizontal" onChange={ this.handleOnChange }>
          <Radio value="deny" title="Deny" />
          <Radio value="allow" title="Allow" />
        </RadioGroup>
      </StackingLayout>
    );

    const footer = (
      <FlexLayout itemSpacing="10px" justifyContent="flex-end">
        <Button onClick={ this.handleClickSubmit }>Apply</Button>
      </FlexLayout>
    );

    if (this.props.fsData) {
      return (<div>
        <FormLayout
          contentWidth="600px"
          header={ header }
          body={ body }
          footer={ footer } />
      </div>);
    }
    if (!this.props.fsData) {
      return (<div>No Data</div>);
    }

    // Render Search Details Modal with paginated table
  }

  // Start Polling FS data
  componentWillMount() {
    this.props.fetchFsData();
    this.dataPolling = setInterval(
      () => {
        this.props.fetchFsData();
      }, DURATION);
  }

  // Stop Polling FS data
  componentWillUnmount() {
    clearInterval(this.dataPolling);
  }

  handleOnChange = (e) => {
    this.setState({
      searchType: `${e.target.value}`
    });
  }

  checkboxOnClick = (id, event) => {
    this.setState({ [id]: event.target.checked.toString() });
  }

  onUpload = (event) => {
    this.setState({
      fileNames: event.target.files[0]
    });
  }
  /**
 * Handler for when there is a change to Input component
 * @param {object} e - SyntheticEvent
 */
  handleInputChange = (e) => {
    const attr = e.currentTarget.id;
    const hash = {};
    hash[attr] = e.currentTarget.value;
    this.setState(hash);
  };

  /**
* Handler for when there is a change to directory service
* @param {string} value - New directory service value
*/
  handleFsNameChange = (value) => {
    this.setState({
      fileserver: value
    });
  };

  handleClickSubmit = () => {
    this.props.postApp('permissions', this.state);
    this.props.closePermissions();
  }

  settingsAPI(data) {
    // Groups Query to get all categories by name
    const query = {
      fsNames: data.fsNames,
      search_keyword: data.searchKeyword,
      share_path: data.sharepath,
      search_type: data.searchType
    };
    const configAxios = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return axios.post('http://10.51.148.126:8800/files_app/search', configAxios, query)
      .then((resp) => {
        if (resp.data) {
          this.state.visible = true;
        }

      })
      .catch((err) => {
        // TODO: error details
      });
  }
}
const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFsData: () => dispatch(fetchFsData()),
    postApp: (type, data) => dispatch(postApp(type, data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareLevelPermissions);

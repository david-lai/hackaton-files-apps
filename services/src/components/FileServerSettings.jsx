//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StackingLayout, ElementPlusLabel, NavBarLayout, MagGlassIcon, ThemeManager,
  FlexLayout, FormLayout, Select, Button, TextLabel, InputPlusLabel, Link
} from 'prism-reactjs';
// Actions
import {
  fetchFsData,
  postApp
} from '../actions';

const DURATION = 30000;

class FileServerSettings extends React.Component {
    static propTypes = {
      fileserver: PropTypes.string,
      filepath: PropTypes.string,
      script: PropTypes.string,
      name: PropTypes.string,
      arg: PropTypes.string,
      fsData: PropTypes.object,
      postApp: PropTypes.func,
      fetchFsData: PropTypes.func,
      closeCustom: PropTypes.func
    };

    constructor(props) {
      super(props);
      this.state = {
        fileserver: '',
        filepath: '',
        script: props.script || '',
        name: props.name || '',
        arg: props.arg || ''
      };
      this.handleClickSubmit = this.handleClickSubmit.bind(this);
      this.handleOnChange = this.handleOnChange.bind(this);
      this.handleClickSubmit = this.handleClickSubmit.bind(this);
      this.handleFsNameChange = this.handleFsNameChange.bind(this);
    }

    render() {
      var dataArray = [];
      if (this.props.fsData) {
        let fsName = [];
        for (var i = 0; i < Number(this.props.fsData.total_entity_count); i++) {
          fsName.push(
            this.props.fsData.group_results[0].entity_results[i].data[0].values[0].values);
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
          <NavBarLayout title="Custom Settings" layout={ NavBarLayout.LAYOUTS.LEFT }
            accountInfo={ account }
            prefix={ <MagGlassIcon color={ ThemeManager.getVar('gray-2') } /> } />
        </StackingLayout>
      );

      const body = (
        <StackingLayout>
          <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }>
            Script Upload</TextLabel> &nbsp; &nbsp;
          <input type="file" id="filepath" name="filepath" onChange={ this.onUpload } />
          <ElementPlusLabel
            label="File Server"
            element={
              <Select label="Select Option" placeholder="Select File Server"
                selectOptions={ dataArray }
                onChange={ this.handleFsNameChange }
                multiple={ true }
              />
            }
          />
          <InputPlusLabel label="Script" id="script"
            onChange={ this.handleInputChange } />
          <InputPlusLabel label="Default Arguments" id="arg"
            onChange={ this.handleInputChange } />
          <InputPlusLabel label="Name Of the App" id="name"
            onChange={ this.handleInputChange } />
        </StackingLayout>
      );
      const footer = (
        <FlexLayout itemSpacing="10px" justifyContent="flex-end">
          <Button onClick={ this.handleClickSubmit }>Run</Button>
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
    }

  // Start Polling FS data
    componentWillMount() {
      this.props.fetchFsData();
      this.dataPolling = setInterval(
        () => {
          this.props.fetchFsData();
        }, DURATION);
    }

    handleClickSubmit = () => {
      this.props.postApp('custom', this.state);
      this.props.closeCustom();
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

    onUpload = (event) => {
      this.setState({
        filepath: event.target.files[0].name
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
        fileserver: value.join()
      });
    };
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
)(FileServerSettings);

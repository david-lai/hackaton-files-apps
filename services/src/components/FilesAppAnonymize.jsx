//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The Files App Anonymize view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StackingLayout, ElementPlusLabel, Checkbox, FlexLayout,
  InputPlusLabel, FormLayout, Select, Button
} from 'prism-reactjs';
// Actions
import {
  fetchFsData,
  postApp
} from '../actions';

const DURATION = 30000;

class FilesAppAnonymize extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      fileserver: '',
      path: '',
      outpath: '',
      isip: 'false',
      isssn: 'false',
      srcpat: '',
      dstpat: ''
    };

    this.extractFsData = this.extractFsData.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFsInputChange = this.handleFsInputChange.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  extractFsData() {
    const dataArray = [];
    if (this.props.fsData) {
      let fsName = [];
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
    return dataArray;
  }

  onClickCheckbox(id, e) {
    this.setState({ [id]: e.target.checked.toString() });
  }

  handleInputChange(id, e) {
    this.setState({ [id]: e.currentTarget.value });
  }

  handleFsInputChange(value) {
    this.setState({
      fileserver: value.join()
    });
  }

  handleClickSubmit() {
    this.props.closeAnonymize();
    this.props.postApp('anonymize', this.state);
  }

  showAnonymizeResult() {
    return (
      <div>
        {this.props.anonymizeData}
      </div>
    );
  }

  render() {
    var dataArray = this.extractFsData();

    const header = (
      <StackingLayout>
        <FlexLayout alignItems="center" itemSpacing="10px" padding="20px"
          style={ { backgroundColor: '#22272E' } }>
          <span style={ { color: '#9AA5B5' } }>Files App Anonymize</span>
        </FlexLayout>
      </StackingLayout>
    );

    const body = (
      <StackingLayout>
        <ElementPlusLabel
          label="File Server"
          element={
            <Select label="Select Option" placeholder="Select File Server"
              selectOptions={ dataArray }
              onChange={ this.handleFsInputChange }
              multiple={ true }
            />
          }
        />

        <InputPlusLabel label="Directory Path/File Path" id="path"
          placeholder="e.g. /dir1/" onChange={ e => this.handleInputChange('path', e) } />
        <InputPlusLabel label="Out Directory/File Path" id="outpath" placeholder="e.g. /dir1/"
          onChange={ e => this.handleInputChange('outpath', e) } />
        <FlexLayout itemFlexBasis="100pc">
          <Checkbox id="isip" label="IP Anonymization" checked={ JSON.parse(this.state.isip) }
            onChange={ e => this.onClickCheckbox('isip', e) } />
          <Checkbox id=" isssn" label="SSN" checked={ JSON.parse(this.state.isssn) }
            onChange={ e => this.onClickCheckbox('isssn', e) } />
        </FlexLayout>
        <FlexLayout itemFlexBasis="100pc">
          <InputPlusLabel label="Pattern Reg Expression" id="srcpat"
            onChange={ e => this.handleInputChange('srcpat', e) } />
          <InputPlusLabel label="Replace" id="dstpat"
            onChange={ e => this.handleInputChange('dstpat', e) } />
        </FlexLayout>
        {this.showAnonymizeResult()}
      </StackingLayout>
    );
    const footer = (
      <FlexLayout itemSpacing="10px" justifyContent="center">
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
    return (<div>No data</div>);
  }

  // Fetch Apps
  componentWillMount() {
    this.props.fetchFsData();
    this.dataPolling = setInterval(
      () => {
        this.props.fetchFsData();
      }, DURATION);
  }
}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData,
    anonymizeData: state.groupsapi.anonymizeData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFsData: () => dispatch(fetchFsData()),
    postApp: (type, data) => dispatch(postApp(type, data))
  };
};

FilesAppAnonymize.propTypes = {
  fsData: PropTypes.object,
  anonymizeData: PropTypes.object,
  fetchFsData: PropTypes.func,
  postApp: PropTypes.func,
  closeAnonymize: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesAppAnonymize);


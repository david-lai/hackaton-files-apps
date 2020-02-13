//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Actions
//

import axios from 'axios';
import AppConstants from './../utils/AppConstants';

// ------------
// Action Types
// ------------
export const FETCH_FS = 'FETCH_FS';
export const FETCH_FS_APPS = 'FETCH_FS_APPS';
export const POST_ANONYMIZE = 'POST_ANONYMIZE';
export const POST_PERMISSION = 'POST_PERMISSION';
export const POST_CUSTOM = 'POST_CUSTOM';

export const fetchFsData = () => {
  return async(dispatch) => {
    const query = {
      entity_type: 'file_server_service',
      group_member_sort_attribute: 'name',
      group_member_sort_order: 'ASCENDING',
      group_member_offset: 0,
      group_member_attributes: [
        {
          attribute: 'name'
        },
        {
          attribute: 'cluster'
        },
        {
          attribute: 'nvm_uuid_list'
        },
        {
          attribute: 'afs_version'
        },
        {
          attribute: 'cluster_uuid'
        }
      ]
    };
    const resp = await axios.post(AppConstants.APIS.GROUPS_API, query);

    dispatch({
      type: FETCH_FS,
      payload: resp.data
    });
  };
};

export const fetchFsAppData = () => {
  return async(dispatch) => {
    const query = {
      'entity_type': 'files_app_db',
      'group_member_sort_attribute': 'name',
      'group_member_sort_order': 'ASCENDING',
      'group_member_offset': 0,
      'group_member_attributes': [
        {
          'attribute': 'name'
        },
        {
          'attribute': 'url_link'
        },
        {
          'attribute': 'image_link'
        }
      ]
    };
    const resp = await axios.post(AppConstants.APIS.GROUPS_API, query);

    dispatch({
      type: FETCH_FS_APPS,
      payload: resp.data
    });
  };
};

export const postApp = (type, payload) => {
  return async(dispatch) => {
    let api;
    let apiType;
    if (type === 'anonymize') {
      api = AppConstants.APIS.ANONYMIZE_API;
      apiType = POST_ANONYMIZE;
    } else if (type === 'permissions') {
      api = AppConstants.APIS.PERMISSION_API;
      apiType = POST_PERMISSION;
    } else if (type === 'custom') {
      api = AppConstants.APIS.CUSTOM_API;
      apiType = POST_CUSTOM;
    }
    const resp = await axios.post(api, payload);

    dispatch({
      apiType,
      payload: resp || {}
    });
  };
};

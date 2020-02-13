//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//
import _ from 'lodash';
// Actions
import {
  FETCH_FS,
  FETCH_FS_APPS,
  POST_ANONYMIZE,
  POST_PERMISSION,
  POST_CUSTOM
} from '../actions/groupsapis';

/**
 * Modals redurer
 * @param {Object} state - Current state.
 * @param {Object} action - Action
 * @returns {Object} - New state
 */
function groupsapis(state = {}, action) {
  const { payload = {} } = action;

  switch (action.type) {
    case FETCH_FS:
      return {
        ...state,
        fsData: payload
      };
    case POST_ANONYMIZE:
      return {
        ...state,
        anonymizeData: payload
      };
    case POST_PERMISSION:
      return {
        ...state,
        permissionData: payload
      };
    case POST_CUSTOM:
      return {
        ...state,
        customData: payload
      };
    case FETCH_FS_APPS:
      const data = _.map(payload.group_results[0].entity_results, result => {
        const { data } = result;
        return {
          name: data[0].values[0].values[0],
          appUrl:data[1].values[0].values[0],
          imgLink: data[2].values[0].values[0]
        };
      });
      return {
        ...state,
        filesAppsData: data
      };
    default:
      return state;
  }
}

export default groupsapis;

import { fromJS } from 'immutable';
import * as types from '../constants';

const initialState = {
  source: null,
  fetching: false,
};

const fool = (state = fromJS(initialState), action) => {
  switch (action.type) {

    case types.POST_SOURCE:
      return state.merge({ fetching: true });

    case types.POST_SOURCE_SUCCESS:
      return state.merge({
        source: action.payload.source,
        fetching: false,
      });

    default:
      return state;
  }
};

export default fool;

import * as types from'../constants'
import { List, Map, fromJS } from 'immutable';

const initialState = {
    source: null,
    fetching: false
}

const fool = (state = fromJS(initialState), action) => {
    switch (action.type) {

        case types.POST_SOURCE:
        return state.merge({ fetching: true })

        case types.POST_SOURCE_SUCCESS:
        return state.merge({
            source: action.payload.source,
            fetching: false
        })

        default:
        return state
    }
}

export default fool;

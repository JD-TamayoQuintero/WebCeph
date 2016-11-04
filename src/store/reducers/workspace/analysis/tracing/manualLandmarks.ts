import assign from 'lodash/assign';
import omit from 'lodash/omit';
import { handleActions } from 'redux-actions';
import { Event, StoreKeys } from 'utils/constants';
import { printUnexpectedPayloadWarning } from 'utils/debug';

type ManualLandmarks = StoreEntries.workspace.analysis.tracing.landmarks.manual;

const KEY_MANUAL_LANDMARKS = StoreKeys.manualLandmarks;
const defaultState: ManualLandmarks = { };

const manualLandmarksReducer = handleActions<
  ManualLandmarks,
  Payloads.addManualLandmark | Payloads.removeManualLandmark
>(
  {
    [Event.ADD_MANUAL_LANDMARK_REQUESTED]: (state: ManualLandmarks, { type, payload }: Action<Payloads.addManualLandmark>) => {
      if (payload === undefined) {
        printUnexpectedPayloadWarning(type, state);
        return state;
      }
      if (state[payload.symbol] !== undefined) {
        __DEBUG__ && console.warn(
          'Attempted to add a landmark that already exists, this is a bug!'
        );
        return state;
      }
      return assign(
        { },
        state,
        {
          [payload.symbol]: payload.value,
        },
      );
    },
    [Event.REMOVE_MANUAL_LANDMARK_REQUESTED]: (state: ManualLandmarks, { type, payload: symbol }: Action<Payloads.removeManualLandmark>) => {
      if (symbol === undefined) {
        printUnexpectedPayloadWarning(type, state);
        return state;
      }
      if (state[symbol] === undefined) {
        __DEBUG__ && console.warn(
          'Attempted to remove a landmark that does not exist, this is a bug!'
        );
        return state;
      }
      return omit(state, symbol) as ManualLandmarks;
    },
    [Event.RESET_WORKSPACE_REQUESTED]: () => defaultState,
  },
  defaultState,
);

export default {
  [KEY_MANUAL_LANDMARKS]: manualLandmarksReducer,
};

export const getManualLandmarks = (state: GenericState) => {
  return state[KEY_MANUAL_LANDMARKS] as ManualLandmarks;
};
import { SHOW_HOME, SHOW_SETTING, SHOW_NEWS } from "./action";

const initialState = {
  currentNews: {},
  currentPage: SHOW_HOME
};

const MenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_HOME:
      return Object.assign({}, state, {
        currentPage: SHOW_HOME,
        currentNews: {}
      });
    case SHOW_SETTING:
      return Object.assign({}, state, {
        currentPage: SHOW_SETTING,
        currentNews: {}
      });
    case SHOW_NEWS:
      return Object.assign({}, state, {
        currentPage: SHOW_NEWS,
        currentNews: action.news
      });
    default:
      return state;
  }
};

export default MenuReducer;

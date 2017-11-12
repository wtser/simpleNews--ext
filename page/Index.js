import React from "react";
import styled, { injectGlobal } from "styled-components";
import { createStore } from "redux";
//import { connect,Provider } from 'react-redux'
import { Menu } from "../component/Menu/";
import Welcome from "../component/Welcome";
import Content from "../component/Content";
import Setting from "../component/Setting";

injectGlobal`
body{margin:0;

    color: #3c484e;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
    font-size: 14px;
    line-height: 1.6em;
    font-weight: 400;
    font-style: normal;
    letter-spacing: 0;
    text-rendering: optimizeLegibility;
}
`;
const Grid = styled.div`
  display: grid;
  grid-template: 1fr/200px 1fr;
  height: 100vh;
`;
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, {}, props.store.getState().MenuReducer);
    props.store.subscribe(() => {
      this.setState(props.store.getState().MenuReducer);
    });
  }
  render() {
    return this.state.currentPage == SHOW_HOME
      ? <Welcome {...this.props} />
      : this.state.currentPage == SHOW_SETTING
        ? <Setting {...this.props} />
        : <Content {...this.props} />;
  }
}
import AllReducer from "./reducer";
import { SHOW_HOME, SHOW_SETTING } from "../component/Menu/action";
const store = createStore(AllReducer);

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Grid>
        <Menu store={store} />
        <Page store={store} />
      </Grid>
    );
  }
}

export default Index;

import React from "react";
import { newsList } from "../../fakeData";
import { SHOW_NEWS, SHOW_SETTING, SHOW_HOME } from "./action";
import styled from "styled-components";

const MenuBox = styled.div`
  border-right: 1px solid #cdd3dc;
  background-color: #e3e7ed;
  display: grid;
  grid-template: 100px 1fr 50px/1fr;
  height: 100vh;
`;
const MenuList = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
  overflow: auto;

  li {
    cursor: pointer;
    border: 1px solid #e3e7ed;
    border-left: 0;
    border-right: 0;
    display: block;
    padding: 4px 10px 4px 15px;
    color: #555;
  }
`;
const ActiveItem = styled.li`
  border-color: #cdd3dc !important;
  background-color: #d8dce4;
`;

const Setting = styled.div`padding: 15px;`;
const Logo = styled.div`padding: 15px;`;
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {},
      { data: newsList, currentNews: {} },
      props.store.getState().MenuReducer
    );

    props.store.subscribe(() => {
      this.setState(props.store.getState().MenuReducer);
    });
  }
  render() {
    const { store } = this.props;
    return (
      <MenuBox>
        <Logo onClick={() => store.dispatch({ type: SHOW_HOME })}>LOgo</Logo>
        <MenuList>
          {this.state.data.map(n => {
            return this.state.currentNews == n
              ? <ActiveItem
                  onClick={() => {
                    store.dispatch({ type: SHOW_NEWS, news: n });
                  }}
                >
                  {n.name}
                </ActiveItem>
              : <li
                  onClick={() => {
                    store.dispatch({ type: SHOW_NEWS, news: n });
                  }}
                >
                  {n.name}
                </li>;
          })}
        </MenuList>
        <Setting onClick={() => store.dispatch({ type: SHOW_SETTING })}>
          config
        </Setting>
      </MenuBox>
    );
  }
}
export default Menu;

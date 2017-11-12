import React from "react";

import styled from "styled-components";
const Grid = styled.div`
  display: grid;
  align-content: center;
  justify-content: center;
`;
class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Grid>
        <ul>
          <li>首页设置</li>
          <li>新闻设置</li>
        </ul>
      </Grid>
    );
  }
}
export default Setting;

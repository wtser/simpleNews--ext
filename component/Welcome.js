import React from "react";
import styled from "styled-components"
const Tip = styled.div`
    display:flex;
        align-items: center;
    justify-content: center;
`
class Welcome extends React.Component {
    render(){
        return (
            <Tip>
                <h2>Welcome</h2>
            </Tip>
        )
    }
}
export default Welcome;
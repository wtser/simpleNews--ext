import React from "react";
import { newsDetail } from "../fakeData";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: newsDetail
    };

      let url = this.props.store.getState().MenuReducer.currentNews.url;
    this.props.store.subscribe(() => {
      if (this.props.store.getState().MenuReducer.currentNews.url) {
        this.fetchHtml(url).then(html=>{
            console.log(html)
        });
      }
    });
  }

  componentDidMount() {
      let url = this.props.store.getState().MenuReducer.currentNews.url;
      this.fetchHtml(url).then(html=>{
          console.log(html)
      });
  }
  render() {
    return (
      <ul>
        <p>
          {this.props.store.getState().MenuReducer.currentNews.name}
        </p>
        {this.state.data.map(d => {
          return (
            <li>
              <a href={d.url}>
                {d.title}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
   fetchHtml(url) {
    return new Promise((resolve,rejext)=>{
        fetch(url)
            .then(response => {
                return response.text();
            })
            .then(html => {
                resolve(html)
            });
    })
  }
  parseHtml(html){

  }
}
export default Content;

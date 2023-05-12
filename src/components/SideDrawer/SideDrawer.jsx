import React, { Component } from "react";
import axios from "axios";
import "./SideDrawer.css";
import LoList from "../videoComponent/loList/loList";

import "font-awesome/css/font-awesome.min.css";
require("dotenv").config();

class sideDrawer extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    toc: [],
    urls: [],
    currentURL: "",
    nextURLs: [],
    drawerClasses: " side-drawer ",
    items: [],
    isOpen: false,
    subIsOpen: false
  };

  changeVideoSource = newSrc => {
    this.props.changeVideoSource(newSrc);
  };
  componentDidMount() {
    //const query = new URLSearchParams(window.location.search);
    axios
      .get(
        `${process.env.scubeURL}/api/adaptedCourse/C01/L01/toc`
      )
      .then(res => {
        this.setState({
          toc: res.data.topics
        });
        console.log(res.data);
      })
      .catch(err => {
        // handle err
      });
  }

  clickHandler = () => {
    this.setState(prev => {
      return { isOpen: !prev.isOpen };
    });
  };

  clickHandlerSub = () => {
    this.setState(prev => {
      return { subIsOpen: !prev.subIsOpen };
    });
  };

  render() {
    var { isOpen, subIsOpen } = this.state;
    if (this.props.show) {
      this.state.drawerClasses = "side-drawer open";

      console.log({ props: this.state.toc });
    }
    return (
      <div className={this.state.drawerClasses}>
        <h3 className="text-center mt-2 ">Table of content: </h3>
        {this.state.toc.map(item => (
          <ul class="nav flex-column pmd-sidebar-nav">
            <li class="nav-item open">
              <span
                href="javascript:;"
                className="nav-link nav-link-parent "
                style={{ "background-color": "black" }}
                onClick={this.clickHandler}
              >
                <i class="menu-icon fa fa-th"></i> {item.title}{" "}
                <i class="fa fa-chevron-down"></i>
              </span>
              {isOpen
                ? item.subTopics.map(sub => (
                    <ul class="menu-siderbar-child nav flex-column">
                      <li class="nav-item">
                        <span
                          href="javascript:;"
                          className="nav-link active bg-dark "
                          style={{ "margin-left": "40px" }}
                          onClick={this.clickHandlerSub}
                        >
                          {sub.title} <i class="fa fa-chevron-down"></i>
                        </span>
                        <ul class="menu-siderbar-child nav flex-column">
                          {subIsOpen
                            ? sub.subSubTopics.map(
                                subsub => (
                                  this.state.urls.push(subsub.url),
                                  (
                                    <li
                                      style={{ "padding-left": "55px" }}
                                      onClick={() => {
                                        this.changeVideoSrc(subsub.url);
                                        this.setState({
                                          currentURL: subsub.url
                                        });
                                      }}
                                    >
                                      <span
                                        role="button"
                                        className="d-block"
                                        style={{ "background-color": "black" }}
                                      ></span>
                                    </li>
                                  )
                                )
                              )
                            : null}
                        </ul>
                      </li>
                    </ul>
                  ))
                : null}
            </li>
          </ul>
        ))}
      </div>
      /*  <SideMenu>
      {this.state.toc.map(item => (
       <Item divider={true} label={item.title} value={item.title}>
       {item.subTopics.map(sub => (
       <Item label={sub.title} icon="fa-search">
          {sub.subSubTopics.map(
             subsub => (
             <Item label={subsub.title} value={subsub.title}icon="fa-snapchat">
        </Item>
        ))}
        </Item>
        ))}
        </Item>
        ))}
        </SideMenu>  */
      /*   <LoList
            changeVideoSource={this.props.changeVideoSource}
            videoSource={this.props.lo[0]}
            lo={ this.props.lo}           />
               */
    );
  }
}

export default sideDrawer;

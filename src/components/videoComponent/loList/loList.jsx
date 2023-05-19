import React, { Component } from "react";
import "./loListStyle.css";

import CustomizedListItem from "./CustomizedListItem";

class loList extends Component {
  state = {
    currentURL: "",
    nextURLs: [],
  };

  changeVideoSource(x) {
    this.props.changeVideoSource(x);
  }
  changeSelectedVideoIndex(x) {
    this.props.changeSelectedVideoIndex(x);
  }

  handleUrlChange = (x) => {
    this.props.handleUrlChange(x);
  };

  componentDidMount() {
    // this.handleUrlChange(this.props.newUrls);
    // console.log(this.props.newUrls)
  }

  render() {
    return (
      <div
        className="shadow-sm d-inline-block "
        style={{
          width: "100%",
          height: "100%",
          borderBottom: "1px solid rgba(0,0,0,.12)",
          maxWidth: "350px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        ></div>

        {this.props.isCoursePlayer ? (
          <div
            className="group pl-2 col-sm "
            style={{
              marginRight: "0",
              marginTop: "0",
              color: "#000",
              backgroundColor: "white",
              overflowY: "auto",
            }}
          >
            {" "}
            <CustomizedListItem
              style={{ height: "100%", width: "100%" }}
              className="d-inline-block w-100"
              toc={this.props.toc}
              isCoursePlayer={this.props.isCoursePlayer}
              changeSelectedIndex={this.props.changeSelectedIndex}
              changeVideoSource={this.props.changeVideoSource}
              changeTopicTitle={this.props.changeTopicTitle}
              previousHandler={this.previousHandler}
              nextHandler={this.nextHandler}
              selectedListIndex={this.props.selectedListIndex}
              selectedListIndexChangeHandler={
                this.props.selectedListIndexChangeHandler
              }
              updateNavigationCounter={this.props.updateNavigationCounter}
              selectedListItemIndex={this.props.selectedListItemIndex}
              selectedListItemIndexChangeHandler={
                this.props.selectedListItemIndexChangeHandler
              }
              headers={this.props.headers}
              nextOrPrev={this.props.nextOrPrev}
              nextOrPrevHandler={this.props.nextOrPrevHandler}
              onSummaryClick={this.props.onSummaryClick}
            />
          </div>
        ) : (
          <div
            className="group pl-2 col-sm "
            style={{
              marginRight: "0",
              marginTop: "0",
              color: "#000",
              backgroundColor: "white",
              overflowY: "auto",
            }}
          >
            {" "}
            <CustomizedListItem
              style={{ height: "100%", width: "100%" }}
              className="d-inline-block w-100"
              //
              isCoursePlayer={this.props.isCoursePlayer}
              toc={this.props.toc}
              selectedLanguage={this.props.textLanguage}
              changeLanguage={this.props.changeLanguage}
              changeSelectedIndex={this.props.changeSelectedIndex}
              changeVideoSource={this.props.changeVideoSource}
              changeTopicTitle={this.props.changeTopicTitle}
              changeSelectedVideoIndex={this.props.changeSelectedVideoIndex}
              handleUrlChange={this.props.handleUrlChange}
              previousHandler={this.previousHandler}
              nextHandler={this.nextHandler}
              selectedListIndex={this.props.selectedListIndex}
              selectedListIndexChangeHandler={
                this.props.selectedListIndexChangeHandler
              }
              selectedListItemIndex={this.props.selectedListItemIndex}
              selectedListItemIndexChangeHandler={
                this.props.selectedListItemIndexChangeHandler
              }
              headers={this.props.headers}
              nextOrPrev={this.props.nextOrPrev}
              nextOrPrevHandler={this.props.nextOrPrevHandler}
              updateTranscriptCount={this.props.updateTranscriptCount}
              onTranscriptClick={this.props.onTranscriptClick}
              onSummaryClick={this.props.onSummaryClick}
            />
          </div>
        )}
      </div>
    );
  }
}

export default loList;

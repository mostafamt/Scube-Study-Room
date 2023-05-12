import React from "react";
import styles from "./modal.module.scss";
import LoList from "../../videoComponent/loList/loList";

const Modal = (props) => {
  return (
    props.show && (
      <div className={styles.modal}>
        <LoList
          isCoursePlayer={props.isCoursePlayer}
          toc={props.toc}
          selectedLanguage={props.selectedLanguage}
          urls={props.urls}
          changeVideoSource={props.changeVideoSource}
          videoSource={props.videoSource}
          data={{ lo: props.lo }}
          handleUrlChange={props.handleUrlChange}
          changeTopicTitle={props.changeTopicTitle}
          changeSelectedIndex={props.changeSelectedIndex}
          topicHeader={props.topicHeader}
          los={props.los}
          selectedListIndex={props.selectedListIndex}
          selectedListIndexChangeHandler={props.selectedListIndexChangeHandler}
          updateNavigationCounter={props.updateNavigationCounter}
          // onLanguageSelect={props.onLanguageSelect this.onLanguageSelect.bind(this)}
          changeSelectedVideoIndex={props.changeSelectedVideoIndex}
          selectedListItemIndex={props.selectedListItemIndex}
          selectedListItemIndexChangeHandler={
            props.selectedListItemIndexChangeHandler
          }
          headers={props.headers}
          nextOrPrev={props.nextOrPrev}
          nextOrPrevHandler={props.nextOrPrevHandler}
          updateTranscriptCount={props.updateTranscriptCount}
          onSummaryClick={props.onSummaryClick}
          changeLanguage={props.changeLanguage}
        />
      </div>
    )
  );
};

export default Modal;

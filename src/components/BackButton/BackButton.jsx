import React from "react";
import BackIcon from "../Icons/BackIcon";
import styles from "./backButton.module.scss";

const BackButton = (props) => {
  return (
    <a className={styles.backBtn} href={props.to}>
      <BackIcon />
      <span>Back</span>
    </a>
  );
};

export default BackButton;

import React from "react";
import styles from "./breadcrumbs.module.scss";

const Breadcrumbs = ({ titles }) => {
  const renderTitles = () => {
    return titles
      .filter((title) => title)
      .map((title, idx) => {
        if (idx === 0) {
          return <span key={idx}>{title}</span>;
        } else {
          return <span key={idx}>{` / ${title}`}</span>;
        }
      });
  };

  return (
    <div className={styles.breadcrumbs}>
      <div className="container">{renderTitles()}</div>
    </div>
  );
};

export default Breadcrumbs;

import React from "react";
import MenuIcon from "../Icons/MenuIcon";
import styles from "./navbar.module.scss";
import logo from "../../Assets/scube.png";

const Navbar = (props) => {
  return (
    <div className="container">
      <div className={styles.navbar}>
        <button onClick={props.onClick}>
          <MenuIcon />
        </button>
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
};

export default Navbar;

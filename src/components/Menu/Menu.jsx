import { IconButton } from "@material-ui/core";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";

const Menu = (props) => {
  return (
    <IconButton
      aria-label="menu"
      onClick={props.onClick}
      style={{ marginLeft: "1rem" }}
    >
      <MenuIcon />
    </IconButton>
  );
};

export default Menu;

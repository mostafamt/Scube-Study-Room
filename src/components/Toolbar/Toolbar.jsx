import React from "react";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import "./Toolbar.css";

const toolbar = props => (
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <DrawerToggleButton click={props.drawerClickHandler} />
    <h5 className="text-danger ml-3 mt-2">EduEdge</h5>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav m-auto">
        <li class="nav-item active">
          <a class="nav-link navvv" href="#">
            Home <span class="sr-only">(currendkdkdkdkt)</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            Features
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            Pricing
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

export default toolbar;

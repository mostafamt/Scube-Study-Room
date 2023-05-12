import React from 'react'
import eduedgeLogo from './EduEdge logo.png';

function NavBar() {
    return ( 
    <div>

<nav className="navbar navbar-dark bg-light navbar-expand-sm border-bottom shadow-sm fixed  " >


  <a className="navbar-brand ml-3" href="#">
      <img  title="EduEdge" src={eduedgeLogo} alt="EduEdge" style={{width: '35px'}} className="d-inline-block"></img>
  </a>


  <div className=" navbar-collapse" id="navbarSupportedContent">
  <ul className="navbar-nav mr-auto">
    <li className="nav-item">
        <a className="nav-link text-danger" href="/ontology">EduEdge</a>
      </li>
   </ul>
   
  </div>
</nav>

        </div>
    )
}

export default NavBar;
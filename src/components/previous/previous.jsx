import React, { Component } from "react";
import "./previous.css";
// import v from '../videoComponent/Obj2.mp4' ; 
class Previous extends Component {
  render() {
    return this.props.srcs.map((s)=>(
       <div className=" videos-prev col-lg-3">
      <video height="200" width="100%" controls  >
        <source src={s} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  ));
}  
  
}
export default Previous;
 
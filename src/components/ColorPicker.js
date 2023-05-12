import React from "react"

import { SketchPicker } from "react-color"
import reactCSS from "reactcss"
import Tooltip from "@material-ui/core/Tooltip"
import color1 from "./color.jpg"
class ColorPicker extends React.Component {
  state = {
    showPicker: false,
    color: { r: "255", g: "255", b: "255", a: "1" },
  }

  onClick = () => {
    this.setState({
      showPicker: !this.state.showPicker,
    })
  }

  onClose = () => {
    this.setState({
      showPicker: false,
    })
  }

  onChange = (color) => {
    this.setState({
      color: color.rgb,
    })

    document.querySelector(".div-text").style.backgroundColor = color.hex
  }

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "10px",
          height: "10px",
          borderRadius: "1px",
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
        },
        popover: {
          position: "absolute",
          zIndex: "3",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
        swatch: {
          padding: "1px",
          background: "#ffffff",
          cursor: "pointer",
          display: "inline-block",
        },
      },
    })

    return (
      <Tooltip title="background color picker">
        <div>
          <div style={styles.swatch} onClick={this.onClick}>
            <img src={color1} width="15px" height="15px" />
          </div>

          {this.state.showPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={this.onClose} />
              <SketchPicker color={this.state.color} onChange={this.onChange} />
            </div>
          ) : null}
        </div>
      </Tooltip>
    )
  }
}

export default ColorPicker

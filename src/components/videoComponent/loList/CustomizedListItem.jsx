import React from "react";
import "./loListStyle.css";
//import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { Divider } from "@material-ui/core";
import MList from "./MList/MList";

class CustomizedListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      arr: [true],
      count: 0,
      selectedInex: 0,
      arrURL: [],
      nextOrPrev: false,
      isClicked: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleClick() {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  changeTopicTitle(x, y = "") {
    this.props.changeTopicTitle(x, y);
  }

  // handleUrlChange = (x) => {
  //   this.props.handleUrlChange(x)
  // }

  handleItemClick(index) {
    if (!this.state.arr[index]) this.state.arr[index] = false;
    const x = !this.state.arr[index];
    this.state.arr[index] = x;
    this.setState({ arr: this.state.arr });
  }

  changeVideoSource = (loId, lang) => {
    this.props.changeVideoSource(loId, lang);
  };

  changeLanguage = (lang) => {
    this.props.changeLanguage(lang);
  };

  changeSelectedVideoIndex(x) {
    this.props.changeSelectedVideoIndex(x);
  }
  changeSelectedIndex(x) {
    this.props.changeSelectedIndex(x);
  }

  changeIndexHandler = (x) => {
    this.props.headers.forEach((header, cou) => {
      if (header === x) {
        this.props.changeSelectedIndex(cou);
      }
    });
  };

  getList = (list) => {
    console.log(list);
    let { selectedListItemIndex, selectedListIndex } = this.props;
    if (list)
      return list.map((item, index) => (
        <div key={index}>
          <ListItem
            button
            key={item.title}
            onClick={() => this.handleItemClick(index)}
            selected={true} // To highlight the list head also  ex: Stack, Abstract Data Type
          >
            <ListItemText
              primary={item.title}
              styel={{ wordBreak: "break-word", fontSize: "larger" }}
            />
            {this.state.arr[index] | (selectedListIndex === item.title) ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>
          <Collapse
            key={index}
            in={this.state.arr[index] || selectedListIndex === item.title}
            timeout="auto"
            unmountOnExit
          >
            <List component="li" disablePadding>
              {(item.objects || item.subTopics).map((obj, index2) => {
                if (obj)
                  return (
                    <div>
                      <ListItem
                        selected={selectedListItemIndex === obj.title}
                        button
                        key={obj.id}
                        primary={obj.title}
                        onClick={() => this.handleItemClick(index)}
                      >
                        <ListItemIcon>
                          {obj.id !== "" ? (
                            <PlayCircleOutlineIcon />
                          ) : (
                            <HighlightOffIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          styel={{ wordBreak: "break-word" }}
                          key={this.state.count++}
                          primary={obj.title}
                          onClick={(e) => {
                            this.changeIndexHandler(obj.title);
                            this.props.selectedListItemIndexChangeHandler(
                              obj.title
                            );
                            this.changeTopicTitle(obj.title, item.title);
                            this.changeVideoSource(obj.LOid || obj.id);
                            this.props.updateNavigationCounter();
                          }}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  );
              })}
              {this.getList(item.children)}
            </List>
          </Collapse>
        </div>
      ));
  };

  renderList = () => {
    return <MList />;
  };

  render() {
    console.log(this.props);
    return <MList {...this.props} />;
  }
}

export default CustomizedListItem;

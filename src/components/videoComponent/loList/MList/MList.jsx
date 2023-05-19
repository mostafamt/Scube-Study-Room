import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import StarBorder from "@material-ui/icons/StarBorder";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";

import styles from "./mList.module.scss";
import { CodeSharp } from "@material-ui/icons";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  subnested: {
    paddingLeft: theme.spacing(8),
  },
}));

const MList = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [list, setList] = React.useState([]);

  const handleClick = (title) => {
    console.log("title= ", title);
    console.log("list= ", list);
    const newList = list.map((item, idx) => {
      if (item.title === title) {
        return {
          ...item,
          open: !item.open,
        };
      } else if (item?.children) {
        const newItems = item?.children?.map((subItem, subIdx) => {
          if (subItem?.title === title) {
            return {
              ...subItem,
              open: !subItem.open,
            };
          }
          return subItem;
        });
        return {
          ...item,
          children: newItems,
        };
      }
      return item;
    });
    console.log("newList= ", newList);
    setList(newList);
    setOpen(!open);
  };

  const appendStateToList = (list) => {
    const newList = list.map((item, idx) => {
      if (item?.children?.length) {
        const newItem = item?.children?.map((subItem, subIndex) => {
          return { ...subItem, open: false };
        });
        return {
          ...item,
          children: [...newItem],
          open: false,
        };
      }
      return item;
    });
    return newList;
  };

  React.useEffect(() => {
    if (props.toc?.length) {
      const newList = appendStateToList(props.toc);
      setList(newList);
    }
  }, [props.toc]);

  const changeIndexHandler = (x) => {
    props.headers.forEach((header, cou) => {
      if (header === x) {
        props.changeSelectedIndex(cou);
      }
    });
  };

  const changeTopicTitle = (x, y = "") => {
    props.changeTopicTitle(x, y);
  };

  const changeVideoSource = (loId, lang) => {
    props.changeVideoSource(loId, lang);
  };

  const onClickTopicHandler = (subItem, item) => {
    console.log("hell9o");
    changeIndexHandler(subItem?.title);
    props.selectedListItemIndexChangeHandler(subItem?.title);
    changeTopicTitle(subItem.title, item.title);
    changeVideoSource(subItem.LOid || subItem.id);
    props.updateNavigationCounter();
  };

  const showIcon = (subItem) => {
    let result = <></>;
    if (subItem?.objects?.length) {
      if (subItem?.open) {
        result = <ExpandLess />;
      } else {
        result = <ExpandMore />;
      }
    }
    return result;
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          content
        </ListSubheader>
      }
      className={classes.root}
    >
      {list?.map((item, idx) => (
        <>
          <ListItem button onClick={() => handleClick(item?.title)}>
            <ListItemText primary={item?.title} />
            {item.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          {item.children.length &&
            item.children.map((subItem, subIndex) => (
              <Collapse in={item.open} timeout="auto" unmountOnExit>
                <List component="div">
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={() => handleClick(subItem?.title)}
                  >
                    <ListItemText primary={subItem?.title} />
                    {showIcon(subItem)}
                  </ListItem>
                  {subItem?.objects?.length
                    ? subItem.objects.map((it, sIdx) => (
                        <>
                          <Collapse
                            in={subItem.open}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div">
                              <ListItem
                                button
                                className={classes.subnested}
                                onClick={() => onClickTopicHandler(it, subItem)}
                              >
                                <ListItemIcon>
                                  <PlayCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary={it?.title} />
                              </ListItem>
                            </List>
                          </Collapse>
                          {subItem.open && <Divider />}
                        </>
                      ))
                    : null}
                </List>
              </Collapse>
            ))}
        </>
      ))}
    </List>
  );
};

export default MList;

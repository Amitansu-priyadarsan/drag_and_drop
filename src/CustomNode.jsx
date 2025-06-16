import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./CustomNode.module.css";

export const CustomNode = (props) => {
  const { id, text } = props.node;
  const { depth, isOpen, onToggle, isAdding, onAdd, onCancelAdd, isHighlighted } = props;
  const indent = depth * 24;
  const [newText, setNewText] = useState("");

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(id);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    props.onStartAdd(id);
  };
  
  const handleSave = () => {
    if (newText) {
      onAdd(id, newText);
      setNewText("");
    }
  };

  const handleCancel = () => {
    onCancelAdd();
    setNewText("");
  };

  const handleInputChange = (e) => {
    setNewText(e.target.value);
  };
  
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.root} ${
          props.isDragging ? styles.draggingSource : ""
        } ${isHighlighted ? styles.highlight : ""}`}
        style={{ paddingInlineStart: indent }}
      >
        <div className={styles.expandIconWrapper} onClick={handleToggle}>
          {props.node.droppable &&
            (isOpen ? <ArrowDropDownIcon /> : <ArrowRightIcon />)}
        </div>
        <div className={styles.labelGridItem}>
          <Typography variant="body2">{text}</Typography>
        </div>
        <IconButton size="small" onClick={handleAddClick} aria-label={`Add child to ${text}`}>
          <AddIcon />
        </IconButton>
      </div>
      {isAdding && (
        <div className={styles.addNodeForm} style={{ paddingLeft: indent + 24 }}>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Enter node name..."
              value={newText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
              InputProps={{
                  endAdornment: (
                      <>
                          <Button onClick={handleSave} size="small">Save</Button>
                          <Button onClick={handleCancel} size="small">Cancel</Button>
                      </>
                  )
              }}
            />
        </div>
      )}
    </div>
  );
};

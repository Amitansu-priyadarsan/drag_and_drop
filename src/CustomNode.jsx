import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./CustomNode.module.css";

export const CustomNode = (props) => {
  const { id, text, droppable } = props.node;
  const {
    depth,
    isOpen,
    onToggle,
    isAdding,
    onStartAdd,
    onAdd,
    onCancelAdd,
    isLastChild,
    isDragging,
  } = props;
  const [newText, setNewText] = useState("");

  const indent = depth * 48; // Increased indent for spacing

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(id);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    onStartAdd(id);
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
    if (e.key === "Enter") handleSave();
    else if (e.key === "Escape") handleCancel();
  };

  return (
    <Box
      className={`${styles.container} ${isLastChild ? styles.isLastChild : ""} ${
        isDragging ? styles.isDragging : ""
      }`}
      style={{ marginLeft: indent }}
    >
      <Box className={styles.nodeContent}>
        <Box className={styles.nodeBox}>
          <IconButton
            size="small"
            onClick={handleToggle}
            className={styles.toggleButton}
          >
            {droppable && (isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />)}
          </IconButton>
          <Typography variant="body2" className={styles.nodeText}>
            {text}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleAddClick}
          className={styles.addButton}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {isAdding && (
        <Box className={styles.addNodeForm}>
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
                  <Button onClick={handleSave} size="small">
                    Save
                  </Button>
                  <Button onClick={handleCancel} size="small">
                    Cancel
                  </Button>
                </>
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
};

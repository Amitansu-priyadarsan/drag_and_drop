import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Box,
  TextField,
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
  const indentPx = depth * 48;

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

  return (
    <Box
      className={`
        ${styles.container}
        ${isLastChild ? styles.isLastChild : ""}
        ${isDragging  ? styles.isDragging  : ""}
      `}
      style={{
        marginLeft: indentPx,
        "--nodeIndent": `${indentPx}px`,
      }}
    >
      <Box className={styles.nodeContent}>
        <Box className={styles.nodeBox}>
          <IconButton size="small" onClick={handleToggle} className={styles.toggleButton}>
            {droppable && (isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />)}
          </IconButton>
          <Typography variant="body2" className={styles.nodeText}>
            {text}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleAddClick} className={styles.addButton}>
          <AddIcon />
        </IconButton>
      </Box>

      {isAdding && (
        <Box
          className={`${styles.container} ${styles.isLastChild}`}
          style={{
            marginLeft: indentPx + 48,
            "--nodeIndent": `${indentPx + 48}px`,
          }}
        >
          <Box className={styles.nodeContent}>
            <Box className={`${styles.nodeBox} ${styles.highlight}`}>
              <TextField
                autoFocus
                fullWidth
                variant="standard"
                size="small"
                placeholder="Enter node name..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  else if (e.key === "Escape") handleCancel();
                }}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    padding: '0 8px',
                    fontFamily: '"Inter", sans-serif',
                    color: '#121214',
                    fontSize: '14px',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

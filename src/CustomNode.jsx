import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DiamondAddIconTransform } from "./DiamondAddIcon";
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
    onDelete,
    onEdit,
    isDropTarget,
  } = props;

  const [newText, setNewText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  
  const indentPx = depth * 48;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(id);
  };

  const handleAddButtonHover = (e) => {
    e.stopPropagation();
    setIsHovering(true);
    onStartAdd(id);
  };

  const handleAddButtonLeave = (e) => {
    e.stopPropagation();
    setIsHovering(false);
    if (!isFocused) {
      onCancelAdd();
      setNewText("");
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsFocused(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!newText.trim()) {
      handleCancel();
    }
  };

  const handleSave = () => {
    if (newText) {
      onAdd(id, newText);
      setNewText("");
      setIsHovering(false);
      setIsFocused(false);
    }
  };

  const handleCancel = () => {
    onCancelAdd();
    setNewText("");
    setIsHovering(false);
    setIsFocused(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEditSave = () => {
    if (editText && editText !== text && onEdit) {
      onEdit(id, editText);
    }
    setIsEditing(false);
  };

  return (
    <Box
      className={`
        ${styles.container}
        ${isLastChild ? styles.isLastChild : ""}
        ${isDragging ? styles.isDragging : ""}
      `}
      style={{
        marginLeft: indentPx,
        "--nodeIndent": `${indentPx}px`,
        marginTop: '40px',
      }}
    >
      <Box className={styles.nodeContent}>
        <Box className={styles.nodeBox}>
          <IconButton size="small" onClick={handleToggle} className={styles.toggleButton}>
            {droppable && (isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />)}
          </IconButton>
          
          {isEditing ? (
            <TextField
              autoFocus
              fullWidth
              variant="standard"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave();
                else if (e.key === "Escape") setIsEditing(false);
              }}
              InputProps={{
                disableUnderline: true,
                className: styles.editInput
              }}
            />
          ) : (
            <>
              <Typography variant="body2" className={styles.nodeText}>
                {text}
              </Typography>
              <Box className={styles.floatingMenu}>
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  sx={{ color: "#F8F8FB" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <Box className={styles.divider} />
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{ color: "#F8F8FB" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
        
        <Box 
          className={styles.addButtonWrapper}
          onMouseEnter={handleAddButtonHover}
          onMouseLeave={handleAddButtonLeave}
          onClick={handleAddClick}
        >
          <IconButton 
            size="small" 
            className={styles.addButton}
          >
            <DiamondAddIconTransform color="#121214" />
          </IconButton>
        </Box>
      </Box>

      {isDropTarget && (
        <Box
          className={`${styles.container} ${styles.isLastChild}`}
          style={{
            marginLeft: indentPx + 48,
            "--nodeIndent": `${indentPx + 48}px`,
            opacity: 1,
            visibility: 'visible',
            transition: 'all 0.2s ease',
            marginTop: '8px',
          }}
        >
          <Box className={styles.nodeContent}>
            <Box 
              className={`${styles.nodeBox} ${styles.dropPreview}`}
            >
              <Typography variant="body2" className={styles.hintText}>
                Drop here
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {(isHovering || isFocused) && isAdding && (
        <Box
          className={`${styles.container} ${styles.isLastChild}`}
          style={{
            marginLeft: indentPx + 48,
            "--nodeIndent": `${indentPx + 48}px`,
            opacity: 1,
            visibility: 'visible',
            transition: 'all 0.2s ease',
            marginTop: '40px',
          }}
        >
          <Box className={styles.nodeContent}>
            <Box 
              className={`
                ${styles.addNodeBox} 
                ${isFocused ? styles.highlight : styles.hintBox}
              `}
            >
              <TextField
                autoFocus={isFocused}
                fullWidth
                variant="standard"
                size="small"
                
                value={isFocused ? newText : ""}
                onChange={(e) => setNewText(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  else if (e.key === "Escape") handleCancel();
                }}
                InputProps={{
                  disableUnderline: true,
                  readOnly: !isFocused,
                  style: {
                    padding: '0 8px',
                    fontFamily: '"Inter", sans-serif',
                    color: isFocused ? '#121214' : '#999',
                    fontSize: '14px',
                    fontStyle: isFocused ? 'normal' : 'italic',
                    cursor: 'text',
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

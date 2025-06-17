import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Box,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  } = props;

  const [newText, setNewText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  // Menu handlers
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(id);
    }
    handleMenuClose();
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
              <IconButton
                size="small"
                className={styles.menuButton}
                onClick={handleMenuOpen}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
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

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className={styles.nodeMenu}
        >
          <MenuItem onClick={handleEditClick}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>

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
                ${styles.nodeBox} 
                ${styles.highlight}
                ${!isFocused ? styles.hintBox : ''}
              `}
            >
              {isFocused ? (
                <TextField
                  autoFocus
                  fullWidth
                  variant="standard"
                  size="small"
                  placeholder="Enter node name..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
              ) : (
                <Box className={styles.hintText}>Enter a node</Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

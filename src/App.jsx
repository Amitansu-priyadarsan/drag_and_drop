import React, { useState, useRef } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { theme } from "./theme";
import styles from "./App.module.css";
import initialData from "./sample_data.json";
import { saveTree } from "./api";

function App() {
  const [treeData, setTreeData] = useState(initialData);
  const [addingToParent, setAddingToParent] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const treeRef = useRef(null);

  const handleDrop = (newTree) => setTreeData(newTree);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  const handleDeleteNode = (id) => {
    const newTree = treeData.filter(node => node.id !== id);
    setTreeData(newTree);
  };

  const handleEditNode = (id, newText) => {
    const newTree = treeData.map(node => 
      node.id === id ? { ...node, text: newText } : node
    );
    setTreeData(newTree);
  };

  const handleSaveAll = async () => {
    try {
      await saveTree(treeData);
      // You can add a success notification here, e.g., using a snackbar.
      alert("Tree structure saved successfully!");
    } catch (error) {
      // You can add an error notification here.
      alert("Failed to save tree structure.");
      console.error(error);
    }
  };

  const handleStartAdd = (parentId) => {
    setAddingToParent(parentId);
    treeRef.current?.open(parentId);
  };

  const handleCancelAdd = () => {
    setAddingToParent(null);
  };

  const handleAddNode = (parentId, text) => {
    const newNode = {
      id: Date.now(), // In a real app, use a more robust ID generation.
      parent: parentId,
      text,
      droppable: true,
    };

    setTreeData([...treeData, newNode]);
    setAddingToParent(null);

    // Highlight the new node briefly
    setHighlightedNode(newNode.id);
    setTimeout(() => {
      setHighlightedNode(null);
    }, 2000); // Highlight for 2 seconds
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Box className={styles.app}>
          <Box className={styles.header}>
            <Typography variant="h6" className={styles.headerTitle}>
              Hierarchy tree
            </Typography>
            <Box className={styles.headerControls}>
              <Typography variant="body2" className={styles.nodeCountLabel}>
                Groups created:
              </Typography>
              <Typography variant="body2" className={styles.nodeCount}>
                {treeData.length}
              </Typography>
            </Box>
          </Box>
          <Box className={styles.treeContainer}>
            <Tree
              ref={treeRef}
              tree={treeData}
              rootId={0}
              initialOpen
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              classes={{
                root: styles.treeRoot,
                draggingSource: styles.draggingSource,
              }}
              render={(node, { depth, isOpen, onToggle, isDropTarget }) => {
                const children = treeData.filter((n) => n.parent === node.parent);
                const isLastChild = children[children.length - 1].id === node.id;

                return (
                  <CustomNode
                    node={node}
                    depth={depth}
                    isOpen={isOpen}
                    onToggle={onToggle}
                    isAdding={addingToParent === node.id}
                    onStartAdd={handleStartAdd}
                    onAdd={handleAddNode}
                    onCancelAdd={handleCancelAdd}
                    isHighlighted={highlightedNode === node.id}
                    isLastChild={isLastChild}
                    isDragging={isDragging}
                    onDelete={handleDeleteNode}
                    onEdit={handleEditNode}
                    isDropTarget={isDropTarget}
                  />
                );
              }}
              dragPreviewRender={(monitorProps) => (
                <CustomDragPreview monitorProps={monitorProps} />
              )}
            />
          </Box>
          <Box className={styles.footer}>
            <Button
              variant="outlined"
              onClick={() => setTreeData(initialData)}
              className={styles.footerButton}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAll}
              className={styles.footerButton}
            >
              Save
            </Button>
          </Box>
        </Box>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;

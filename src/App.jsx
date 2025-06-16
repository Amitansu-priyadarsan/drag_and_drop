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
  const treeRef = useRef(null);

  const handleDrop = (newTree) => setTreeData(newTree);

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
            <Typography variant="h6">Hierarchy tree</Typography>
            <Button variant="contained" onClick={handleSaveAll}>
              Save All
            </Button>
          </Box>
          <Tree
            ref={treeRef}
            tree={treeData}
            rootId={0}
            initialOpen
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget,
            }}
            render={(node, { depth, isOpen, onToggle }) => (
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
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
          />
        </Box>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;

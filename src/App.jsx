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
import ConnectorOverlay from "./ConnectorOverlay";
import { theme } from "./theme";
import styles from "./App.module.css";
import initialData from "./sample_data.json";
import { saveTree } from "./api";

export const CONNECTOR_GAP = 12;   // same number you used in CSS

function App() {
  const [treeData, setTreeData] = useState(initialData);
  const [addingToParent, setAddingToParent] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const treeRef        = useRef(null);
  const containerRef   = useRef(null);        // <Box className={styles.treeContainer}>
  const nodeRefs       = useRef({});          // { [id]: DOMElement }

  /* --- DnD handlers ---------------------------------------------- */
  const handleDrop       = (newTree) => setTreeData(newTree);
  const handleDragStart  = () => setIsDragging(true);
  const handleDragEnd    = () => setIsDragging(false);

  /* --- CRUD ------------------------------------------------------- */
  const handleDeleteNode = (id) =>
    setTreeData((t) => t.filter((n) => n.id !== id));

  const handleEditNode   = (id, text) =>
    setTreeData((t) => t.map((n) => (n.id === id ? { ...n, text } : n)));

  const handleSaveAll    = async () => {
    try {
      await saveTree(treeData);
      alert("Tree structure saved successfully!");
    } catch (err) {
      alert("Failed to save tree structure.");
      console.error(err);
    }
  };

  const handleStartAdd   = (parentId) => {
    setAddingToParent(parentId);
    treeRef.current?.open(parentId);
  };
  const handleCancelAdd  = () => setAddingToParent(null);

  const handleAddNode = (parentId, text) => {
    const newNode = {
      id: Date.now(),
      parent: parentId,
      text,
      droppable: true,
    };
    setTreeData((t) => [...t, newNode]);
    setAddingToParent(null);
    setHighlightedNode(newNode.id);
    setTimeout(() => setHighlightedNode(null), 2000);
  };

  /* --- helper to attach a ref per node ---------------------------- */
  const bindNodeRef = (id) => (el) => {
    if (el) nodeRefs.current[id] = el;
    else delete nodeRefs.current[id];             // cleanup on unmount
  };

  /* --- render ----------------------------------------------------- */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Box className={styles.app}>
          {/* ---------- header ------------------------------------ */}
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

          {/* ---------- tree  ------------------------------------- */}
          <Box
            ref={containerRef}
            className={styles.treeContainer}
            sx={{ position: "relative" }}        /* needed for absolute SVG */
          >
            {/* SVG underlay */}
            <ConnectorOverlay
              gap={CONNECTOR_GAP}
              treeData={treeData}
              nodeRefs={nodeRefs}
              containerRef={containerRef}
              addingId={addingToParent}   
            />

            {/* Actual interactive tree */}
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
                const siblings   = treeData.filter((n) => n.parent === node.parent);
                const isLastChild = siblings[siblings.length - 1].id === node.id;

                return (
                  <CustomNode
                    ref={bindNodeRef(node.id)}
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

          {/* ---------- footer ------------------------------------ */}
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

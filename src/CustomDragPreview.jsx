import React from "react";
import styles from "./CustomDragPreview.module.css";

export const CustomDragPreview = ({ monitorProps }) => {
  const item = monitorProps.item;
  return (
    <div className={styles.root}>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
}; 
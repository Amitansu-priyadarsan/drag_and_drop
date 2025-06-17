import React from 'react';
import AddIcon from '@mui/icons-material/Add';

// Transform approach: rotate container and counter-rotate icon
export const DiamondAddIconTransform = ({ size = 24, color = '#121214', ...props }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(45deg)', // Rotate container 45 degrees
        margin: Math.floor(size * 0.2), // Add some margin to prevent clipping
      }}
    >
      <AddIcon
        style={{
          transform: 'rotate(-45deg)', // Counter-rotate icon to keep it upright
          color: color,
          fontSize: Math.floor(size * 0.8), // Slightly smaller than container
        }}
        {...props}
      />
    </div>
  );
};

// Clip-path approach: use polygon to create diamond shape
export const DiamondAddIconClipPath = ({ size = 24, color = '#121214', ...props }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        margin: Math.floor(size * 0.2), // Add some margin to prevent clipping
      }}
    >
      <AddIcon
        style={{
          color: color,
          fontSize: Math.floor(size * 0.8), // Slightly smaller than container
        }}
        {...props}
      />
    </div>
  );
}; 
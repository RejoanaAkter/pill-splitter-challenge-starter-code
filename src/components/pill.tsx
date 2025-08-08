import React from 'react';

export default function Pill({ pill, index, onDrag }) {
  // This function runs when the user starts dragging (mouse down)
  const handleMouseDown = (e) => {
    // Prevent the event from bubbling up (important for parent handlers)
    e.stopPropagation();

    // This function runs every time the mouse moves while dragging
    const handleMouseMove = (moveEvent) => {
      // Call the onDrag function passed from parent with current index, event, and pill data
      onDrag(index, moveEvent, pill);
    };

    // This function runs when the user releases the mouse button (stops dragging)
    const handleMouseUp = () => {
      // Remove the event listeners since dragging ended
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach event listeners for dragging and release on the whole document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      // When user presses mouse button down on this pill, start dragging
      onMouseDown={handleMouseDown}
      data-part
      className="absolute border border-black cursor-move"
      style={{
        left: pill.x,          // Position from the left
        top: pill.y,           // Position from the top
        width: pill.width,     // Width of the pill
        height: pill.height,   // Height of the pill
        backgroundColor: pill.color,  // Pill color
        borderRadius: '20px',  // Rounded corners with radius 20px
      }}
    />
  );
}

import React, { useState, useRef } from 'react';
import Pill from './components/Pill';
import SplitLines from './components/SplitLines';
import {
  getRandomColor,
  splitPill,
} from './utils/pillUtils';

const MIN_PILL_SIZE = 40;  // Minimum size when creating a new pill
const MIN_PART_SIZE = 20;  // Minimum size of a pill part after splitting

// Global counter to give unique IDs to each pill or pill part
let pillIdCounter = 1;

function App() {
  // Store all pills (each pill is an object with position, size, color, id)
  const [pills, setPills] = useState([]);

  // Store the pill currently being created (when user is dragging)
  const [creating, setCreating] = useState(null);

  // Store current cursor position relative to container (for split lines)
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Store mouse down position to distinguish between click and drag
  const [mouseDownPos, setMouseDownPos] = useState(null);

  // Ref for the container element to calculate cursor position correctly
  const containerRef = useRef(null);

  // Called when mouse moves inside container
  const handleMouseMove = (e) => {
    // Get container position and size to calculate relative cursor position
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update cursor position state (used for split lines and splitting)
    setCursor({ x, y });

    // If user is currently creating a pill (dragging), update its width and height
    if (creating) {
      setCreating((prev) => ({
        ...prev,
        // Width and height should be at least MIN_PILL_SIZE
        width: Math.max(MIN_PILL_SIZE, x - prev.x),
        height: Math.max(MIN_PILL_SIZE, y - prev.y),
      }));
    }
  };

  // Called when mouse button is pressed down inside container
  const handleMouseDown = (e) => {
    // If user clicked on an existing pill part, ignore (we handle drag elsewhere)
    if (e.target.dataset.part) return;

    // Calculate cursor position relative to container
    const rect = containerRef?.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Start creating a new pill with initial size MIN_PILL_SIZE x MIN_PILL_SIZE
    setCreating({
      x,
      y,
      width: MIN_PILL_SIZE,
      height: MIN_PILL_SIZE,
      color: getRandomColor(),  // Assign random color to pill
      id: pillIdCounter++,      // Assign unique id
    });

    // Save mouse down position to detect drag vs click on mouse up
    setMouseDownPos({ x, y });
  };

  // Called when mouse button is released inside container
  const handleMouseUp = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const upX = e.clientX - rect.left;
    const upY = e.clientY - rect.top;

    // Check if mouse moved enough between down and up to count as a drag
    const wasDrag =
      mouseDownPos &&
      (Math.abs(upX - mouseDownPos.x) > 5 || Math.abs(upY - mouseDownPos.y) > 5);

    if (creating) {
      // If creating a new pill, add it to the pills array
      setPills((prev) => [...prev, creating]);
      setCreating(null);  // Reset creating state
    } else if (!wasDrag) {
      // If it was a click (no drag), try splitting pills at cursor position
      handleClickSplit();
    }

    // Reset mouseDownPos after mouse up
    setMouseDownPos(null);
  };

  // Handle splitting pills that intersect with the current cursor position
const handleClickSplit = () => {
  setPills((prevPills) => {
    return prevPills.flatMap((pill) => {
      // Check if cursor is inside the pill bounds
      const intersects =
        cursor.x > pill.x &&
        cursor.x < pill.x + pill.width &&
        cursor.y > pill.y &&
        cursor.y < pill.y + pill.height;

      if (!intersects) {
        // If cursor not inside this pill, keep the pill as is
        return pill;
      }

      // If cursor is inside pill, split it into parts
      // splitPill returns an array of new parts (or nudged pill if can't split)
      return splitPill(pill, cursor, pillIdCounter++);
    });
  });
};

  // Handle dragging a pill part by updating its position
  const handleDrag = (index, e, pill) => {
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate new position so cursor is centered on the pill part
    const offsetX = e.clientX - rect.left - pill.width / 2;
    const offsetY = e.clientY - rect.top - pill.height / 2;

    // Update the pills array with the moved pill's new position
    setPills((prev) => {
      const newPills = [...prev];
      newPills[index] = { ...pill, x: offsetX, y: offsetY };
      return newPills;
    });
  };

  return (
    <div
      className="relative w-full h-screen bg-gray-100 overflow-hidden"
      ref={containerRef}  // Reference to container div
      onMouseMove={handleMouseMove}  // Track cursor position & pill size while creating
      onMouseDown={handleMouseDown}  // Start creating pill or drag pills
      onMouseUp={handleMouseUp}      // Finish creating pill or split pills on click
    >
      {/* Show vertical and horizontal split lines at cursor */}
      <SplitLines cursor={cursor} />

      {/* Render all existing pills and the pill currently being created */}
      {[...pills, creating].filter(Boolean).map((pill, i) => (
        <Pill
          key={pill.id || i}
          pill={pill}
          index={i}
          onDrag={handleDrag}  // Pass drag handler to pill component
        />
      ))}
    </div>
  );
}

export default App;

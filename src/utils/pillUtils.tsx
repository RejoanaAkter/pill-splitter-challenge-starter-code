// Generate a random color using HSL format
export const getRandomColor = () => {
  // Random hue value between 0 and 359
  const hue = Math.floor(Math.random() * 360);
  // Return HSL color with fixed saturation and lightness for bright pastel colors
  return `hsl(${hue}, 75%, 70%)`;
};

// Minimum size allowed for each pill part (width or height)
const MIN_PART_SIZE = 20;

// Check if we can split the pill vertically at cursorX
export const on_SplitVertically = (pill, cursorX) => {
  // Pill width must be at least twice the minimum size (so it can split into two parts)
  // And the cursor must be inside the pill's horizontal bounds
  return (
    pill.width >= 2 * MIN_PART_SIZE &&
    cursorX > pill.x &&
    cursorX < pill.x + pill.width
  );
};

// Check if we can split the pill horizontally at cursorY
export const on_SplitHorizontally = (pill, cursorY) => {
  // Pill height must be at least twice the minimum size
  // And the cursor must be inside the pill's vertical bounds
  return (
    pill.height >= 2 * MIN_PART_SIZE &&
    cursorY > pill.y &&
    cursorY < pill.y + pill.height
  );
};

// Split the pill into two parts based on cursor position
// nextIdStart is used to assign unique IDs to the new parts
export const splitPill = (pill, cursor, nextIdStart) => {
  const parts = [];

  // First, try splitting vertically if possible
  if (on_SplitVertically(pill, cursor.x)) {
    // Calculate widths of the left and right parts
    const leftWidth = Math.max(MIN_PART_SIZE, cursor.x - pill.x);
    const rightWidth = pill.width - leftWidth;

    // Left part keeps original x and gets leftWidth
    parts.push({
      ...pill,
      width: leftWidth,
      id: nextIdStart++,  // assign new unique id
    });

    // Right part moves x to right edge of left part and gets rightWidth
    parts.push({
      ...pill,
      x: pill.x + leftWidth,
      width: rightWidth,
      id: nextIdStart++,  // assign new unique id
    });

    return parts;
  }

  // If can't split vertically, try splitting horizontally
  if (on_SplitHorizontally(pill, cursor.y)) {
    // Calculate heights of the top and bottom parts
    const topHeight = Math.max(MIN_PART_SIZE, cursor.y - pill.y);
    const bottomHeight = pill.height - topHeight;

    // Top part keeps original y and gets topHeight
    parts.push({
      ...pill,
      height: topHeight,
      id: nextIdStart++,
    });

    // Bottom part moves y to bottom edge of top part and gets bottomHeight
    parts.push({
      ...pill,
      y: pill.y + topHeight,
      height: bottomHeight,
      id: nextIdStart++,
    });

    return parts;
  }

  // If the pill is too small to split either way,
  // just move it slightly (nudge) so it doesn't overlap the split line
  const nudged = { ...pill };
  if (pill.width < 2 * MIN_PART_SIZE) {
    // If too narrow, move right by 10 pixels
    nudged.x += 10;
  } else {
    // Otherwise, move down by 10 pixels
    nudged.y += 10;
  }

  // Return the nudged pill as an array with one item
  return [nudged];
};


export default function SplitLines({ cursor }) {
  return (
    <>
      {/* Vertical Line */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-gray-500 pointer-events-none z-50"
        style={{ left: `${cursor.x}px` }}
      />

      {/* Horizontal Line */}
      <div
        className="absolute left-0 right-0 h-[1px] bg-gray-500 pointer-events-none z-50"
        style={{ top: `${cursor.y}px` }}
      />
    </>
  );
}

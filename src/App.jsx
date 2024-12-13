import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.8,
      parentId: null,
    },
  ]);

  const handleAddBlock = (parentId) => {
    const newBlock = {
      id: blocks.length + 1, // Sequential ID
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.8,
      parentId: parentId,
    };
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  const handleDrag = (e, id) => {
    const blockElement = e.target.closest(".block");
    const offsetX = e.clientX - blockElement.getBoundingClientRect().left;
    const offsetY = e.clientY - blockElement.getBoundingClientRect().top;

    const onMouseMove = (event) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === id
            ? { ...block, x: event.clientX - offsetX, y: event.clientY - offsetY }
            : block
        )
      );
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {blocks.map((block) => (
        <React.Fragment key={block.id}>
          {/* Line connecting to parent */}
          {block.parentId && (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width="100%"
              height="100%"
            >
              <line
                x1={blocks.find((b) => b.id === block.parentId)?.x + 50}
                y1={blocks.find((b) => b.id === block.parentId)?.y + 50}
                x2={block.x + 50}
                y2={block.y + 50}
                stroke="black"
                strokeDasharray="4"
                strokeWidth="2"
              />
            </svg>
          )}

          {/* Draggable Block */}
          <div
            className="block absolute bg-blue-500 text-white p-4 rounded-lg cursor-grab"
            style={{ left: block.x, top: block.y, width: "100px", height: "100px" }}
            onMouseDown={(e) => handleDrag(e, block.id)}
          >
            <p>Block {block.id}</p>
            <p className="text-sm">Parent: {block.parentId || "None"}</p>
            <button
              className="mt-2 bg-white text-blue-500 px-2 py-1 rounded"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering drag
                handleAddBlock(block.id);
              }}
            >
              +
            </button>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default App;

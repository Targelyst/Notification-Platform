// components/SimpleEmailBuilder/SharedIcons.tsx
import React from "react";

export const DragHandleIcon = () => (
  <svg
    className="w-4 h-4 cursor-move"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export const TrashIcon = () => (
  <svg
    className="w-4 h-4 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 10v10c0 1.1046.8954 2 2 2h8c1.1046 0 2-.8954 2-2V10M9 10v10m6-10v10M5 6h14M10 6V4c0-1.1046.8954-2 2-2s2 .8954 2 2v2"
    />
  </svg>
);

export const AddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="absolute left-0 -ml-6 opacity-0 group-hover:opacity-100 transition-opacity"
    onClick={onClick}
  >
    +
  </button>
);

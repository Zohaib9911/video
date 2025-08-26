import React, { useState, useRef, useEffect } from "react";

export default function UserMenu({ displayName, onSignOut }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const initials = (displayName || "").trim().slice(0, 2).toUpperCase() || "U";

  return (
    <div ref={menuRef} className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-2 bg-white/90 hover:bg-white text-gray-800 rounded-full px-3 py-1 shadow"
      >
        <span className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
          {initials}
        </span>
        <span className="text-sm max-w-[140px] truncate">{displayName}</span>
      </button>
      {open ? (
        <div className="mt-2 w-44 bg-white rounded-md shadow-lg border p-1">
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

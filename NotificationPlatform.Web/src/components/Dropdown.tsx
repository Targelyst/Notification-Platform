import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  targetRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown = ({ targetRef, isOpen, children, className }: DropdownProps) => {
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (targetRef.current && dropdownRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = dropdownRef.current.offsetHeight || 200;

        setPosition(spaceBelow > dropdownHeight + 16 ? "bottom" : "top");
      }
    };

    if (isOpen) calculatePosition();
    window.addEventListener("resize", calculatePosition);
    return () => window.removeEventListener("resize", calculatePosition);
  }, [targetRef, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${position === "bottom" ? "mt-1" : "mb-1 bottom-full"} 
        left-0 w-full min-w-[140px] ${className} z-50`}
    >
      {children}
    </div>
  );
};

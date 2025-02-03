import { useState, useEffect, useRef } from "react";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

interface UserWidgetProps {
	isMenuOpen: boolean;
	toggleMenu: () => void;
	menuRef: React.RefObject<HTMLDivElement>;
	showFull: boolean;
}

interface DropdownProps {
	targetRef: React.RefObject<HTMLElement>;
	isOpen: boolean;
	children: React.ReactNode;
}

const Dropdown = ({ targetRef, isOpen, children }: DropdownProps) => {
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

		calculatePosition();
		window.addEventListener("resize", calculatePosition);
		return () => window.removeEventListener("resize", calculatePosition);
	}, [targetRef]);

	if (!isOpen) return null;

	return (
		<div
			ref={dropdownRef}
			className={`absolute ${position === "bottom" ? "mt-1" : "mb-1 bottom-full"} 
        right-0 w-full min-w-[160px] bg-stone-600/30 backdrop-blur-sm rounded-md shadow-lg
        border border-stone-500/30 z-50`}
		>
			{children}
		</div>
	);
};

export const UserWidget = ({
	isMenuOpen,
	toggleMenu,
	menuRef,
	showFull,
}: UserWidgetProps) => {
	const [localIsOpen, setLocalIsOpen] = useState(false);
	const widgetRef = useRef<HTMLDivElement>(null);

	const handleToggle = () => {
		toggleMenu();
		setLocalIsOpen(!localIsOpen);
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={handleToggle}
				className="flex items-center space-x-2 group w-full p-2 rounded-lg 
          transition-colors text-stone-300 hover:bg-stone-600/20 hover:text-stone-100"
			>
				<div className="relative">
					<div
						className="w-7 h-7 rounded-full bg-stone-400/10 border border-stone-400/20 
            flex items-center justify-center shadow-xs"
					>
						<FiUser className="w-3.5 h-3.5 text-stone-300" />
					</div>
					<div
						className="absolute bottom-0.5 right-0 w-2 h-2 rounded-full bg-green-400 
            border border-stone-700/50"
					/>
				</div>
				{showFull && (
					<>
						<span className="text-sm ">Artur OG</span>
						<FiChevronDown
							className={`text-stone-400/80 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
						/>
					</>
				)}
			</button>

			<Dropdown targetRef={widgetRef} isOpen={isMenuOpen}>
				<div className="p-1 space-y-0.5">
					<button
						type="button"
						className="w-full flex items-center p-1.5 rounded-md transition-colors 
            text-sm text-stone-300 hover:bg-stone-500/20 hover:text-stone-100 space-x-2"
					>
						<FiSettings className="w-3.5 h-3.5 text-stone-300" />
						<span>Account Settings</span>
					</button>
					<button
						type="button"
						className="w-full flex items-center p-1.5 rounded-md transition-colors 
            text-sm text-stone-300 hover:bg-stone-500/20 hover:text-stone-100 space-x-2"
					>
						<FiLogOut className="w-3.5 h-3.5 text-stone-300" />
						<span>Log Out</span>
					</button>
				</div>
			</Dropdown>
		</div>
	);
};

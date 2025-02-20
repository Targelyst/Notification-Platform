import { useState, useEffect, useRef } from "react";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

interface UserWidgetProps {
	isMenuOpen: boolean;
	toggleMenu: () => void;
	menuRef: React.RefObject<HTMLDivElement>;
	showFull: boolean;
	className?: string;
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
        left w-full min-w-[140px] bg-impolar-bg-surface rounded-lg shadow-lg
        border  border-impolar-bg-highlight z-50`}
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
	className = ""
}: UserWidgetProps) => {
	const [localIsOpen, setLocalIsOpen] = useState(false);
	const widgetRef = useRef<HTMLDivElement>(null);

	const handleToggle = () => {
		toggleMenu();
		setLocalIsOpen(!localIsOpen);
	};

	return (
		<div className={`relative ${className}`} ref={menuRef}>
			<button
				type="button"
				onClick={handleToggle}
				className="flex items-center space-x-2  group w-full p-2 rounded-lg 
          transition-colors  hover:bg-impolar-bg-highlight/95 hover:text-impolar-bg-highlight-text"
			>
				<div className="relative">
					<div
						className="w-8 h-8 rounded-full bg-radial-[at_40%_40%] from-impolar-primary via-impolar-primary to-impolar-secondary to-90% 
            flex items-center justify-center shadow-xs "
					>
						<FiUser className="w-3.5 h-3.5 text-impolar-bg-surface-text" />
					</div>
					<div
						className="absolute bottom-0.5 right-0 w-2 h-2 rounded-full bg-green-400 
            border border-bg-impolar-bg-highlight/50"
					/>
				</div>
				{showFull && (
					<>
						<span className="text-sm text-impolar-bg-highlight-text">Artur OG</span>
						<FiChevronDown
							className={`text-impolar-bg-highlight-text transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
						/>
					</>
				)}
			</button>

			<Dropdown targetRef={widgetRef} isOpen={isMenuOpen}>
				<div className="p-2 space-y-0.5 text-impolar-bg-surface-text">
					<button
						type="button"
						className="m-2 w-full flex items-center p-1.5 rounded-md transition-colors 
            text-sm  hover:bg-impolar-bg-highlight/20 hover:text-impolar-bg-highlight-text space-x-2"
					>
						<FiSettings className="w-3.5 h-3.5 " />
						<span>Settings</span>
					</button>
					<button
						type="button"
						className=" m-2 w-full flex items-center p-1.5 rounded-md transition-colors 
            text-sm  hover:bg-impolar-bg-highlight/20 hover:text-impolar-bg-highlight-text space-x-2"
					>
						<FiLogOut className="w-3.5 h-3.5 " />
						<span>Log Out</span>
					</button>
				</div>
			</Dropdown>
		</div>
	);
};

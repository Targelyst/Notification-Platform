import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	FiMenu,
	FiX,
	FiSettings,
	FiLifeBuoy,
	FiChevronDown,
} from "react-icons/fi";
import { GoProjectTemplate  } from "react-icons/go";
import { NavigationRoutes } from "../NavigationRoutes";
import { UserWidget } from "../components/UserWidget";
import { useAvailableProjects, useCurrentProject } from "../api/projects";

interface SidebarProps {
	isMobile: boolean;
	isUserMenuOpen: boolean;
	openSubmenus: Record<string, boolean>;

	setIsUserMenuOpen: (open: boolean) => void;
	toggleSubmenu: (path: string) => void;
}

const Sidebar = ({
	isMobile,
	openSubmenus,
	toggleSubmenu,
	isUserMenuOpen,
	setIsUserMenuOpen,
}: SidebarProps) => {
	const { t } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();

	const [{ data: availableProjects }] = useAvailableProjects();
	const { currentProject, setCurrentProject } = useCurrentProject();

	const [isLocalUserMenuOpen, setIsLocalUserMenuOpen] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	const onProjectAdd = () => {
		console.warn("Add project is not implemented.");
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setIsLocalUserMenuOpen(false);
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [setIsUserMenuOpen]);

	return (
		<nav className="flex flex-col h-full space-y-1">
			<div className="mb-4 relative" ref={userMenuRef}>
				<div
					className="flex items-center bg-impolar-bg-highlight justify-between p-2 rounded-lg cursor-pointer hover:bg-impolar-bg-highlight transition-colors"
					onKeyDown={() => setIsUserMenuOpen(!isUserMenuOpen)}
				>
					<div className="flex items-center space-x-2">
						<div className="bg-radial-[at_10%_40%] from-impolar-primary via-impolar-primary to-impolar-secondary to-90% p-1.5 rounded-lg">
							<GoProjectTemplate className="w-4 h-4 text-impolar-primary-text" />
						</div>
						{currentProject ? (
							<span className="font-medium text-impolar-bg-highlight-text text-sm">
								{currentProject.name}
							</span>
						) : (
							<span>Loading</span>
						)}
					</div>
					<FiChevronDown
						className={`text-impolar-primary-text transform transition-transform ${
							isUserMenuOpen ? "rotate-180" : ""
						}`}
						onClick={(e) => {
							e.stopPropagation();
							setIsUserMenuOpen(!isUserMenuOpen);
						}}
					/>
				</div>

				{/* Simplified Dropdown Menu */}
				<div
					className={`absolute w-full z-10 ${isUserMenuOpen ? "block" : "hidden"}`}
				>
					<div className="bg-impolar-bg-surface rounded-lg shadow-lg border border-impolar-bg-highlight mt-1">
						{(availableProjects?.projects ?? [])
							.filter((project) => project.id !== currentProject?.id)
							.map((project) => (
								<button
									key={project.id}
									type="button"
									onClick={() => {
										setCurrentProject(project.id);
										setIsUserMenuOpen(false);
									}}
									className="w-full px-3 py-2 text-left hover:bg-impolar-secondary/10 rounded-md transition-colors text-impolar-bg-highlight-text text-sm flex items-center space-x-2"
								>
									{project.name}
								</button>
							))}
						<button
							type="button"
							onClick={onProjectAdd}
							className="w-full px-3 py-2 text-left hover:bg-impolar-secondary/10 rounded-md transition-colors text-impolar-bg-highlight-text text-sm flex items-center space-x-2"
						>
							<span className="text-impolar-bg-surface-text">+</span>
						</button>
					</div>
				</div>
			</div>

			{/* Navigation Routes - maintaining existing structure */}
			<div className="space-y-1 flex-1 overflow-auto">
				{NavigationRoutes.map((route) => (
					<div key={route.path}>
						<div
							className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 group ${
								location.pathname === route.path
									? "bg-impolar-secondary/10"
									: "hover:bg-impolar-bg-highlight text-impolar-bg-surface-text"
							}`}
						>
							<NavLink
								to={route.path}
								className="flex-1 flex items-center space-x-2"
								onClick={() => navigate(route.path)}
							>
								{route.icon}
								<span className="group-hover:text-impolar-bg-surface-text transition-colors text-sm">
									{t(route.nameKey)}
								</span>
							</NavLink>
							{route.children && (
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										toggleSubmenu(route.path);
									}}
									className="text-impolar-secondary hover:text-impolar-secondary p-1"
								>
									<FiChevronDown
										className={`transform transition-transform text-xs ${
											openSubmenus[route.path] ? "rotate-180" : ""
										}`}
									/>
								</button>
							)}
						</div>

						{route.children && (
							<div
								className={`ml-6 pl-2 space-y-1 overflow-hidden transition-all duration-300 ease-out ${
									openSubmenus[route.path]
										? "max-h-[1000px] opacity-100 border-l border-impolar-bg-highlight"
										: "max-h-0 opacity-0"
								}`}
							>
								{route.children.map((child) => (
									<NavLink
										key={child.path}
										to={child.path}
										className={({ isActive }) =>
											`flex items-center p-1.5 rounded-md transition-colors text-sm ${
												isActive
													? "bg-impolar-secondary/20 font-medium"
													: "text-impolar-bg-surface-text hover:bg-impolar-bg-highlight"
											}`
										}
									>
										<span className="w-1 h-1 bg-impolar-secondary rounded-full mr-2 opacity-70" />
										<span>{t(child.nameKey)}</span>
									</NavLink>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Adjusted Settings/Support Section */}
			<div className="mt-auto space-y-1 border-impolar-bg-highlight pt-2">
				<button
					type="button"
					className="w-full flex items-center p-2 rounded-lg transition-colors text-impolar-bg-highlight-text hover:bg-impolar-secondary/10 text-sm"
				>
					<FiSettings className="w-4 h-4 mr-2" />
					{t("settings")}
				</button>
				<button
					type="button"
					className="w-full flex items-center p-2 rounded-lg transition-colors text-impolar-bg-highlight-text hover:bg-impolar-secondary/10 text-sm"
				>
					<FiLifeBuoy className="w-4 h-4 mr-2" />
					{t("shop")}
				</button>

				{isMobile && (
					<div className="pt-2">
						<UserWidget
							isMenuOpen={isLocalUserMenuOpen}
							toggleMenu={() => setIsLocalUserMenuOpen(!isLocalUserMenuOpen)}
							menuRef={userMenuRef}
							showFull={true}
						/>
					</div>
				)}
			</div>
		</nav>
	);
};

// Maintain existing Navigation component structure with responsive classes

export const Navigation = () => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

	const sidebarRef = useRef<HTMLDivElement>(null);

	const toggleSubmenu = (path: string) => {
		setOpenSubmenus((prev) => ({ ...prev, [path]: !prev[path] }));
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsMobileMenuOpen(false);
			}
		};

		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("resize", handleResize);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<button
				type="button"
				className="md:hidden fixed bottom-5 right-5 p-3 bg-impolar-bg-surface backdrop-blur-xs rounded-full shadow-lg border border-impolar-bg-highlight hover:border-impolar-primary transition-all z-50"
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
			>
				{isMobileMenuOpen ? (
					<FiX className="w-5 h-5 text-impolar-bg-surface-text" />
				) : (
					<FiMenu className="w-5 h-5 text-impolar-bg-surface-text" />
				)}
			</button>

			<div className="hidden md:block left-0 w-70 h-full max-h-22/23 bg-impolar-bg text-impolar-bg-surface-text z-40 p-4 m-3 mt-4">
				<Sidebar
					isMobile={false}
					openSubmenus={openSubmenus}
					toggleSubmenu={toggleSubmenu}
					isUserMenuOpen={isUserMenuOpen}
					setIsUserMenuOpen={setIsUserMenuOpen}
				/>
			</div>

			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
					onKeyDown={() => setIsMobileMenuOpen(false)}
				/>
			)}
			<div
				ref={sidebarRef}
				className={`md:hidden fixed inset-y-0 left-0 transform ${
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				} transition-transform duration-300 ease-out-expo w-64 bg-impolar-bg text-impolar-bg-surface-text flex flex-col z-50 p-4 pt-6 border-r border-impolar-bg-highlight`}
			>
				<Sidebar
					isMobile={true}
					openSubmenus={openSubmenus}
					toggleSubmenu={toggleSubmenu}
					isUserMenuOpen={isUserMenuOpen}
					setIsUserMenuOpen={setIsUserMenuOpen}
				/>
			</div>
		</>
	);
};

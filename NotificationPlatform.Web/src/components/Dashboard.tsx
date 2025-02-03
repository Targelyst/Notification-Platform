import { useState, useRef, useEffect } from "react";
import {
	Route,
	Routes,
	useLocation,
	Link,
	useNavigate,
} from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { UserWidget } from "./UserWidget";
import { routes } from "../routes";
import { Footer } from "./Footer";

export default function Dashboard() {
	const location = useLocation();
	const navigate = useNavigate();
	const pathSegments = location.pathname.split("/").filter((p) => p !== "");
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	const parentPath =
		pathSegments.length > 0 ? `/${pathSegments.slice(0, -1).join("/")}` : "/";

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative flex flex-col w-full border-1 border-impolar-bg-highlight/30 rounded-2xl bg-gradient-to-br from-impolar-bg-surface/90 via-impolar-bg-surface/20 to-impolar-bg-highlight/50 overflow-auto md:mt-4 md:mb-4 md:mr-4 ">
			{/* Breadcrumb Navigation */}
			<div className="flex items-center justify-between px-4 py-2 border-b-2 border-impolar-bg-highlight/30 mx-2 mt-1">
				<div className="flex items-center space-x-2">
					{pathSegments.length > 0 && (
						<button
							type="button"
							onClick={() => navigate(parentPath)}
							className="text-impolar-bg-text hover:text-impolar-bg-highlight-text"
						>
							<FiChevronLeft />
						</button>
					)}
					<div className="flex items-center">
						{pathSegments.map((segment, index) => {
							const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
							return (
								<div key={index} className="flex items-center">
									<span className="mx-1 text-impolar-bg-text">/</span>
									<Link
										to={path}
										className="text-impolar-bg-text hover:text-impolar-bg-highlight-text text-sm md:text-base"
									>
										{segment}
									</Link>
								</div>
							);
						})}
					</div>
				</div>
				<div className="hidden md:block">
					<UserWidget
						isMenuOpen={isUserMenuOpen}
						toggleMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
						menuRef={userMenuRef}
						showFull={true}
					/>
				</div>
				<div className="sm:block md:hidden">
					<UserWidget
						isMenuOpen={isUserMenuOpen}
						toggleMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
						menuRef={userMenuRef}
						showFull={false}
					/>
				</div>
			</div>

			<div className="flex-1 mx-2 my-3 p-4 relative">
				<Routes>
					{routes.map((route) => (
						<Route key={route.path} path={route.path} element={route.component}>
							{route.children?.map((child) => (
								<Route
									key={child.path}
									path={child.path}
									element={child.component}
								/>
							))}
						</Route>
					))}
				</Routes>
				<Footer />
			</div>
		</div>
	);
}

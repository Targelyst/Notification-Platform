import { useState, useRef, useEffect } from "react";
import { Route, Routes, useLocation, Link, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { UserWidget } from "./UserWidget";
import { Footer } from "./Footer";
import pageUrlsArray from "../PageURLs";
import { Navigation } from "./Navigation";

const Breadcrumb = ({ pathSegments, navigate }: {
	pathSegments: string[];
	navigate: (path: string) => void;
}) => {
	const parentPath = pathSegments.length > 0
		? `/${pathSegments.slice(0, -1).join("/")}`
		: "/";

	return (
		<div className="flex items-center gap-2 max-w-96 overflow-auto">
			{pathSegments.length > 0 && (
				<button
					onClick={() => navigate(parentPath === '/' ? '/home' : parentPath)}
					className="text-impolar-bg-text hover:text-impolar-bg-highlight-text"
				>
					<FiChevronLeft />
				</button>
			)}
			<div className="flex items-center whitespace-nowrap">
				{pathSegments.map((segment, index) => {
					const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
					return (
						<div key={index} className="flex items-center">
							<span className="mx-1 text-impolar-bg-text">/</span>
							<Link
								to={path}
								className="text-sm text-impolar-bg-text hover:text-impolar-bg-highlight-text md:text-base"
							>
								{segment}
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default function Dashboard() {
	const location = useLocation();
	const navigate = useNavigate();
	const pathSegments = location.pathname.split("/").filter((p) => p !== "");
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="w-full flex flex-col h-screen">
			<div className="flex flex-1 overflow-hidden">
				<Navigation />

				{/* Main content area */}
				<div className="flex flex-col flex-1 lg:mt-4 lg:mb-4 lg:mr-4 overflow-y-auto">
					<div className="bg-gradient-to-br from-impolar-bg-surface/90 via-impolar-bg-surface/20 to-impolar-bg-highlight/50 rounded-b-lg lg:rounded-2xl border-impolar-bg-highlight/30 border">
						{/* Sticky header */}
						<div className="flex items-center justify-between p-3 border-b-2 border-impolar-bg-highlight/30 sticky top-0 z-10  backdrop-blur-sm rounded-t-2xl mt-0.5 ">
							<Breadcrumb pathSegments={pathSegments} navigate={navigate} />

							<div className="flex items-center gap-2">
								<UserWidget
									isMenuOpen={isUserMenuOpen}
									toggleMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
									menuRef={userMenuRef}
									showFull={false}
									className="md:hidden"
								/>
								<UserWidget
									isMenuOpen={isUserMenuOpen}
									toggleMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
									menuRef={userMenuRef}
									showFull={true}
									className="hidden md:block"
								/>
							</div>
						</div>

						{/* Scrollable content */}
						<main className="md:p-2 mb-22 mt-4 min-h-[calc(100vh-260px)]">
							<div key={location.key} className="animate-fadeIn">
								<Routes>
									{pageUrlsArray.map((route) => (
										<Route key={route.urlPath} path={route.urlPath} element={route.component} />
									))}
								</Routes>
							</div>
						</main>
					</div>

					{/* Footer now appears after scrolling past content */}
					<Footer />
				</div>
			</div>
		</div>
	);
}
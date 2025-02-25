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
import { BiSolidDashboard } from "react-icons/bi";
import { NavigationRoutes } from "../NavigationRoutes";
import { UserWidget } from "../components/UserWidget";
import { useAvailableProjects, useCurrentProject } from "../api/projects";
import { Dropdown } from "./Dropdown";

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
  const userMenuTriggerRef = useRef<HTMLDivElement>(null);

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
      <div className="mb-4 relative">
        <div
          ref={userMenuTriggerRef}
          className="flex items-center bg-impolar-bg-highlight/50 hover:bg-impolar-bg-highlight/70 backdrop-blur-sm transition-all p-2.5 rounded-xl shadow-sm justify-between cursor-pointer"
          onKeyDown={() => setIsUserMenuOpen(!isUserMenuOpen)}
          onClick={(e) => {
            setIsUserMenuOpen(!isUserMenuOpen);
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-400 to-impolar-secondary transition-all p-1.5 rounded-xl">
              <BiSolidDashboard className="w-4 h-4 text-impolar-primary" />
            </div>
            {currentProject ? (
              <span className="font-medium text-impolar-bg-highlight-text text-sm">
                {currentProject.name}
              </span>
            ) : (
              <span className="text-sm">Loading</span>
            )}
          </div>
          <FiChevronDown
            className={`text-impolar-primary-text transform transition-transform duration-400 mr-2 ${isUserMenuOpen ? "rotate-180" : ""
              }`}
          />
        </div>

        <Dropdown
          targetRef={userMenuTriggerRef}
          isOpen={isUserMenuOpen}
          className="w-full bg-impolar-bg-surface rounded-xl shadow-xl border border-impolar-bg-highlight/30"
        >
          <div className="rounded-xl mt-1 overflow-hidden">
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
              className="w-full px-3 py-2 text-left hover:bg-impolar-secondary/10 transition-colors text-impolar-bg-highlight-text text-sm flex items-center space-x-2 group"
            >
              <span className="w-5 h-5 flex items-center justify-center bg-impolar-primary/10 rounded-md group-hover:bg-impolar-primary/20 transition-colors">
                +
              </span>
              <span className="p-1">New Project</span>
            </button>
          </div>
        </Dropdown>
      </div>

      <div className="space-y-1 flex-1 overflow-auto">
        {NavigationRoutes.map((route) => (
          <div key={route.path}>
            <div
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-100 group ${location.pathname === route.path
                ? "bg-gradient-to-r from-impolar-primary/30 to-impolar-bg-highlight shadow-sm"
                : "hover:bg-impolar-bg-highlight/40 text-impolar-bg-surface-text hover:shadow-md"
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
                    e.stopPropagation(); // Prevent NavLink navigation
                    toggleSubmenu(route.path);
                  }}
                  className="text-impolar-secondary hover:text-impolar-primary p-1 transition-colors"
                >
                  <FiChevronDown
                    className={`transform transition-transform duration-300 text-xs w-4 h-4 text-impolar-secondary ${openSubmenus[route.path] ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>
              )}
            </div>

            {route.children && (
              <div
                className={`ml-6 pl-2 space-y-1 overflow-hidden transition-all duration-300 ease-out ${openSubmenus[route.path]
                  ? "max-h-[1000px] opacity-100 border-l border-impolar-bg-highlight/30"
                  : "max-h-0 opacity-0"
                  }`}
              >
                {route.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-xl text-sm ${isActive
                        ? "bg-gradient-to-r from-impolar-primary/30 to-impolar-bg-highlight font-medium p-2.5 ml-0.5 "
                        : "text-impolar-bg-surface-text hover:bg-impolar-bg-highlight/30 p-2.5 ml-0.5"
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

      <div className="mt-auto space-y-1 border-impolar-bg-highlight/30 pt-2">
        <button
          type="button"
          className="w-full flex items-center p-2.5 rounded-xl transition-all text-impolar-bg-highlight-text hover:bg-impolar-secondary/10 hover:shadow-sm text-sm group"
        >
          <FiSettings className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
          {t("settings")}
        </button>
        <button
          type="button"
          className="w-full flex items-center p-2.5 rounded-xl transition-all text-impolar-bg-highlight-text hover:bg-impolar-secondary/10 hover:shadow-sm text-sm group"
        >
          <FiLifeBuoy className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-12" />
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

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navigation = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavigationProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
  }, [setIsMobileMenuOpen]);

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed bottom-12 right-5 p-3 bg-impolar-bg-surface backdrop-blur-xs rounded-full shadow-lg border border-impolar-bg-highlight hover:border-impolar-primary transition-all"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <FiX className="w-5 h-5 text-impolar-bg-surface-text" />
        ) : (
          <FiMenu className="w-5 h-5 text-impolar-bg-surface-text" />
        )}
      </button>

      <div className="hidden lg:block left-0 w-64 h-screen pb-6 max-h-22/23 bg-impolar-bg text-impolar-bg-surface-text z-10 p-4 m-3 mt-4 ">
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        ref={sidebarRef}
        className={`lg:hidden fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-out-expo w-64 bg-impolar-bg text-impolar-bg-surface-text flex flex-col z-50 p-4 pt-6 border-r border-impolar-bg-highlight/30 shadow-2xl`}
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

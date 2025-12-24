import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  BoxCubeIcon,
  BoxIcon,
  CalenderIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  UserIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Boshqaruv paneli",
    subItems: [{ name: "Elektron tijorat", path: "/", pro: false }],
  },
  {
    icon: <UserIcon />,           // O'qituvchi uchun odam ikonkasi
    name: "O'qituvchilar",
    path: "/teachers",
  },
  {
    icon: <UserCircleIcon />,     // Talaba uchun doira ichidagi odam
    name: "O'quvchilar",
    path: "/students",
  },
  {
    icon: <GroupIcon />,          // Ota-onalar ko'pincha oila/guruh sifatida ko'rsatiladi
    name: "Ota-onalar",
    path: "/parents",
  },
  {
    icon: <CheckCircleIcon />,    // Davomat — kelgan/kelmagan belgilash
    name: "Davomat",
    path: "/attendance",
  },
  {
    icon: <GroupIcon />,          // Guruhlar — bir nechta odam
    name: "Guruhlar",
    path: "/groups",
  },
  {
    icon: <BoxIcon />,            // Xonalar — bino/xona ramzi
    name: "Xonalar",
    path: "/rooms",
  },
  {
    icon: <CalenderIcon />,       // Haqiqiy taqvim
    name: "Taqvim",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "Shaxsiy profil",
    path: "/profile",
  },
  {
    icon: <ListIcon />,
    name: "Formalar",
    subItems: [{ name: "Forma elementlari", path: "/form-elements", pro: false }],
  },
  {
    icon: <TableIcon />,
    name: "Jadvallar",
    subItems: [{ name: "Oddiy jadvallar", path: "/basic-tables", pro: false }],
  },
  {
    icon: <PageIcon />,
    name: "Sahifalar",
    subItems: [
      { name: "Bo‘sh sahifa", path: "/blank", pro: false },
      { name: "404 Xato", path: "/error-404", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  { icon: <PieChartIcon />, name: "Diagrammalar", subItems: [{ name: "Chiziqli diagramma", path: "/line-chart", pro: false }, { name: "Ustunli diagramma", path: "/bar-chart", pro: false }] },
  { icon: <BoxCubeIcon />, name: "UI elementlari", subItems: [{ name: "Ogohlantirishlar", path: "/alerts", pro: false }, { name: "Avatar", path: "/avatars", pro: false }, { name: "Belgilar", path: "/badge", pro: false }, { name: "Tugmalar", path: "/buttons", pro: false }, { name: "Rasmlar", path: "/images", pro: false }, { name: "Videolar", path: "/videos", pro: false }] },
  { icon: <PlugInIcon />, name: "Autentifikatsiya", subItems: [{ name: "Kirish", path: "/signin", pro: false }, { name: "Ro‘yxatdan o‘tish", path: "/signup", pro: false }] },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer flex items-center gap-3 ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"} cursor-pointer flex items-center gap-3 ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>yangi</span>}
                        {subItem.pro && <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>pro</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 px-3 flex flex-col lg:mt-0 top-0 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
      ${isExpanded || isHovered ? "w-[290px]" : "w-[90px]"} 
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Logo */}
      <div className={`py-5 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img className="h-30 object-fill w-[60px] h-[60px]" src="/images/logoOne.png" alt="Logo"/>
              <span className="flex items-center text-[33px] leading-6 !m-0">Sfera Academy</span>
            </div>
          ) : (
            <img src="/images/logoOne.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Menyu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Boshqalar" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../AppContext";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { MdSupportAgent } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaBrain } from "react-icons/fa";
import {
  IoBarChart,
  IoChatbubbleOutline,
  IoGitNetworkOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Notify from "../notifications/Notify";
import notificationsData from "../../contract.json";
import { Notification } from "@/types";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  width: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Sidebar = ({
  isCollapsed,
  onToggle,
  width,
  onMouseDown,
}: SidebarProps) => {
  const searchParams = useSearchParams();
  const { isDarkMode, user, logout } = useAppContext();
  const initial = user?.name ? user?.name.charAt(0).toUpperCase() : "?";
  const [state, setState] = useState<number | null>(null);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) {
      setView(view);
    }
  }, [searchParams]);

  useEffect(() => {
    const view = searchParams.get("view");
    if (pathname === "/dashboard" && !view) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("view", "inbox");
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [pathname, searchParams, router]);

  useEffect(() => {
    if (view === "inbox") {
      setState(2);
    } else if (view === "ai-training") {
      setState(1);
    } else if (view === "integrations") {
      setState(3);
    } else if (view === "analytics") {
      setState(4);
    } else if (view === "settings") {
      setState(5);
    } else if (view === "help-center") {
      setState(6);
    }
  }, [view]);

  useEffect(() => {
    setAllNotifications(notificationsData as Notification[]);
  }, []);

  const unReadNotifications = useMemo(() => {
    return allNotifications.filter((n) => !n.read);
  }, [allNotifications]);

  const notificationToShow = unReadNotifications[currentIndex];

  const handleDismiss = (id: string) => {
    setAllNotifications((currentNotifications) =>
      currentNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, unReadNotifications.length - 1),
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const navigate = (id: number, view: string) => {
    setState(id);
    router.push(`/dashboard?view=${view}`);
  };

  return (
    <div
      className={`sidebar backdrop-filter backdrop-blur-md bg-[#0d0f12]  fixed left-0 top-0 bottom-0 pt-16 transition-all duration-300 ease-in-out`}
      style={{ width: `${width}px` }}
    >
      <span
        className="p-0! absolute right-3 z-10 grid h-6 place-items-center  text-white shadow-2xl cursor-grab text-2xl transition-all duration-300 "
        onClick={onToggle}
        onMouseDown={onMouseDown}
      >
        {isCollapsed ? (
          <BiChevronRight className="mr-1" size={32} />
        ) : (
          <BiChevronLeft size={32} />
        )}
      </span>
      <div className="sidebar-content h-full overflow-hidden p-4 pt-6 relative">
        <div>
          <div className="user flex justify-between items-center mt-3 gap-3">
            {isCollapsed && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white -ml-1.5">
                <span className="text-lg font-bold">{initial}</span>
              </div>
            )}
            {!isCollapsed && (
              <div className="w-full">
                <div className="flex w-full justify-between items-center">
                  <h1
                    className={`${isCollapsed ? "hidden" : "block"} transition-all duration-300 ease-out text-2xl`}
                  >
                    {user?.name}
                  </h1>
                  <span className="text-green-500 bg-gray-900 px-3 py-0.5 rounded-md">
                    {user?.plan}
                  </span>
                </div>
                {user?.store ? (
                  <a
                    href={
                      user.store.storeUrl.startsWith("http")
                        ? user.store.storeUrl
                        : `https://${user.store.storeUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-2 text-[15px] text-gray-400 hover:underline truncate block"
                    title={user.store.storeName}
                  >
                    {user.store.storeName}
                  </a>
                ) : (
                  <p className="pt-2 text-[15px] text-gray-500">
                    No store connected
                  </p>
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-700 border w-full  mt-4" />

          <div className="navigations mt-5 flex flex-col gap-2">
            <div
              className={`${state === 1 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(1, "ai-training")}
            >
              <FaBrain className="text-xl" />
              {!isCollapsed && (
                <span className="text-xl">AI Training Center</span>
              )}
            </div>

            <div
              className={`${state === 2 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(2, "inbox")}
            >
              <IoChatbubbleOutline className="text-xl" />
              {!isCollapsed && <span className="text-xl">Inbox</span>}
            </div>

            <div
              className={`${state === 3 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(3, "integrations")}
            >
              <IoGitNetworkOutline className="text-xl" />
              {!isCollapsed && <span className="text-xl">Integrations</span>}
            </div>

            <div
              className={`${state === 4 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(4, "analytics")}
            >
              <IoBarChart className="text-xl" />
              {!isCollapsed && <span className="text-xl">Analytics</span>}
            </div>
          </div>
        </div>

        <div className="others fixed right-4 left-4 bottom-4">
          <div className="flex w-full flex-col gap-1">
            <div className="rounded-md py-1 px-2 flex gap-3 items-center mb-1">
              {isCollapsed && (
                <div className="bg-[#181c21] p-2 rounded-md shadow-xl -ml-2 relative">
                  <FaBell className="text-xl" />
                  <span className="badge absolute -top-1 -right-1 flex justify-center items-center h-5 w-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {unReadNotifications.length}
                  </span>
                </div>
              )}
              {!isCollapsed && unReadNotifications.length > 0 && (
                <Notify
                  key={notificationToShow?.id}
                  notification={notificationToShow}
                  onDismiss={() => handleDismiss(notificationToShow.id)}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  currentIndex={currentIndex}
                  totalUnread={unReadNotifications.length}
                />
              )}
            </div>

            <div
              className={`${state === 5 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer w-full`}
              onClick={() => navigate(5, "settings")}
            >
              <IoSettingsSharp className="text-xl" />
              {!isCollapsed && <span className="text-xl">Settings</span>}
            </div>

            <div
              className={`${state === 6 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(6, "help-center")}
            >
              <MdSupportAgent className="text-xl" />
              {!isCollapsed && <span className="text-xl">Help Center</span>}
            </div>

            <div
              className={`rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={logout}
            >
              <FaArrowRightFromBracket className="text-xl" />
              {!isCollapsed && <span className="text-xl">Logout</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

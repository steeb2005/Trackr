import { useState } from "react";


// For reusing component functions across different pages
export function useSidebar(){

    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, openSidebar: open, closeSidebar: close };
}

/*

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

*/
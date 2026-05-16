import { useState, useEffect } from "react";

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // localStorage থেকে প্রিভিয়াস স্টেট নিয়ে আসে
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return { sidebarOpen, setSidebarOpen };
}

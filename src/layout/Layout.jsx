import { useState } from "react";
import Navbar from "./Navbar";
import { NAV_ITEMS_BY_ROLE } from "../navConfig";
import BaseDrawer from "../components/base/BaseDrawer";

export default function Layout({ role = "borrower", children }) {
  const [drawerConfig, setDrawerConfig] = useState({
    title: "",
    size: "lg",
    placement: "right",
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const onOpenDrawer = (title, size, placement) => {
    setDrawerConfig({ title, size, placement });
    setDrawerOpen(true);
  };

  return (
    <>
      <Navbar navItems={NAV_ITEMS_BY_ROLE[role]} onOpenDrawer={onOpenDrawer} />
      <main>{children}</main>
      <BaseDrawer
        isOpenRightDrawer={isDrawerOpen}
        onCloseRightDrawer={() => setDrawerOpen(false)}
        title={drawerConfig.title}
        size={drawerConfig.size}
        placement={drawerConfig.placement}
      >
        <h1>{drawerConfig.title} Content</h1>
      </BaseDrawer>
    </>
  );
}

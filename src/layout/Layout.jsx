import { useState } from "react";
import Navbar from "./Navbar";
import { NAV_ITEMS_BY_ROLE } from "../navConfig";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../store";
import { logout } from "../store/authSlice";
import BaseDrawer from "../components/base/BaseDrawer";

export default function Layout({ role = null, children }) {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
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

  const navItems = role ? NAV_ITEMS_BY_ROLE[role] : [];

  const handleLogout = () => dispatch(logout());

  return (
    <>
      {auth.isAuthenticated && (
        <Navbar
          navItems={navItems}
          onOpenDrawer={onOpenDrawer}
          isAuthenticated={auth.isAuthenticated}
          user={auth.user}
          onLogout={handleLogout}
        />
      )}
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

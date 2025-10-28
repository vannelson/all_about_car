import { useState } from "react";
import Navbar from "./Navbar";
import { NAV_ITEMS_BY_ROLE } from "../navConfig";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../store";
import { logout } from "../store/authSlice";
import BaseDrawer from "../components/base/BaseDrawer";
import AccountSettingsDrawerContent from "../components/settings/AccountSettingsDrawerContent";

export default function Layout({ role = null, children }) {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [drawerConfig, setDrawerConfig] = useState({
    title: "",
    size: "md",
    placement: "right",
    view: null,
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const onOpenDrawer = (
    title,
    size = "md",
    placement = "right",
    view = null
  ) => {
    setDrawerConfig({ title, size, placement, view: view || title });
    setDrawerOpen(true);
  };

  const navItems = role ? NAV_ITEMS_BY_ROLE[role] : [];

  const handleLogout = () => dispatch(logout());

  const renderDrawerContent = () => {
    switch (drawerConfig.view) {
      case "Account Settings":
      case "account-settings":
      case "account":
        return <AccountSettingsDrawerContent />;
      default:
        return <h1>{drawerConfig.title} Content</h1>;
    }
  };

  return (
    <>
      {auth.isAuthenticated && (
        <Navbar
          navItems={navItems}
          onOpenDrawer={onOpenDrawer}
          isAuthenticated={auth.isAuthenticated}
          user={auth.user}
          onLogout={handleLogout}
          role={role}
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
        {renderDrawerContent()}
      </BaseDrawer>
    </>
  );
}

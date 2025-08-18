import PropTypes from "prop-types";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

const BaseDrawer = ({
  isOpenRightDrawer,
  onCloseRightDrawer,
  title,
  size,
  placement = "right",
  children,
}) => {
  return (
    <Drawer
      onClose={onCloseRightDrawer}
      isOpen={isOpenRightDrawer}
      size={size}
      placement={placement}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

BaseDrawer.propTypes = {
  isOpenRightDrawer: PropTypes.bool.isRequired,
  onCloseRightDrawer: PropTypes.func.isRequired,
  title: PropTypes.node,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "full"]),
  placement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  children: PropTypes.node,
};

export default BaseDrawer;

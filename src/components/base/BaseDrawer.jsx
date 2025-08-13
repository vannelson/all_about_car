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

export default BaseDrawer;

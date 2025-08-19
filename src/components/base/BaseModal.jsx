import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const BaseModal = ({
  title,
  theme = "#4299e1",
  size = "md",
  children,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      size={size}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg={theme} color="white" fontWeight={"bold"}>
          {title}
        </ModalHeader>
        <ModalCloseButton size="16" color="white" mt="4" mr="3" />
        <ModalBody p={0}>{children}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;

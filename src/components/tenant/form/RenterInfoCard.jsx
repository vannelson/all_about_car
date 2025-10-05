import { Card, CardHeader, CardBody, Heading, VStack } from "@chakra-ui/react";
import { FaUser, FaPhone, FaEnvelope, FaHome, FaIdCard } from "react-icons/fa";
import InfoRow from "./InfoRow";

export default function RenterInfoCard({ panelBg, renterFirstName = "", renterMiddleName = "", renterLastName = "", renterPhone = "", renterEmail = "", renterAddress = "", idType = "", idNumber = "" }) {
  const fullName = [renterFirstName, renterMiddleName, renterLastName].filter(Boolean).join(" ") || "-";
  return (
    <Card variant="unstyled" bg={panelBg} border="0" shadow="sm" borderRadius="md">
      <CardHeader pb={2}><Heading size="sm">Renter Information</Heading></CardHeader>
      <CardBody pt={0}>
        <VStack spacing={0} align="stretch">
          <InfoRow icon={FaUser} label="Name" value={fullName} />
          <InfoRow icon={FaPhone} label="Phone" value={renterPhone || "-"} />
          <InfoRow icon={FaEnvelope} label="Email" value={renterEmail || "-"} />
          <InfoRow icon={FaHome} label="Address" value={renterAddress || "-"} />
          <InfoRow icon={FaIdCard} label="ID Type" value={idType || "-"} />
          <InfoRow icon={FaIdCard} label="ID Number" value={idNumber || "-"} />
        </VStack>
      </CardBody>
    </Card>
  );
}


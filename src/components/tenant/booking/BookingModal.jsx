import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Stack,
  HStack,
  VStack,
  Text,
  Input,
  Select,
  Divider,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepTitle,
  StepDescription,
  Heading,
  useSteps,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Badge,
  Icon,
  Alert,
  AlertIcon,
  Flex,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import BaseModal from "../../base/BaseModal";
import BookingTripForm from "../form/BookingTripForm";
import BookingRenterForm from "../form/BookingRenterForm";
import InfoRow from "../form/InfoRow";
import { FaRoute, FaUser, FaClipboardCheck, FaMapMarkerAlt } from "react-icons/fa";
import PaymentDetailsCard from "../form/PaymentDetailsCard";
import RenterInfoCard from "../form/RenterInfoCard";
import { createBookingApi } from "../../../services/bookings";


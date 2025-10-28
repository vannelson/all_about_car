import { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Heading,
  HStack,
  Icon,
  Input,
  Image,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  SlideFade,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBuilding,
  FaListUl,
  FaPlusCircle,
  FaMapMarkerAlt,
  FaUser,
  FaRegBuilding,
  FaIndustry,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { selectAuth, selectCompanies } from "../../store";
import { fetchCompanies, createCompany, setDefaultCompany, updateCompany } from "../../store/companiesSlice";
import ImageUpload from "../tenant/ImageUpload";
import CompanyLocationPicker from "./CompanyLocationPicker";

const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5 MB

const DEFAULT_FORM = {
  name: "",
  industry: "",
  address: "",
  is_default: false,
  latitude: "",
  longitude: "",
};

const CompanyCreateForm = ({
  values,
  onChange,
  onSubmit,
  onReset,
  isSubmitting,
  logoPreview,
  onLogoImagesChange,
  onLogoFilesSelected,
  logoResetKey,
  onLocate,
  locating,
  mode = "create",
  onCancelEdit,
  onLocationChange = () => {},
}) => {
  const mutedText = useColorModeValue("gray.600", "gray.300");
  const panelBg = useColorModeValue("white", "gray.900");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const isEditMode = mode === "edit";

  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      bg={panelBg}
      borderWidth="0"
      borderColor="transparent"
      borderRadius="xl"
      p={6}
      boxShadow="none"
      minW={{ base: "full", md: "360px" }}
    >
      <Stack spacing={6}>
        <Stack spacing={1}>
          <Heading size="sm" textTransform="uppercase" letterSpacing="wide">
            {isEditMode ? "Update Company" : "Create Company"}
          </Heading>
          <Text fontSize="sm" color={mutedText}>
            {isEditMode
              ? "Modify your company details and keep information consistent across the platform."
              : "Add a company profile and keep tenant operations in sync across the platform."}
          </Text>
        </Stack>

        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Company name</FormLabel>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" color={iconColor}>
                <Icon as={FaRegBuilding} boxSize={4} />
              </InputLeftElement>
              <Input
                value={values.name}
                onChange={onChange("name")}
                placeholder="Skyline Rentals"
                ps={10}
                borderRadius="md"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Industry</FormLabel>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" color={iconColor}>
                <Icon as={FaIndustry} boxSize={4} />
              </InputLeftElement>
              <Input
                value={values.industry}
                onChange={onChange("industry")}
                placeholder="Car Rental"
                ps={10}
                borderRadius="md"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Address</FormLabel>
            <Box position="relative">
              <Icon
                as={FaMapMarkerAlt}
                color={iconColor}
                position="absolute"
                top={3}
                left={3}
              />
              <Textarea
                size="sm"
                rows={3}
                value={values.address}
                onChange={onChange("address")}
                placeholder="123 Horizon Ave"
                ps={10}
                borderRadius="md"
              />
            </Box>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Geolocation</FormLabel>
            <Stack spacing={3}>
              <CompanyLocationPicker
                latitude={values.latitude}
                longitude={values.longitude}
                onLocationChange={onLocationChange}
                mapHeight="220px"
              />
              <Text fontSize="xs" color={mutedText} textAlign="center">
                {values.latitude && values.longitude
                  ? `Latitude ${values.latitude} | Longitude ${values.longitude}`
                  : "Click the map to capture coordinates or use your current location."}
              </Text>
              <Button
                size="sm"
                alignSelf={{ base: "stretch", sm: "flex-start" }}
                colorScheme="blue"
                variant="solid"
                onClick={onLocate}
                isDisabled={!onLocate}
                isLoading={locating}
                loadingText="Locating"
                leftIcon={<Icon as={FaMapMarkerAlt} boxSize={4} />}
              >
                Use my current location
              </Button>
            </Stack>
          </FormControl>
        </Stack>

        <Box
          borderRadius="md"
          p={4}
          bg={useColorModeValue("gray.50", "gray.900")}
          borderWidth="0"
          borderColor="transparent"
        >
          <Stack spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              Default company
            </Text>
            <Text fontSize="xs" color={mutedText}>
              Once active this company will be default after login.
            </Text>
            <Switch
              isChecked={values.is_default}
              onChange={onChange("is_default")}
              colorScheme="blue"
              size="sm"
              alignSelf="flex-start"
            />
          </Stack>
        </Box>

        <Box>
          <FormLabel fontSize="sm">Company logo</FormLabel>
          <Text fontSize="xs" color={mutedText} mb={2}>
            Accepted formats: JPG, PNG, GIF, WEBP, AVIF (max 5 MB).
          </Text>
          <ImageUpload
            key={logoResetKey}
            multiple={false}
            maxFiles={1}
            aspectRatio={1}
            onImagesChange={onLogoImagesChange}
            onFilesSelected={onLogoFilesSelected}
            initialImages={logoPreview}
          />
        </Box>

        <HStack justify="flex-end" spacing={3}>
          <Button
            onClick={isEditMode ? onCancelEdit : onReset}
            variant="ghost"
            size="sm"
          >
            {isEditMode ? "Cancel" : "Clear"}
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            leftIcon={isEditMode ? <FaSave /> : <FaPlusCircle />}
            size="sm"
            isLoading={isSubmitting}
            loadingText="Saving"
          >
            {isEditMode ? "Update company" : "Save company"}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

const CompanyCard = ({ company, onToggleDefault, toggleBusy, fallbackUserId, onEdit }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const defaultBg = useColorModeValue("blue.50", "blue.900");
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconAccent = useColorModeValue("blue.500", "blue.300");
  const mutedText = useColorModeValue("gray.600", "gray.300");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const logoSrc = company?.logo || company?.logo_url || company?.logoPath || null;
  const hasLogo = typeof logoSrc === "string" && logoSrc.length > 0;

  return (
    <Flex
      key={company.id}
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      gap={4}
      borderWidth="0"
      borderRadius="xl"
      bg={company.is_default ? defaultBg : cardBg}
      p={4}
      boxShadow={company.is_default ? "md" : "sm"}
    >
      <Flex
        align="center"
        justify="center"
        w={{ base: "96px", md: "96px" }}
        h={{ base: "96px", md: "96px" }}
        borderRadius="lg"
        bg={iconBg}
        overflow="hidden"
      >
        {hasLogo ? (
          <Image
            src={logoSrc}
            alt={`${company.name} logo`}
            objectFit="cover"
            w="100%"
            h="100%"
            fallbackSrc="https://via.placeholder.com/80?text=Logo"
          />
        ) : (
          <Icon as={FaBuilding} boxSize={6} color={iconAccent} />
        )}
      </Flex>

      <Stack spacing={3} flex="1" w="full">
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3} w="full">
          <Stack spacing={1} minW={0}>
            <Heading size="sm" noOfLines={1}>
              {company.name}
            </Heading>
            <HStack spacing={2} flexWrap="wrap">
              {company.industry && <Badge colorScheme="gray" variant="subtle">{company.industry}</Badge>}
              {company.is_default && <Badge colorScheme="blue" variant="subtle">Active default</Badge>}
            </HStack>
          </Stack>
          <HStack spacing={2} align="center">
            {onEdit ? (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<FaEdit />}
                onClick={() => onEdit(company)}
              >
                Edit
              </Button>
            ) : null}
            <Tooltip
              label={company.is_default ? "Current default" : "Set as default"}
              hasArrow
              shouldWrapChildren
            >
              <Switch
                size="sm"
                colorScheme="blue"
                isChecked={company.is_default}
                onChange={() => onToggleDefault(company)}
                isDisabled={toggleBusy !== null && toggleBusy !== company.id}
                isReadOnly={toggleBusy !== null && toggleBusy !== company.id}
              />
            </Tooltip>
          </HStack>
        </Flex>

        <Stack spacing={1} fontSize="xs" color={mutedText}>
          <HStack align="flex-start" spacing={2}>
            <Icon as={FaMapMarkerAlt} mt={0.5} color={secondaryText} />
            <Text>{company.address || "No address on file"}</Text>
          </HStack>
          <HStack spacing={2}>
            <Icon as={FaUser} color={secondaryText} />
            <Text>Owner ID: {company.user_id || fallbackUserId || "-"}</Text>
          </HStack>
        </Stack>
      </Stack>
    </Flex>
  );
};

const CompanyList = ({
  companies,
  loading,
  emptyFallback,
  onToggleDefault,
  toggleBusy,
  userId,
  onEdit,
}) => {
  const mutedText = useColorModeValue("gray.600", "gray.300");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  if (loading) {
    return (
      <HStack color={mutedText} spacing={2} py={4}>
        <Spinner size="sm" />
        <Text fontSize="sm">Loading companies...</Text>
      </HStack>
    );
  }

  if (!companies.length) {
    return emptyFallback;
  }

  return (
    <Stack spacing={3} divider={<Divider borderColor={dividerColor} />}>
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onToggleDefault={onToggleDefault}
          toggleBusy={toggleBusy}
          fallbackUserId={userId}
          onEdit={onEdit}
        />
      ))}
    </Stack>
  );
};

const AccountSettingsDrawerContent = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const companiesState = useSelector(selectCompanies);
  const [formValues, setFormValues] = useState({ ...DEFAULT_FORM });
  const [toggleTarget, setToggleTarget] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const [logoPreview, setLogoPreview] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logoResetKey, setLogoResetKey] = useState(0);
  const [locating, setLocating] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const userId = auth?.user?.id;
  const isDesktop = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    if (!userId) return;
    dispatch(
      fetchCompanies({
        page: 1,
        limit: 10,
        filters: { user_id: userId },
        order: ["name", "asc"],
      })
    );
  }, [dispatch, userId]);

  useEffect(() => {
    if (!companiesState.loading && companiesState.items.length === 0) {
      setActiveView("create");
    }
  }, [companiesState.loading, companiesState.items.length]);

  const handleInputChange = (field) => (event) => {
    const value = field === "is_default" ? event.target.checked : event.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormValues({ ...DEFAULT_FORM });
    setLogoPreview([]);
    setLogoFile(null);
    setLogoResetKey((key) => key + 1);
    setLocating(false);
  };

  const handleLogoImagesChange = (images) => {
    setLogoPreview(images || []);
  };

  const handleLogoFilesSelected = (files = []) => {
    const file = files && files.length > 0 ? files[0] : null;
    if (file && file.size > MAX_LOGO_SIZE) {
      toast({
        title: "Logo too large",
        description: "Please upload an image no larger than 5 MB.",
        status: "warning",
      });
      setLogoPreview([]);
      setLogoFile(null);
      setLogoResetKey((key) => key + 1);
      return;
    }
    setLogoFile(file || null);
  };

  const handleMapSelection = (lat, lng) => {
    const format = (value) => {
      if (!Number.isFinite(value)) return "";
      return value.toFixed(6);
    };

    setFormValues((prev) => ({
      ...prev,
      latitude: format(lat),
      longitude: format(lng),
    }));
    setLocating(false);
  };

  const handleEditCompany = (company) => {
    if (!company) return;

    setEditingCompany(company);
    setActiveView("create");
    setLocating(false);

    setFormValues({
      name: company.name || "",
      industry: company.industry || "",
      address: company.address || "",
      is_default: Boolean(company.is_default),
      latitude:
        company.latitude !== undefined && company.latitude !== null && company.latitude !== ""
          ? String(company.latitude)
          : "",
      longitude:
        company.longitude !== undefined && company.longitude !== null && company.longitude !== ""
          ? String(company.longitude)
          : "",
    });

    const logoSrc =
      company.logo ||
      company.logo_url ||
      company.logoUrl ||
      company.logo_path ||
      company.logoPath ||
      null;

    setLogoPreview(logoSrc ? [logoSrc] : []);
    setLogoFile(null);
    setLogoResetKey((key) => key + 1);
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
    resetForm();
    if (!isDesktop) {
      setActiveView("list");
    }
  };

  const handleLocateMe = () => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      toast({
        title: "Geolocation unavailable",
        description: "Your browser does not support location services.",
        status: "error",
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormValues((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));
        setLocating(false);
        toast({
          title: "Location captured",
          status: "success",
        });
      },
      (error) => {
        setLocating(false);
        const message =
          error?.message === "User denied Geolocation"
            ? "Location permission denied."
            : "Unable to retrieve your location.";
        toast({
          title: "Location failed",
          description: message,
          status: "error",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmitCompany = async (event) => {
    event.preventDefault();
    if (!userId) {
      toast({ title: "Login required", status: "error" });
      return;
    }

    if (!formValues.name.trim()) {
      toast({ title: "Name is required", status: "warning" });
      return;
    }

    if (logoFile && logoFile.size > MAX_LOGO_SIZE) {
      toast({
        title: "Logo too large",
        description: "Please upload an image no larger than 5 MB.",
        status: "warning",
      });
      return;
    }

    const sanitizeCoordinate = (value) => {
      if (value === undefined || value === null) return undefined;
      const str = String(value).trim();
      return str.length ? str : undefined;
    };

    const sanitizedPayload = {
      name: formValues.name.trim(),
      address: formValues.address.trim(),
      industry: formValues.industry.trim(),
      is_default: formValues.is_default,
      latitude: sanitizeCoordinate(formValues.latitude),
      longitude: sanitizeCoordinate(formValues.longitude),
    };

    if (editingCompany) {
      const action = await dispatch(
        updateCompany({
          id: editingCompany.id,
          ...sanitizedPayload,
          logo: logoFile || undefined,
        })
      );

      if (updateCompany.fulfilled.match(action)) {
        toast({ title: "Company updated", status: "success" });
        setEditingCompany(null);
        resetForm();
        if (!isDesktop) {
          setActiveView("list");
        }
      } else {
        const message = action.payload?.message || action.error?.message || "Could not update company.";
        toast({ title: "Update failed", description: message, status: "error" });
      }
      return;
    }

    const action = await dispatch(
      createCompany({
        user_id: userId,
        ...sanitizedPayload,
        logo: logoFile || null,
      })
    );

    if (createCompany.fulfilled.match(action)) {
      toast({ title: "Company added", status: "success" });
      resetForm();
      if (!isDesktop) {
        setActiveView("list");
      }
    } else {
      const message = action.payload?.message || action.error?.message || "Could not create company.";
      toast({ title: "Creation failed", description: message, status: "error" });
    }
  };

  const handleToggleDefault = async (company) => {
    setToggleTarget(company.id);
    const nextValue = !company.is_default;
    const action = await dispatch(setDefaultCompany({ id: company.id, is_default: nextValue }));
    setToggleTarget(null);

    if (setDefaultCompany.fulfilled.match(action)) {
      toast({
        title: nextValue ? "Default updated" : "Default cleared",
        status: "success",
      });
    } else {
      const message = action.payload?.message || action.error?.message || "Could not update default company.";
      toast({ title: "Update failed", description: message, status: "error" });
    }
  };

  const emptyState = (
    <Box
      borderWidth="0"
      borderRadius="lg"
      borderStyle="solid"
      borderColor="transparent"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={8}
      textAlign="center"
    >
      <Icon as={FaBuilding} boxSize={10} color={useColorModeValue("gray.400", "gray.500")} mb={3} />
      <Heading size="sm" mb={1}>
        No companies yet
      </Heading>
      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
        Create your first company to get started.
      </Text>
      <Button
        mt={4}
        colorScheme="blue"
        size="sm"
        onClick={() => setActiveView("create")}
        leftIcon={<FaPlusCircle />}
      >
        New company
      </Button>
    </Box>
  );

  return (
    <Stack spacing={6} pb={4} pt={1}>
      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        alignSelf={{ base: "flex-start", md: "flex-end" }}
      >
        <Button
          leftIcon={<FaListUl />}
          colorScheme={activeView === "list" ? "blue" : "gray"}
          variant={activeView === "list" ? "solid" : "ghost"}
          onClick={() => setActiveView("list")}
        >
          Company list
        </Button>
        <Button
          leftIcon={<FaPlusCircle />}
          colorScheme={activeView === "create" ? "blue" : "gray"}
          variant={activeView === "create" ? "solid" : "ghost"}
          onClick={() => setActiveView("create")}
        >
          Create company
        </Button>
      </ButtonGroup>

      {companiesState.error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {companiesState.error?.message || "Unable to load company list."}
        </Alert>
      )}

      {isDesktop ? (
        activeView === "list" ? (
          <CompanyList
            companies={companiesState.items}
            loading={companiesState.loading}
            emptyFallback={emptyState}
            onToggleDefault={handleToggleDefault}
            toggleBusy={toggleTarget}
            userId={userId}
            onEdit={handleEditCompany}
          />
        ) : (
          <Flex justify="flex-end">
            <SlideFade in offsetY={20} style={{ width: "100%" }}>
              <CompanyCreateForm
                values={formValues}
                onChange={handleInputChange}
                onSubmit={handleSubmitCompany}
                onReset={resetForm}
                isSubmitting={editingCompany ? companiesState.updating : companiesState.creating}
                logoPreview={logoPreview}
                onLogoImagesChange={handleLogoImagesChange}
                onLogoFilesSelected={handleLogoFilesSelected}
                logoResetKey={logoResetKey}
                onLocate={handleLocateMe}
                locating={locating}
                mode={editingCompany ? "edit" : "create"}
                onCancelEdit={handleCancelEdit}
                onLocationChange={handleMapSelection}
              />
            </SlideFade>
          </Flex>
        )
      ) : (
        <Stack spacing={4}>
          {activeView === "list" ? (
            <SlideFade key="list" in offsetY={12}>
              <CompanyList
                companies={companiesState.items}
                loading={companiesState.loading}
                emptyFallback={emptyState}
                onToggleDefault={handleToggleDefault}
                toggleBusy={toggleTarget}
                userId={userId}
                onEdit={handleEditCompany}
              />
            </SlideFade>
          ) : (
            <SlideFade key="create" in offsetY={12}>
              <CompanyCreateForm
                values={formValues}
                onChange={handleInputChange}
                onSubmit={handleSubmitCompany}
                onReset={resetForm}
                isSubmitting={editingCompany ? companiesState.updating : companiesState.creating}
                logoPreview={logoPreview}
                onLogoImagesChange={handleLogoImagesChange}
                onLogoFilesSelected={handleLogoFilesSelected}
                logoResetKey={logoResetKey}
                onLocate={handleLocateMe}
                locating={locating}
                mode={editingCompany ? "edit" : "create"}
                onCancelEdit={handleCancelEdit}
                onLocationChange={handleMapSelection}
              />
            </SlideFade>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default AccountSettingsDrawerContent;










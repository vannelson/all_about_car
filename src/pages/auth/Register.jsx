import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  HStack,
  Divider,
  IconButton,
  VStack,
  Center,
  FormControl,
  FormLabel,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { useState } from "react";
import "./auth.css";
import { Link as RouterLink } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaCar,
  FaMapMarkerAlt,
  FaUmbrellaBeach,
  FaRoute,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { useRegisterHandler } from "./hooks";
import { primaryButtonProps } from "./styles";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { onSubmit, loading } = useRegisterHandler({
    firstName,
    middleName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  // Color values
  const cardBg = useColorModeValue("white", "gray.800");
  const subtle = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("blue.600", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
  );

  // Background Icons Component
  const BackgroundIcons = () => (
    <>
      {/* Animated background icons */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        opacity={0.1}
        fontSize="6xl"
        color={accent}
        css={{
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(5deg)" },
          },
        }}
      >
        <FaCar />
      </Box>
      <Box
        position="absolute"
        top="20%"
        right="15%"
        opacity={0.08}
        fontSize="5xl"
        color={accent}
        css={{
          animation: "float 7s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(5deg)" },
          },
        }}
      >
        <FaRoute />
      </Box>
      <Box
        position="absolute"
        bottom="15%"
        left="15%"
        opacity={0.06}
        fontSize="7xl"
        color={accent}
        css={{
          animation: "float 8s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(5deg)" },
          },
        }}
      >
        <FaUmbrellaBeach />
      </Box>
      <Box
        position="absolute"
        bottom="25%"
        right="10%"
        opacity={0.09}
        fontSize="4xl"
        color={accent}
        css={{
          animation: "float 9s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(5deg)" },
          },
        }}
      >
        <FaMapMarkerAlt />
      </Box>
    </>
  );

  return (
    <Flex
      minH="100vh"
      bg={bgGradient}
      align="center"
      justify="center"
      p={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {/* Global styles for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.3; }
          }
        `}
      </style>

      {/* Background Icons */}
      <BackgroundIcons />

      {/* Gradient orbs */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="600px"
        h="400px"
        borderRadius="full"
        bgGradient="linear-gradient(135deg, blue.200 0%, purple.200 50%, pink.200 100%)"
        opacity={0.15}
        filter="blur(40px)"
        css={{ animation: "pulse 8s ease-in-out infinite" }}
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="300px"
        h="300px"
        borderRadius="full"
        bgGradient="linear-gradient(135deg, teal.200 0%, green.200 50%, blue.200 100%)"
        opacity={0.1}
        filter="blur(40px)"
        css={{ animation: "pulse 6s ease-in-out infinite" }}
      />

      <Flex
        w="100%"
        maxW="480px"
        direction="column"
        position="relative"
        zIndex={1}
      >
        {/* Enhanced Header */}
        <VStack spacing={4} mb={8} textAlign="center">
          <Box position="relative">
            <Box
              position="absolute"
              top="-2"
              right="-2"
              w="6"
              h="6"
              bg={accent}
              borderRadius="full"
              opacity={0.6}
              css={{ animation: "pulse 3s ease-in-out infinite" }}
            />
            <Heading
              size="xl"
              fontWeight="800"
              bgGradient={useColorModeValue(
                "linear-gradient(135deg, #2B6CB0 0%, #3182CE 100%)",
                "linear-gradient(135deg, #90CDF4 0%, #63B3ED 100%)"
              )}
              bgClip="text"
            >
              Travel Cars
            </Heading>
          </Box>
        </VStack>

        {/* Enhanced Register Card */}
        <Box
          bg={cardBg}
          p={8}
          rounded="2xl"
          shadow="xl"
          borderWidth="1px"
          borderColor={borderColor}
          w="full"
          maxW={{ base: "100%", md: "1000px" }}
          position="relative"
          backdropFilter="blur(10px)"
        >
          <form onSubmit={onSubmit}>
            <Stack spacing={6}>
              {/* Name Field with Icon */}
              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color={useColorModeValue("gray.700", "gray.300")}
                  mb={2}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  Account Details
                </FormLabel>
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                  {/* Row 1 */}
                  <GridItem>
                    <FormLabel
                      fontSize="xs"
                      color={useColorModeValue("gray.600", "gray.400")}
                      mb={1}
                    >
                      First Name
                    </FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="First name"
                        className="auth-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        size="lg"
                        borderRadius="lg"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        pl="12"
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 2px ${useColorModeValue(
                            "blue.100",
                            "blue.900"
                          )}`,
                          transform: "scale(1.02)",
                        }}
                        _hover={{
                          borderColor: useColorModeValue(
                            "gray.300",
                            "gray.500"
                          ),
                        }}
                      />
                      <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        color={useColorModeValue("gray.400", "gray.500")}
                        zIndex={2}
                      >
                        <FaUser size={18} />
                      </Box>
                    </InputGroup>
                  </GridItem>
                  <GridItem>
                    <FormLabel
                      fontSize="xs"
                      color={useColorModeValue("gray.600", "gray.400")}
                      mb={1}
                    >
                      Last Name
                    </FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="Last name"
                        className="auth-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        size="lg"
                        borderRadius="lg"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        pl="12"
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 2px ${useColorModeValue(
                            "blue.100",
                            "blue.900"
                          )}`,
                          transform: "scale(1.02)",
                        }}
                        _hover={{
                          borderColor: useColorModeValue(
                            "gray.300",
                            "gray.500"
                          ),
                        }}
                      />
                      <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        color={useColorModeValue("gray.400", "gray.500")}
                        zIndex={2}
                      >
                        <FaUser size={18} />
                      </Box>
                    </InputGroup>
                  </GridItem>

                  {/* Row 2 */}
                  <GridItem>
                    <FormLabel
                      fontSize="xs"
                      color={useColorModeValue("gray.600", "gray.400")}
                      mb={1}
                    >
                      Middle Name
                    </FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="Middle name"
                        className="auth-input"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        required
                        size="lg"
                        borderRadius="lg"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        pl="12"
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 2px ${useColorModeValue(
                            "blue.100",
                            "blue.900"
                          )}`,
                          transform: "scale(1.02)",
                        }}
                        _hover={{
                          borderColor: useColorModeValue(
                            "gray.300",
                            "gray.500"
                          ),
                        }}
                      />
                      <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        color={useColorModeValue("gray.400", "gray.500")}
                        zIndex={2}
                      >
                        <FaUser size={18} />
                      </Box>
                    </InputGroup>
                  </GridItem>
                  <GridItem>
                    <FormLabel
                      fontSize="xs"
                      color={useColorModeValue("gray.600", "gray.400")}
                      mb={1}
                    >
                      Email Address
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        size="lg"
                        borderRadius="lg"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        pl="12"
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 2px ${useColorModeValue(
                            "blue.100",
                            "blue.900"
                          )}`,
                          transform: "scale(1.02)",
                        }}
                        _hover={{
                          borderColor: useColorModeValue(
                            "gray.300",
                            "gray.500"
                          ),
                        }}
                      />
                      <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        color={useColorModeValue("gray.400", "gray.500")}
                        zIndex={2}
                      >
                        <FaEnvelope size={18} />
                      </Box>
                    </InputGroup>
                  </GridItem>

                  {/* Row 3 */}
                  <GridItem>
                    <FormLabel
                      fontSize="xs"
                      color={useColorModeValue("gray.600", "gray.400")}
                      mb={1}
                    >
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Create a password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={4}
                        size="lg"
                        borderRadius="lg"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        pl="12"
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 2px ${useColorModeValue(
                            "blue.100",
                            "blue.900"
                          )}`,
                          transform: "scale(1.02)",
                        }}
                        _hover={{
                          borderColor: useColorModeValue(
                            "gray.300",
                            "gray.500"
                          ),
                        }}
                      />
                      <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        color={useColorModeValue("gray.400", "gray.500")}
                        zIndex={2}
                      >
                        <FaLock size={18} />
                      </Box>
                      <InputRightElement height="100%" mr={1}>
                        <IconButton
                          aria-label={
                            showPass ? "Hide password" : "Show password"
                          }
                          icon={showPass ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          color={iconColor}
                          onClick={() => setShowPass(!showPass)}
                          _hover={{
                            bg: useColorModeValue("gray.100", "gray.600"),
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </GridItem>
                  <GridItem>
                    <FormLabel
                      fontSize="xs"
                      color={useColorModeValue("gray.600", "gray.400")}
                      mb={1}
                    >
                      Confirm Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        className="auth-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={4}
                        size="lg"
                        borderRadius="lg"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        pl="12"
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 2px ${useColorModeValue(
                            "blue.100",
                            "blue.900"
                          )}`,
                          transform: "scale(1.02)",
                        }}
                        _hover={{
                          borderColor: useColorModeValue(
                            "gray.300",
                            "gray.500"
                          ),
                        }}
                      />
                      <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        color={useColorModeValue("gray.400", "gray.500")}
                        zIndex={2}
                      >
                        <FaLock size={18} />
                      </Box>
                      <InputRightElement height="100%" mr={1}>
                        <IconButton
                          aria-label={
                            showConfirm ? "Hide password" : "Show password"
                          }
                          icon={showConfirm ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          color={iconColor}
                          onClick={() => setShowConfirm(!showConfirm)}
                          _hover={{
                            bg: useColorModeValue("gray.100", "gray.600"),
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </GridItem>
                </SimpleGrid>
              </FormControl>

              {/* Old single password block removed in favor of 2-column grid above */}

              {/* Account type and role are static (borrower/user) per requirements */}

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Creating Account..."
                {...primaryButtonProps}
              >
                Create Account
              </Button>

              {/* Sign In Link */}
              <Center>
                <Text fontSize="sm" color={subtle}>
                  Already have an account?{" "}
                  <Link
                    as={RouterLink}
                    to="/login"
                    color={accent}
                    fontWeight="600"
                    transition="all 0.3s"
                    _hover={{
                      textDecoration: "none",
                      color: useColorModeValue("blue.700", "blue.200"),
                      transform: "translateY(-1px)",
                    }}
                  >
                    Sign in
                  </Link>
                </Text>
              </Center>
            </Stack>
          </form>
        </Box>

        {/* Enhanced Footer */}
        <Center mt={8}>
          <VStack spacing={1}>
            <Text fontSize="xs" color={subtle} textAlign="center">
              © 2024 Travel Cars. All rights reserved.
            </Text>
            <Text fontSize="xs" color={subtle} textAlign="center" opacity={0.8}>
              Start your journey with us
            </Text>
          </VStack>
        </Center>
      </Flex>
    </Flex>
  );
}

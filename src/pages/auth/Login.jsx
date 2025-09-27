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
} from "@chakra-ui/react";
import { useState } from "react";
import "./auth.css";
import { Link as RouterLink } from "react-router-dom";
import { useLoginHandler } from "./hooks";
import {
  FaGoogle,
  FaFacebookF,
  FaEye,
  FaEyeSlash,
  FaCar,
  FaMapMarkerAlt,
  FaUmbrellaBeach,
  FaRoute,
} from "react-icons/fa";
import OrDivider from "../../components/auth/OrDivider";
import SocialButtonsLabeled from "../../components/auth/SocialButtonsLabeled";
import { primaryButtonProps } from "./styles";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onSubmit, loading } = useLoginHandler({ email, password });

  // Color values
  const cardBg = useColorModeValue("white", "gray.800");
  const subtle = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("blue.600", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
  );

  // Background Icons Component
  const BackgroundIcons = () => (
    <>
      {/* Static background icons with CSS animations */}
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

      {/* Additional smaller icons */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top={`${20 + i * 12}%`}
          left={`${5 + i * 15}%`}
          opacity={0.03}
          fontSize="2xl"
          color={accent}
          css={{
            animation: "pulse 4s ease-in-out infinite",
            animationDelay: `${i * 0.5}s`,
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.03 },
              "50%": { opacity: 0.01 },
            },
          }}
        >
          <FaCar />
        </Box>
      ))}
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
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.05; }
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
        w="400px"
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

        {/* Enhanced Login Card */}
        <Box
          bg={cardBg}
          p={8}
          rounded="2xl"
          shadow="xl"
          borderWidth="1px"
          borderColor={borderColor}
          position="relative"
          backdropFilter="blur(10px)"
        >
          <form onSubmit={onSubmit}>
            <Stack spacing={6}>
              {/* Email Field with Icon */}
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
                  Email address
                </FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                      borderColor: useColorModeValue("gray.300", "gray.500"),
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </Box>
                </InputGroup>
              </FormControl>

              {/* Password Field with Icon */}
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
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"
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
                      borderColor: useColorModeValue("gray.300", "gray.500"),
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </Box>
                  <InputRightElement height="100%" mr={1}>
                    <IconButton
                      aria-label={show ? "Hide password" : "Show password"}
                      icon={show ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                      color={iconColor}
                      onClick={() => setShow(!show)}
                      _hover={{
                        bg: useColorModeValue("gray.100", "gray.600"),
                        transform: "scale(1.1)",
                      }}
                      transition="all 0.2s"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Forgot Password */}
              <Box textAlign="right">
                <Link
                  fontSize="sm"
                  color={accent}
                  fontWeight="600"
                  transition="all 0.3s"
                  _hover={{
                    textDecoration: "none",
                    color: useColorModeValue("blue.700", "blue.200"),
                    transform: "translateX(2px)",
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

              {/* Submit Button */}
              <Button type="submit" isLoading={loading} loadingText="Signing in..." {...primaryButtonProps} className="auth-submit">
                Sign in
              </Button>

              {/* Divider */}
              <OrDivider color={subtle} />

              {/* Enhanced Social Login - Colored Buttons */}
              <SocialButtonsLabeled />

              {/* Sign Up Link */}
              <Center>
                <Text fontSize="sm" color={subtle}>
                  Don't have an account?{" "}
                  <Link
                    as={RouterLink}
                    to="/register"
                    color={accent}
                    fontWeight="600"
                    transition="all 0.3s"
                    _hover={{
                      textDecoration: "none",
                      color: useColorModeValue("blue.700", "blue.200"),
                      transform: "translateY(-1px)",
                    }}
                  >
                    Sign up now
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
              Your journey starts here
            </Text>
          </VStack>
        </Center>
      </Flex>
    </Flex>
  );
}

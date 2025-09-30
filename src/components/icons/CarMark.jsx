import { Icon } from "@chakra-ui/react";

export default function CarMark(props) {
  return (
    <Icon viewBox="0 0 64 40" role="img" focusable="false" {...props}>
      <title>Car logo</title>
      <rect x="10" y="16" width="44" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M18 16 L26 10 H40 L50 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="32" r="5" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="44" cy="32" r="5" fill="none" stroke="currentColor" strokeWidth="4" />
    </Icon>
  );
}

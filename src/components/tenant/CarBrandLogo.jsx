import React, { useMemo, useState } from "react";
import { Image, Text } from "@chakra-ui/react";

function toSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeBrand(brand) {
  const slug = toSlug(brand);
  const aliases = {
    vw: "volkswagen",
    "mercedes-benz": "mercedes",
    chevy: "chevrolet",
  };
  return aliases[slug] || slug;
}

const CarBrandLogo = ({ brand, size = 22 }) => {
  const [stage, setStage] = useState("local"); // local -> cdn -> fallback
  const slug = useMemo(() => normalizeBrand(brand || ""), [brand]);

  const src = useMemo(() => {
    if (!brand) return null;
    if (stage === "local") return `/brands/${slug}.svg`;
    if (stage === "cdn") return `https://cdn.simpleicons.org/${slug}`;
    return null;
  }, [brand, slug, stage]);

  // Fallback: just show the first letter, no background box
  if (!brand || stage === "fallback") {
    return (
      <Text fontWeight="bold" fontSize={Math.max(10, Math.floor(size * 0.7))}>
        {String(brand || "-")
          .charAt(0)
          .toUpperCase()}
      </Text>
    );
  }

  return (
    <Image
      src={src}
      alt={`${brand} logo`}
      boxSize={`${size}px`}
      objectFit="contain"
      onError={() =>
        setStage((prev) => (prev === "local" ? "cdn" : "fallback"))
      }
    />
  );
};

export default CarBrandLogo;

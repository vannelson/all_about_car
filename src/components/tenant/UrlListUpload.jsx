import React, { useCallback, useRef, useState } from "react";
import { Box, Icon, Text, Wrap, WrapItem, Image, IconButton, HStack, Input, Button, useToast } from "@chakra-ui/react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

export default function UrlListUpload({ value = [], onChange, max = 10 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const dropRef = useRef(null);
  const toast = useToast();

  const normalize = useCallback((urls) => {
    const out = [];
    (urls || []).forEach((u) => {
      const s = String(u || "").trim();
      if (/^https?:\/\//i.test(s)) out.push(s);
    });
    // unique preserve order
    return Array.from(new Set(out)).slice(0, max);
  }, [max]);

  const addUrls = useCallback((urls) => {
    const next = normalize([...(value || []), ...urls]);
    onChange && onChange(next);
  }, [normalize, value, onChange]);

  const removeAt = (idx) => {
    const next = (value || []).filter((_, i) => i !== idx);
    onChange && onChange(next);
  };
  const clearAll = () => onChange && onChange([]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dt = e.dataTransfer;
    const uriList = dt.getData("text/uri-list");
    const text = dt.getData("text");
    const files = dt.files;
    const urls = [];
    if (uriList) urls.push(...uriList.split(/\r?\n/).filter(Boolean));
    else if (text) urls.push(text);
    if (!uriList && !text && files && files.length) {
      toast({ title: "URLs only", description: "Please paste or drop image URLs (http/https)", status: "warning" });
      return;
    }
    if (urls.length) addUrls(urls);
  };
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const onAddClick = () => {
    const v = (urlInput || "").trim();
    if (!/^https?:\/\//i.test(v)) {
      toast({ title: "Invalid URL", description: "Please enter a valid http/https image URL", status: "error" });
      return;
    }
    addUrls([v]);
    setUrlInput("");
  };

  return (
    <Box>
      <Box
        ref={dropRef}
        border="2px dashed"
        borderColor={isDragging ? "blue.400" : "gray.300"}
        borderRadius="md"
        p={6}
        textAlign="center"
        position="relative"
        transition="all 0.2s"
        bg={isDragging ? "blue.50" : "transparent"}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <Icon as={FaCloudUploadAlt} boxSize={8} color="gray.400" mb={2} />
        <Text fontWeight="medium">Drag & drop image URLs or paste</Text>
        <Text fontSize="sm" color="gray.600" mt={1}>
          Up to {max} images ({(value || []).length}/{max} used)
        </Text>
      </Box>

      <HStack mt={3} spacing={2} align="stretch">
        <Input placeholder="https://your-hosted-image.png" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
        <Button onClick={onAddClick}>Add</Button>
        {value && value.length > 0 && (
          <Text ml="auto" fontSize="sm" color="blue.500" cursor="pointer" onClick={clearAll} _hover={{ textDecoration: "underline" }}>
            Clear all
          </Text>
        )}
      </HStack>

      {value && value.length > 0 && (
        <Box mt={4}>
          <Text fontWeight="medium">Uploaded Images ({value.length})</Text>
          <Wrap spacing={3} mt={2}>
            {value.map((url, idx) => (
              <WrapItem key={`${url}-${idx}`} position="relative">
                <Box borderRadius="md" overflow="hidden" width="100px" height="70px" border="1px solid" borderColor="gray.200">
                  <Image src={url} alt={`ID ${idx + 1}`} objectFit="cover" w="100%" h="100%" />
                </Box>
                <IconButton aria-label="Remove" icon={<FaTimes />} size="xs" colorScheme="red" position="absolute" top={-2} right={-2} onClick={() => removeAt(idx)} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
    </Box>
  );
}


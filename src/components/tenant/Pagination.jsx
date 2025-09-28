import React, { useMemo } from "react";
import { Flex, Button } from "@chakra-ui/react";

const Pagination = ({ page = 1, limit = 6, hasNext = false, meta = null, onChange }) => {
  const totalPages = useMemo(() => {
    const lastPage = meta?.last_page;
    if (lastPage && lastPage > 0) return lastPage;
    return Math.max(1, hasNext ? (page || 1) + 1 : page || 1);
  }, [meta?.last_page, hasNext, page]);

  const currentPage = meta?.current_page || page || 1;

  const canPrev = currentPage > 1;
  const canNext = meta?.last_page ? currentPage < meta.last_page : hasNext;

  const handleGo = (p) => {
    if (!onChange) return;
    if (p < 1 || p === currentPage) return;
    onChange(p, limit);
  };

  return (
    <Flex justify="center" align="center" gap={2} mt={4}>
      <Button size="sm" variant="outline" onClick={() => handleGo(currentPage - 1)} isDisabled={!canPrev}>
        {"<"}
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          size="sm"
          colorScheme={p === currentPage ? "blue" : "gray"}
          variant={p === currentPage ? "solid" : "outline"}
          onClick={() => handleGo(p)}
        >
          {p}
        </Button>
      ))}
      <Button size="sm" variant="outline" onClick={() => handleGo(currentPage + 1)} isDisabled={!canNext}>
        {">"}
      </Button>
    </Flex>
  );
};

export default Pagination;


import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Stack,
  Skeleton,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Divider,
} from "@chakra-ui/react";
import Pagination from "../Pagination";
import { FiSearch } from "react-icons/fi";

function formatAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date) {
  if (!date) return "-";
  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return "-";
  }
}

function statusColor(status) {
  const value = String(status || "").toLowerCase();
  if (value === "paid") return "green";
  if (value === "pending") return "orange";
  if (value === "failed" || value === "cancelled") return "red";
  if (value === "refunded") return "purple";
  return "gray";
}

export default function PaymentHistoryTable({
  items = [],
  isLoading = false,
  page = 1,
  limit = 10,
  hasNext = false,
  meta = null,
  onPaginate,
  onSearch,
  searchValue = "",
}) {
  const laravelMeta = meta?.meta || meta;
  const total = laravelMeta?.total ?? meta?.total ?? items.length ?? 0;
  const lastPage = laravelMeta?.last_page || meta?.last_page || meta?.lastPage;

  return (
    <Stack spacing={0} borderRadius="lg" overflow="hidden" bg="white" shadow="sm">
      <Box px={4} py={3}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
        >
          <Box>
            <Text fontWeight="semibold">Payment History</Text>
            <Text fontSize="sm" color="gray.500">
              Showing {items.length} of {total} payment{total === 1 ? "" : "s"}
            </Text>
          </Box>
          {typeof onSearch === "function" ? (
            <InputGroup size="sm" maxW="260px">
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiSearch />
              </InputLeftElement>
              <Input
                placeholder="Quick search"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
              />
            </InputGroup>
          ) : null}
        </Stack>
      </Box>

      <Divider />

      <Box overflowX="auto">
        <Table size="sm" variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Date</Th>
              <Th isNumeric>Amount</Th>
              <Th>Status</Th>
              <Th>Method</Th>
              <Th>Reference</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading
              ? Array.from({ length: limit || 5 }).map((_, idx) => (
                  <Tr key={`payment-skel-${idx}`}>
                    <Td>
                      <Skeleton height="14px" />
                    </Td>
                    <Td isNumeric>
                      <Skeleton height="14px" />
                    </Td>
                    <Td>
                      <Skeleton height="14px" />
                    </Td>
                    <Td>
                      <Skeleton height="14px" />
                    </Td>
                    <Td>
                      <Skeleton height="14px" />
                    </Td>
                  </Tr>
                ))
              : null}

            {!isLoading && items.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <Box py={6} textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                      No payments recorded yet.
                    </Text>
                  </Box>
                </Td>
              </Tr>
            ) : null}

            {!isLoading &&
              items.map((payment) => (
                <Tr key={payment.id ?? payment.reference ?? Math.random()}>
                  <Td>{formatDate(payment.paid_at || payment.created_at)}</Td>
                  <Td isNumeric>{formatAmount(payment.amount)}</Td>
                  <Td>
                    <Badge colorScheme={statusColor(payment.status)}>
                      {payment.status || "Unknown"}
                    </Badge>
                  </Td>
                  <Td>{payment.method || "-"}</Td>
                  <Td>{payment.reference || "-"}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      <Divider />

      <Box px={4} py={3}>
        <Stack direction={{ base: "column", md: "row" }} align="center" justify="space-between">
          <Text fontSize="sm" color="gray.500">
            Page {page} of {lastPage || Math.max(1, Math.ceil(total / (limit || 1)))}
          </Text>
          <Pagination
            page={page}
            limit={limit}
            hasNext={hasNext}
            meta={laravelMeta}
            onChange={(nextPage, nextLimit) => onPaginate?.(nextPage, nextLimit)}
          />
        </Stack>
      </Box>
    </Stack>
  );
}

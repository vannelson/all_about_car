import React from "react";
import { Table, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react";

const BaseTable = ({
  columns = [],
  data = [],
  isNumeric = {},
  loading = false,
  emptyText = "No records.",
  size = "sm",
  variant = "simple",
  renderRowActions,
  rowKey = (row, idx) => row.id ?? idx,
}) => {
  return (
    <Table size={size} variant={variant}>
      <Thead>
        <Tr>
          {columns.map((col, i) => (
            <Th key={i} isNumeric={col.isNumeric}>{col.header}</Th>
          ))}
          {renderRowActions && <Th></Th>}
        </Tr>
      </Thead>
      <Tbody>
        {loading ? (
          <Tr>
            <Td colSpan={columns.length + (renderRowActions ? 1 : 0)}>
              <Text fontSize="sm" color="gray.500">Loading...</Text>
            </Td>
          </Tr>
        ) : data.length === 0 ? (
          <Tr>
            <Td colSpan={columns.length + (renderRowActions ? 1 : 0)}>
              <Text fontSize="sm" color="gray.500">{emptyText}</Text>
            </Td>
          </Tr>
        ) : (
          data.map((row, idx) => (
            <Tr key={rowKey(row, idx)} _hover={{ bg: 'gray.50' }}>
              {columns.map((col, i) => (
                <Td key={i} isNumeric={col.isNumeric} textTransform={col.textTransform}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </Td>
              ))}
              {renderRowActions && (
                <Td>{renderRowActions(row)}</Td>
              )}
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};

export default BaseTable;


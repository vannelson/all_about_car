import React, { useEffect, useMemo, useState } from "react";
import { HStack, InputGroup, InputLeftElement, Input, Button, Switch, Text, IconButton } from "@chakra-ui/react";
import { SearchIcon, DeleteIcon } from "@chakra-ui/icons";
import BaseTable from "../../base/BaseTable";
import { listCarRatesApi, updateCarRateApi, deleteCarRateApi } from "../../../services/cars";

const RatesTable = ({ carId, refreshSignal = 0 }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const load = async ({ q = "" } = {}) => {
    if (!carId) return;
    setLoading(true);
    try {
      const res = await listCarRatesApi({ page: 1, limit: 10, filters: { car_id: carId, name: q }, order: ["id", "desc"] });
      setItems(Array.isArray(res?.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ q: search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, refreshSignal]);

  const columns = useMemo(() => [
    { header: "Name", accessor: "name" },
    { header: "Rate", accessor: "rate", isNumeric: true, render: (r) => Number(r.rate).toLocaleString() },
    { header: "Type", accessor: "rate_type", render: (r) => String(r.rate_type).toLowerCase() },
    { header: "Status", accessor: "status", render: (r) => (
        <HStack>
          <Switch size="sm" colorScheme="green" isChecked={String(r.status).toLowerCase()==='active'} onChange={async ()=>{
            const next = String(r.status).toLowerCase()==='active' ? 'inactive' : 'active';
            await updateCarRateApi({ id: r.id, status: next });
            await load({ q: search });
          }} />
          <Text fontSize="xs" color="gray.600">{r.status}</Text>
        </HStack>
      ) },
    { header: "Created", accessor: "created_at", render: (r)=> r.created_at || r.start_date || '-' },
  ], []);

  return (
    <>
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="semibold">Existing Rates</Text>
        <HStack>
          <InputGroup maxW="240px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Search name" value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') load({ q: e.currentTarget.value }); }} />
          </InputGroup>
          <Button size="sm" onClick={()=>load({ q: search })} isLoading={loading}>Refresh</Button>
        </HStack>
      </HStack>
      <BaseTable
        columns={columns}
        data={items}
        loading={loading}
        emptyText="No rates found."
        renderRowActions={(row)=>(
          <IconButton size="sm" aria-label="Delete rate" icon={<DeleteIcon />} onClick={async ()=>{ await deleteCarRateApi(row.id); await load({ q: search }); }} />
        )}
      />
    </>
  );
};

export default RatesTable;

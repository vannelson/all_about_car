import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../store/carsSlice";
import { mapCarsFiltersToApi } from "../utils/helpers/carFilters";

const buildKey = (filters, limit) =>
  JSON.stringify({ filters, limit: limit ?? null });

export function useCarsData({
  filters = {},
  autoFetch = true,
  limit: initialLimit,
} = {}) {
  const dispatch = useDispatch();
  const {
    items,
    page,
    limit,
    hasNext,
    meta,
    listLoading,
    listError,
  } = useSelector((state) => state.cars);

  const apiFilters = useMemo(
    () => mapCarsFiltersToApi(filters),
    [filters]
  );

  const desiredLimit = initialLimit ?? limit ?? 10;
  const lastFetchKey = useRef(null);

  const fetchPage = useCallback(
    ({
      page: targetPage = 1,
      limit: pageLimit,
      filters: overrideFilters,
    } = {}) => {
      const appliedFilters = overrideFilters ?? apiFilters;
      const appliedLimit = pageLimit ?? desiredLimit;
      lastFetchKey.current = buildKey(appliedFilters, appliedLimit);
      dispatch(
        fetchCars({
          page: targetPage,
          limit: appliedLimit,
          filters: appliedFilters,
        })
      );
    },
    [dispatch, apiFilters, desiredLimit]
  );

  useEffect(() => {
    if (!autoFetch) return;
    const nextKey = buildKey(apiFilters, desiredLimit);
    if (lastFetchKey.current === nextKey) return;
    lastFetchKey.current = nextKey;
    fetchPage({ page: 1, limit: desiredLimit, filters: apiFilters });
  }, [autoFetch, apiFilters, desiredLimit, fetchPage]);

  const refresh = useCallback(
    () =>
      fetchPage({
        page: page || 1,
        limit: desiredLimit,
        filters: apiFilters,
      }),
    [fetchPage, page, desiredLimit, apiFilters]
  );

  return {
    cars: items,
    page,
    limit,
    hasNext,
    meta,
    listLoading,
    listError,
    fetchPage,
    refresh,
  };
}

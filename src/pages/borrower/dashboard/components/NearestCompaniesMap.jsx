import { memo, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = { lat: 14.5995, lng: 120.9842 }; // Manila
const FALLBACK_LOGO =
  "https://via.placeholder.com/64x64.png?text=Logo";

const parseCoordinate = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return NaN;
    const parsed = parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
};

const buildLatLng = (lat, lng) => {
  const parsedLat = parseCoordinate(lat);
  const parsedLng = parseCoordinate(lng);
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return null;
  }
  return [parsedLat, parsedLng];
};

const createBounds = (points = []) => {
  const validPoints = points.filter(Boolean);
  if (!validPoints.length) return null;
  return L.latLngBounds(validPoints);
};

const FitBounds = ({ bounds, fallbackCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else if (fallbackCenter) {
      map.setView(fallbackCenter, 13);
    }
  }, [map, bounds, fallbackCenter]);

  return null;
};

FitBounds.propTypes = {
  bounds: PropTypes.object,
  fallbackCenter: PropTypes.arrayOf(PropTypes.number),
};

function NearestCompaniesMap({ companies, userCoords, radiusMeters = 10000 }) {
  const companyPositions = useMemo(
    () =>
      (companies || [])
        .map((company) => ({
          id: company.id,
          name: company.name,
          position: buildLatLng(company.latitude, company.longitude),
          logo: company.logo_url || company.logo || null,
          address: company.address,
          distanceLabel: company.distance_km
            ? `${Number(company.distance_km).toFixed(1)} km`
            : company.distance_m
            ? `${Math.round(company.distance_m)} m`
            : null,
        }))
        .filter((item) => Boolean(item.position)),
    [companies]
  );

  const userPosition = useMemo(
    () => (userCoords ? buildLatLng(userCoords.latitude, userCoords.longitude) : null),
    [userCoords]
  );

  const bounds = useMemo(() => {
    const points = [];
    if (userPosition) points.push(userPosition);
    companyPositions.forEach((item) => {
      if (item.position) points.push(item.position);
    });
    return createBounds(points);
  }, [companyPositions, userPosition]);

  const mapCenter = useMemo(() => {
    if (userPosition) return userPosition;
    if (companyPositions.length > 0) return companyPositions[0].position;
    return [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
  }, [userPosition, companyPositions]);

  const showRadius = Number.isFinite(Number(radiusMeters)) && radiusMeters > 0 && userPosition;

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ width: "100%", height: "320px", borderRadius: "16px" }}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds bounds={bounds} fallbackCenter={mapCenter} />

      {showRadius && (
        <Circle
          center={userPosition}
          radius={Number(radiusMeters)}
          pathOptions={{ color: "#3182ce", fillColor: "#3182ce", opacity: 0.25, fillOpacity: 0.08 }}
        />
      )}

      {userPosition && (
        <CircleMarker
          center={userPosition}
          radius={10}
          pathOptions={{ color: "#3182ce", fillColor: "#3182ce", fillOpacity: 0.9 }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={0.85}>
            You are here
          </Tooltip>
        </CircleMarker>
      )}

      {companyPositions.map((company) => (
        <CircleMarker
          key={company.id || company.name}
          center={company.position}
          radius={11}
          pathOptions={{ color: "#e53e3e", fillColor: "#e53e3e", fillOpacity: 0.9 }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
            {company.name || "Company"}
          </Tooltip>
          <Popup>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={company.logo || FALLBACK_LOGO}
                  alt={company.name || "Company"}
                  width="48"
                  height="48"
                  style={{ borderRadius: "12px", objectFit: "cover" }}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_LOGO;
                  }}
                />
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>
                    {company.name || "Company"}
                  </strong>
                  {company.distanceLabel && (
                    <span style={{ fontSize: "0.8rem", color: "#555" }}>
                      {company.distanceLabel} away
                    </span>
                  )}
                </div>
              </div>
              {company.address && (
                <div style={{ fontSize: "0.8rem", color: "#444" }}>{company.address}</div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

NearestCompaniesMap.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.object),
  userCoords: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  radiusMeters: PropTypes.number,
};

NearestCompaniesMap.defaultProps = {
  companies: [],
  userCoords: null,
  radiusMeters: 10000,
};

export default memo(NearestCompaniesMap);

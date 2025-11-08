import { memo, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  Tooltip,
  useMap,
  Marker,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = { lat: 14.5995, lng: 120.9842 }; // Manila
const FALLBACK_LOGO = "https://via.placeholder.com/64x64.png?text=Logo";

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

const ensureMarkerStyles = () => {
  const styleId = "nearest-company-marker-styles";
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    .company-marker-wrapper {
      position: relative;
      transform: translate(-50%, -100%);
      pointer-events: none;
    }
    .company-marker {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 12px 24px rgba(59, 130, 246, 0.35);
      border: 2px solid rgba(255, 255, 255, 0.9);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      pointer-events: auto;
    }
    .company-marker.active {
      transform: scale(1.12);
      box-shadow: 0 16px 32px rgba(59, 130, 246, 0.45);
    }
    .company-marker:hover {
      transform: scale(1.15);
      box-shadow: 0 18px 36px rgba(59, 130, 246, 0.5);
    }
    .company-marker__avatar {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .company-marker__avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .company-marker__avatar span {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .company-marker__shadow {
      content: "";
      position: absolute;
      top: 44px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 10px;
      background: rgba(30, 58, 138, 0.18);
      border-radius: 50%;
      filter: blur(3px);
    }
  `;
  document.head.appendChild(style);
};

const computeInitials = (name) => {
  if (!name) return "CO";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getCompanyIdentifier = (company) => {
  if (!company) return null;
  const candidate =
    company.id ??
    company.company_id ??
    company.uuid ??
    company.slug ??
    company.name ??
    null;
  if (candidate === null || candidate === undefined) return null;
  return String(candidate);
};

const gradients = [
  ["#2563EB", "#38BDF8"],
  ["#9333EA", "#EC4899"],
  ["#F97316", "#FACC15"],
  ["#0EA5E9", "#22D3EE"],
  ["#16A34A", "#84CC16"],
  ["#FB7185", "#F472B6"],
];

const gradientForId = (id) => {
  if (!id && id !== 0) return gradients[0];
  const index = Math.abs(Number(id)) % gradients.length;
  return gradients[index];
};

const markerIconForCompany = (company, isActive) => {
  const [from, to] = gradientForId(company.id);
  const initials = computeInitials(company.name);
  const avatar = company.logo
    ? `<img src="${company.logo}" alt="${company.name || "Company"}" onerror="this.src='${FALLBACK_LOGO}'" />`
    : `<span>${initials}</span>`;

  const html = `
    <div class="company-marker-wrapper">
      <div class="company-marker ${isActive ? "active" : ""}" style="background: linear-gradient(135deg, ${from}, ${to});">
        <div class="company-marker__avatar">
          ${avatar}
        </div>
      </div>
      <div class="company-marker__shadow"></div>
    </div>
  `;

  return L.divIcon({
    html,
    iconSize: [52, 52],
    iconAnchor: [26, 52],
    popupAnchor: [0, -54],
    className: "company-marker-icon",
  });
};

const FitBounds = ({ bounds, fallbackCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
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

function NearestCompaniesMap({
  companies,
  userCoords,
  radiusMeters = 10000,
  activeCompanyId,
  onMarkerClick,
}) {
  useEffect(() => {
    ensureMarkerStyles();
  }, []);

  const companyPositions = useMemo(
    () =>
      (companies || [])
        .map((company) => ({
          id: getCompanyIdentifier(company),
          originalId: company.id ?? null,
          name: company.name,
          position: buildLatLng(company.latitude, company.longitude),
          logo: company.logo_url || company.logo || null,
          address: company.address,
          availableCount: Array.isArray(company.cars) ? company.cars.length : company.available_car_count ?? 0,
          distanceLabel: company.distance_km
            ? `${Number(company.distance_km).toFixed(1)} km`
            : company.distance_m
            ? `${Math.round(company.distance_m)} m`
            : null,
          original: company,
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
      style={{ width: "100%", height: "100%", minHeight: "320px" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomControl position="topright" />
      <FitBounds bounds={bounds} fallbackCenter={mapCenter} />

      {showRadius && (
        <Circle
          center={userPosition}
          radius={Number(radiusMeters)}
          pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", opacity: 0.25, fillOpacity: 0.08 }}
        />
      )}

      {companyPositions.map((company) => (
        <Marker
          key={company.id || company.name}
          position={company.position}
          icon={markerIconForCompany(company, activeCompanyId === company.id)}
          eventHandlers={{
            click: () => onMarkerClick?.(company.original),
          }}
        >
          <Tooltip direction="top" offset={[0, -40]} opacity={0.95} className="company-tooltip">
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "200px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.95rem" }}>{company.name || "Company"}</strong>
                {company.distanceLabel && (
                  <span style={{ fontSize: "0.75rem", color: "#1D4ED8" }}>{company.distanceLabel}</span>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#475569" }}>
                {company.availableCount} cars {"\u2022"} Affordable rentals near you
              </span>
            </div>
          </Tooltip>
          <Popup>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={company.logo || FALLBACK_LOGO}
                  alt={company.name || "Company"}
                  width="58"
                  height="58"
                  style={{ borderRadius: "16px", objectFit: "cover" }}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_LOGO;
                  }}
                />
                <div>
                  <strong style={{ display: "block", fontSize: "1rem" }}>
                    {company.name || "Company"}
                  </strong>
                  {company.distanceLabel && (
                    <span style={{ fontSize: "0.8rem", color: "#3B82F6" }}>
                      {company.distanceLabel} away
                    </span>
                  )}
                </div>
              </div>
              {company.address && (
                <div style={{ fontSize: "0.82rem", color: "#475569" }}>{company.address}</div>
              )}
              <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                {company.availableCount} vehicles ready {"\u2022"} Book instantly with your preferred fleet.
              </div>
            </div>
          </Popup>
        </Marker>
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
  activeCompanyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onMarkerClick: PropTypes.func,
};

NearestCompaniesMap.defaultProps = {
  companies: [],
  userCoords: null,
  radiusMeters: 10000,
  activeCompanyId: null,
  onMarkerClick: undefined,
};

export default memo(NearestCompaniesMap);

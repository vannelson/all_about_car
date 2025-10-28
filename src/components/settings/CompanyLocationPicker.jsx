import { memo, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents, useMap } from "react-leaflet";
import { Box, Text, VStack } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DEFAULT_CENTER = { lat: 14.5995, lng: 120.9842 }; // Manila, PH

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const parseCoordinate = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return NaN;
    const parsed = parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
};

const CompanyLocationPicker = ({
  latitude,
  longitude,
  onLocationChange,
  mapHeight = "240px",
  footer,
}) => {
  const center = useMemo(() => {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return DEFAULT_CENTER;
    }
    return { lat, lng };
  }, [latitude, longitude]);

  const zoom = useMemo(() => {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return 15;
    }
    return 6;
  }, [latitude, longitude]);

  const hasLocation = useMemo(() => {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);
    return Number.isFinite(lat) && Number.isFinite(lng);
  }, [latitude, longitude]);

  const mapCenter = useMemo(() => [center.lat, center.lng], [center]);

  return (
    <VStack align="stretch" spacing={3}>
      <Box
        borderRadius="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
        h={mapHeight}
        sx={{
          ".leaflet-container": {
            width: "100%",
            height: "100%",
          },
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          zoomControl={false}
          style={{ width: "100%", height: "100%" }}
          attributionControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          <MapViewUpdater center={mapCenter} zoom={zoom} />
          {hasLocation ? (
            <Marker
              position={[parseCoordinate(latitude), parseCoordinate(longitude)]}
              icon={markerIcon}
            />
          ) : null}
          <LeafletClick onLocationChange={onLocationChange} />
        </MapContainer>
      </Box>

      {footer ? (
        footer
      ) : (
        <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }} textAlign="center">
          Click the map to drop a pin and capture the company coordinates.
        </Text>
      )}

    </VStack>
  );
};

const LeafletClick = ({ onLocationChange }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onLocationChange(lat, lng);
    },
  });
  return null;
};

LeafletClick.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
};

const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const [lat, lng] = center;
    const current = map.getCenter();
    const currentZoom = map.getZoom();
    if (
      Math.abs(current.lat - lat) < 1e-6 &&
      Math.abs(current.lng - lng) < 1e-6 &&
      currentZoom === zoom
    ) {
      return;
    }
    map.flyTo([lat, lng], zoom, { animate: true, duration: 0.35 });
  }, [map, center, zoom]);

  return null;
};

MapViewUpdater.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

CompanyLocationPicker.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLocationChange: PropTypes.func.isRequired,
  mapHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  footer: PropTypes.node,
};

CompanyLocationPicker.defaultProps = {
  latitude: "",
  longitude: "",
  mapHeight: "240px",
  footer: null,
};

export default memo(CompanyLocationPicker);

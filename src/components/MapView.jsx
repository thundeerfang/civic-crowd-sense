import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import IssuesSidebar from "./IssuesSidebar";
import ImageModal from "./ImageModal";
import axios from "axios";
import { MapPinIcon, User, Phone, Clock, Camera } from "lucide-react";
import { getComplaintImageUrl } from "../data/awsimage"; // ✅ import AWS helper 


const MapView = ({ language = "en", translations }) => {
  const [issues, setIssues] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 75.8577,
    latitude: 22.7196,
    zoom: 12,
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const indoreBounds = [
    [75.75, 22.60],
    [75.95, 22.83],
  ];

  // Fetch issues without blocking on reverse geocoding
// Fetch issues from your updated API
const fetchIssues = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/getIssueTmp");
    const rawIssues = res.data.issues; // ⚠️ note: now inside `issues`

    const normalized = await Promise.all(
      rawIssues.map(async (issue) => {
        const lat = issue.latitude;
        const lng = issue.longitude;

        // Reverse geocoding
        let address = "Unknown address";
        if (lat && lng) {
          try {
            const geoRes = await axios.get("https://nominatim.openstreetmap.org/reverse", {
              params: { lat, lon: lng, format: "json", addressdetails: 1 },
              headers: { "Accept-Language": language },
            });
            const { postcode, city, state, suburb, town, village } = geoRes.data.address || {};
            address = ` ${state || ""} - ${postcode || ""}`;
          } catch (err) {
            address = translations.noAddress || "Unknown address";
          }
        }

        // Created date
        const createdAtDate = issue.created_at?._seconds
          ? new Date(issue.created_at._seconds * 1000)
          : new Date();

        // Use complaint image from AWS
     let imageUrls = [];
try {
  const complaintId = issue.complaint?.id || issue.complaintId;
  const userId = issue.user?.id || issue.userId;

  if (complaintId && userId) {
    const url = await getComplaintImageUrl(userId, complaintId);
    if (url) imageUrls.push(url);
  }
} catch (err) {
  console.error("Error fetching complaint image:", err);
}

        return {
          ...issue,
          images: imageUrls.map((url) => ({ url, caption: issue.title || "Issue image" })),
          location: { ...issue.location, lat, lng, address },
          createdAtDate,
        };
      })
    );

    setIssues(normalized);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching issues:", error);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Only valid lat/lng
  const validIssues = issues.filter(
    (issue) =>
      issue.location?.lat &&
      issue.location?.lng &&
      issue.location.lat >= 22.6 &&
      issue.location.lat <= 22.83 &&
      issue.location.lng >= 75.75 &&
      issue.location.lng <= 75.95
  );

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: translations.Pending,
      assigned: translations.Assigned,
      "in-progress": translations.InProgress,
      completed: translations.Completed,
    };
    return labels[status] || status;
  };

const getPriorityLabel = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return translations?.High || "उच्च";
    case "medium":
      return translations?.Medium || "मध्यम";
    case "low":
      return translations?.Low || "कम";
    default:
      return priority || "";
  }
};

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Loading issues...
      </div>
    );

  return (
    <div className="flex h-full bg-gray-50">
      {/* Map */}
      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          attributionControl={false}
          maxBounds={indoreBounds}
        >
          {validIssues.map((issue) => (
            <Marker
              key={issue.id}
              longitude={issue.location.lng}
              latitude={issue.location.lat}
              anchor="bottom"
            >
              <div
                className="relative cursor-pointer transform transition-transform hover:scale-110"
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowPopup(true);
                }}
                onMouseEnter={async () => {
                  setHoveredIssue(issue);
                  // Fetch address on hover if needed
                  if (!issue.location.address && issue.location.lat && issue.location.lng) {
                    try {
                      const geoRes = await axios.get(
                        "https://nominatim.openstreetmap.org/reverse",
                        {
                          params: {
                            lat: issue.location.lat,
                            lon: issue.location.lng,
                            format: "json",
                            addressdetails: 1,
                          },
                          headers: { "Accept-Language": "en" },
                        }
                      );
                      const { postcode, city, state, suburb, town, village } =
                        geoRes.data.address || {};
                      issue.location.address = `${suburb || town || village || ""}, ${
                        city || town || village || ""
                      }, ${state || ""} - ${postcode || ""}`;
                      setIssues((prev) => [...prev]); // trigger re-render
                    } catch (err) {
                      issue.location.address = translations.noAddress || "Unknown address";
                    }
                  }
                }}
                onMouseLeave={() => setHoveredIssue(null)}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: getPriorityColor(issue.priority) }}
                >
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs">
                  {getPriorityIcon(issue.priority)}
                </div>

                {hoveredIssue?.id === issue.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-64 z-10">
                    <div className="space-y-2 text-xs text-gray-600">
                      
                      <div className="font-semibold">{issue.title}</div>
                      <div>{issue.location.address || translations.noAddress}</div>

                      
                    </div>
                    
                  </div>
                )}
              </div>
            </Marker>
          ))}

{selectedIssue && showPopup && (
  <Popup
    longitude={selectedIssue.location.lng}
    latitude={selectedIssue.location.lat}
    anchor="top"
    onClose={() => {
      setShowPopup(false);
      setSelectedIssue(null);
    }}
    closeButton
    closeOnClick={false}
  >
    <div className="p-4 max-w-sm space-y-3 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-blue-600 text-sm">
          {selectedIssue.issue_id}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            selectedIssue.priority?.toLowerCase() === "high"
              ? "bg-red-100 text-red-800"
              : selectedIssue.priority?.toLowerCase() === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {getPriorityLabel(selectedIssue.priority)}
        </span>
      </div>

     
      <p className="text-sm text-gray-600 line-clamp-3">
        {selectedIssue.complaint.description}
      </p>

      {/* Location */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <MapPinIcon className="w-4 h-4" /> 
        <span>{selectedIssue.location.address || translations.noAddress}</span>
      </div>

      {/* Images */}
      <div className="flex space-x-2 overflow-x-auto py-2">
                {(selectedIssue.images || []).map((img, idx) => (
  <img
    key={idx}
    src={img.url}
    alt={`issue-${idx}`}
    className="w-16 h-16 object-cover rounded-lg cursor-pointer border border-gray-200 hover:scale-105 transition-transform"
    onClick={() => {
      setSelectedImages(selectedIssue.images);
      setCurrentImageIndex(idx);
      setShowImageModal(true);
    }}
  />
))}
                </div>
    </div>
  </Popup>
)}


        </Map>
      </div>

      {/* Sidebar */}
      <IssuesSidebar
        issues={validIssues}
        onIssueSelect={(issue) => {
          setSelectedIssue(issue);
          setViewState((prev) => ({
            ...prev,
            longitude: issue.location.lng,
            latitude: issue.location.lat,
            zoom: 15,
          }));
          setShowPopup(true);
        }}
        selectedIssue={selectedIssue}
      />


      {/* Image Modal */}
{showImageModal && (
  <ImageModal
    images={selectedImages}
    initialIndex={currentImageIndex}
    onClose={() => setShowImageModal(false)}
  />
)}
    </div>

    
  );
};

export default MapView;

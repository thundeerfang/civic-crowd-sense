import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Search, AlertCircle, Calendar, MapPin, Phone, User } from 'lucide-react';
import AssignDepartmentModal from './AssignDepartmentModal';

// 🔹 Firebase imports
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const db = getFirestore(getApp());

const ComplainantPage = ({ departments, onAssignDepartment, language, translations }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // 🔹 Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/getComplaintsWithLocation');
      const rawComplaints = res.data.complaints || [];

      const complaintsWithData = await Promise.all(
        rawComplaints.map(async (c) => {
          let address = translations.noAddress;

          // 🔹 Reverse Geocode (lat/lng -> Address)
          if (c.latitude && c.longitude) {
            try {
              const geoRes = await axios.get(
                'https://nominatim.openstreetmap.org/reverse',
                {
                  params: {
                    lat: c.latitude,
                    lon: c.longitude,
                    format: 'json',
                    addressdetails: 1,
                  },
                  headers: { 'User-Agent': 'YourAppName/1.0' },
                }
              );

              if (geoRes.data?.address) {
                const { postcode, city, state, suburb, town, village } =
                  geoRes.data.address;
                address = `${suburb || town || village || ''}, ${
                  city || town || village || ''
                }, ${state || ''} - ${postcode || ''}`;
              }
            } catch (err) {
              console.error('Reverse geocoding error:', err);
            }
          }

          // 🔹 Fetch user details from Firebase
          let userName = translations.noUser;
          let phoneNumber = translations.noPhone;
          if (c.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'user_master', c.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                userName = userData.full_name || translations.noUser;
                phoneNumber = userData.phone_no || translations.noPhone;
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
            }
          }

          return {
            ...c,
            location: { address },
            createdAtDate: c.createdAt?._seconds
              ? new Date(c.createdAt._seconds * 1000)
              : null,
            userName,
            phoneNumber,
            isNew: true, // only new ones skeleton
          };
        })
      );

      setComplaints((prev) => [
        ...complaintsWithData.map((c) => ({ ...c, isNew: true })),
        ...prev.map((c) => ({ ...c, isNew: false })),
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  // 🔹 Initial fetch + refresh every 15s
  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 15000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Remove skeleton after 1.5s for new items
  useEffect(() => {
    if (complaints.some((c) => c.isNew)) {
      const timer = setTimeout(() => {
        setComplaints((prev) => prev.map((c) => ({ ...c, isNew: false })));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [complaints]);

  // 🔹 Filters
  const filteredComplaints = complaints.filter((c) => {
    const safeLower = (val) => (val ? val.toLowerCase() : '');
    const matchesSearch =
      safeLower(c.description).includes(searchTerm.toLowerCase()) ||
      safeLower(c.complaintId).includes(searchTerm.toLowerCase()) ||
      safeLower(c.userName).includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAssignDepartment = (complaintId, departmentIds) => {
    onAssignDepartment(complaintId, departmentIds);
    setShowAssignModal(false);
    setSelectedComplaint(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {translations.complaintManagement}
        </h2>
        <p className="text-gray-600">{translations.complaintManagementDesc}</p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={translations.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{translations.allStatus}</option>
                <option value="submitted">{translations.submitted}</option>
                <option value="in-progress">{translations.inProgress}</option>
                <option value="resolved">{translations.resolved}</option>
                <option value="rejected">{translations.rejected}</option>
              </select>
            </div>
          </div>

          {/* Complaints Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <div
                  key={c.complaintId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {c.isNew ? (
                    <div className="p-4">
                      <Skeleton height={20} width={120} className="mb-2" />
                      <Skeleton height={15} count={2} />
                      <Skeleton height={30} className="mt-4" />
                    </div>
                  ) : (
                    <>
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {c.complaintId}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {c.description || translations.noDescription}
                        </p>
                      </div>

                      {/* Complaint Details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User size={16} />
                          <span>{c.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone size={16} />
                          <span>{c.phoneNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span className="line-clamp-1">
                            {c.location?.address || translations.noAddress}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>
                            {c.createdAtDate
                              ? c.createdAtDate.toLocaleString(
                                  language === 'hi' ? 'hi-IN' : 'en-IN'
                                )
                              : translations.noDate}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 col-span-2">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {translations.noComplaintsFound}
                </h3>
                <p className="text-gray-500">
                  {translations.noComplaintsFoundDesc}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Assign Department Modal */}
      {showAssignModal && selectedComplaint && (
        <AssignDepartmentModal
          issue={selectedComplaint}
          departments={departments}
          onAssign={handleAssignDepartment}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedComplaint(null);
          }}
          language={language}
          translations={translations}
        />
      )}
    </div>
  );
};

export default ComplainantPage;

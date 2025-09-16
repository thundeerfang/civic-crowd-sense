import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, Listbox } from "@headlessui/react";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AlertCircle, Calendar, MapPin, Eye, RefreshCw, Check, ChevronsDownUp, Search, CheckCircle, Circle } from 'lucide-react';
import AssignDepartmentModal from './AssignDepartmentModal';
import LoadingSpinner from './LoadingSpinner';
import ProgressBar from './ProgressBar';

const IssuesPage = ({ departments, onAssignDepartment, language, translations }) => {
  const [issues, setIssues] = useState([]);
  const [viewIssue, setViewIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);

  useEffect(() => {
    if (!showAssignModal) {
      setSelectedIssue(null);
    }
  }, [showAssignModal]);

  const statusOptions = [
    { value: "all", label: translations.allStatus },
    { value: "pending", label: translations.pending },
    { value: "assigned", label: translations.assigned },
    { value: "in-progress", label: translations.inProgress },
    { value: "completed", label: translations.completed },
  ];

  const priorityOptions = [
    { value: "all", label: translations.allPriority },
    { value: "high", label: translations.high },
    { value: "medium", label: translations.medium },
    { value: "low", label: translations.low },
  ];

  const fetchIssues = async () => {
    try {
      setFetchProgress(10);
      const res = await axios.get("http://localhost:8080/api/getIssueTmp");
      setFetchProgress(30);
      
      const rawIssues = res.data.issues || [];
      setFetchProgress(50);

      const normalized = await Promise.all(
        rawIssues.map(async (issue, index) => {
          setFetchProgress(50 + (index / rawIssues.length) * 40);
          
          const lat = issue.latitude;
          const lng = issue.longitude;

          let address = translations.noAddress;
          if (lat && lng) {
            try {
              const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                params: { lat, lon: lng, format: "json", addressdetails: 1 },
                headers: { "Accept-Language": "en", "User-Agent": "YourAppName/1.0" },
              });
              if (res.data?.address) {
                const { postcode, city, state, suburb, town, village } = res.data.address;
                address = `${state || ""} - ${postcode || ""}`;
              }
            } catch (err) {
              console.error("Reverse geocoding error", err);
            }
          }

          return {
            ...issue,
            location: { ...issue.location, address },
            createdAtDate: issue.created_at?._seconds
              ? new Date(issue.created_at._seconds * 1000)
              : new Date(),
          };
        })
      );

      setFetchProgress(100);
      
      setIssues((prev) => {
        const prevIds = prev.map((i) => i.id);
        const fresh = normalized.filter((i) => !prevIds.includes(i.id));
        const freshWithFlag = fresh.map((i) => ({ ...i, isNew: true }));
        const merged = [...freshWithFlag, ...prev];
        merged.sort((a, b) => b.createdAtDate - a.createdAtDate);
        return merged;
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (issues.some((i) => i.isNew)) {
      const timer = setTimeout(() => {
        setIssues((prev) => prev.map((i) => ({ ...i, isNew: false })));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [issues]);

  const filteredIssues = issues.filter(issue => {
    const safeLower = (val) => (val ? val.toLowerCase() : '');
    const matchesSearch =
      safeLower(issue.title).includes(searchTerm.toLowerCase()) ||
      safeLower(issue.complaintNumber).includes(searchTerm.toLowerCase()) ||
      safeLower(issue.userName).includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-red-600 bg-red-100';
      case 'Assigned': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsComplete = async (issueId) => {
    try {
      await axios.patch(`http://localhost:8080/api/issues/${issueId}`, { status: 'completed' });
      fetchIssues();
      setShowTrackingModal(false);
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {translations.issueManagement}
          </h2>
          <p className="text-gray-600 mb-4">{translations.issueManagementDesc}</p>
          
          {loading && (
            <div className="mt-4">
              <ProgressBar progress={fetchProgress} showPercentage={true} />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
          <LoadingSpinner size="lg" color="blue" text="Loading issues..." />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={translations.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <Listbox value={filterStatus} onChange={setFilterStatus}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <span className="block truncate">
                      {statusOptions.find((s) => s.value === filterStatus)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronsDownUp className="h-4 w-4 text-gray-400" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                      {statusOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                              active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {option.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <Check className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              {/* Priority Filter */}
              <Listbox value={filterPriority} onChange={setFilterPriority}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <span className="block truncate">
                      {priorityOptions.find((p) => p.value === filterPriority)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronsDownUp className="h-4 w-4 text-gray-400" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                      {priorityOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                              active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {option.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <Check className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Issues Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <div
                  key={issue.issue_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {issue.isNew ? (
                    <div className="p-6">
                      <Skeleton height={20} width={120} className="mb-3" />
                      <Skeleton height={15} count={2} className="mb-4" />
                      <Skeleton height={30} />
                    </div>
                  ) : (
                    <>
                      {/* Issue Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {issue.issue_id || translations.noComplaintNumber}
                          </h3>
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                              {issue.priority}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </div>
                        </div>
                        <h2 className="font-semibold text-gray-800 text-lg mb-2">
                          {issue.complaint.dept_id || translations.noTitle}
                        </h2>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {issue.complaint?.description || translations.noDescription}
                        </p>
                        <p className="text-blue-600 text-sm font-medium mt-2">
                          {issue.dept?.name || translations.noDepartment}
                        </p>
                      </div>

                      {/* Issue Details */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span className="line-clamp-1">
                            {issue.location?.address || translations.noAddress}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>
                            {issue.createdAtDate
                              ? issue.createdAtDate.toLocaleString(
                                  language === "hi" ? "hi-IN" : "en-IN"
                                )
                              : translations.noDate}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                          <button
                            onClick={() => setViewIssue(issue)}
                            className="flex items-center px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                          >
                            <Eye size={16} className="mr-2" />
                            View Complaints
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {translations.noIssuesFound}
                </h3>
                <p className="text-gray-500">{translations.noIssuesFoundDesc}</p>
              </div>
            )}
          </div>

          {/* View Complaints Modal */}
          <Transition appear show={!!viewIssue} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => setViewIssue(null)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
              </Transition.Child>

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                    <div className="p-6 border-b border-gray-100">
                      <Dialog.Title className="text-xl font-semibold text-gray-800">
                        Complaints for Issue {viewIssue?.id}
                      </Dialog.Title>
                    </div>

                    <div className="p-6">
                      {viewIssue && filteredIssues.length > 0 ? (
                        <ul className="space-y-4 max-h-80 overflow-y-auto">
                          {filteredIssues
                            .filter((issue) => issue.id === viewIssue.id)
                            .map((issue) => (
                              <li key={issue.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <p className="font-medium text-gray-800 mb-2">
                                  Complaint ID: {issue.complaintId || "N/A"}
                                </p>
                                <p className="text-gray-600 text-sm mb-3">
                                  Description: {issue.complaint?.description || translations.noDescription}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    {issue.location?.address || translations.noAddress}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    {issue.createdAtDate
                                      ? issue.createdAtDate.toLocaleString(language === "hi" ? "hi-IN" : "en-IN")
                                      : translations.noDate}
                                  </div>
                                </div>
                                {issue.complaint.transcribe && (
                                  <p className="mt-2 text-sm text-blue-600">
                                    Transcription: {issue.complaint.transcribe}
                                  </p>
                                )}
                                {issue.complaint.translate && (
                                  <p className="mt-1 text-sm text-green-600">
                                    Translation: {issue.complaint.translate}
                                  </p>
                                )}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No complaints found for this issue.
                        </p>
                      )}
                    </div>

                    <div className="p-6 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => setViewIssue(null)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>

          <AssignDepartmentModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            issue={selectedIssue}
            departments={departments}
            onAssignDepartment={(issueId, deptIds, comment) => {
              axios.post(`http://localhost:8080/api/issues/${issueId}/assign`, {
                departments: deptIds,
                comment,
              }).then(() => {
                fetchIssues();
                setShowAssignModal(false);
              });
            }}
          />
        </>
      )}
    </div>
  );
};

export default IssuesPage;
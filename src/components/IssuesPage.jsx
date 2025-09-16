import React, { useState, useEffect,Fragment } from 'react';
import { Dialog, Transition,Listbox } from "@headlessui/react";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {  AlertCircle, Calendar, MapPin,Eye,RefreshCw,Check, ChevronsDownUp, Search,CheckCircle,Circle } from 'lucide-react';
import  AssignDepartmentModal  from './AssignDepartmentModal';

const IssuesPage = ({ departments, onAssignDepartment, language, translations}) => {
  const [issues, setIssues] = useState([]); 
    const [viewIssue, setViewIssue] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Loader state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false); // ✅ Tracking modal


// 🔹 Optional: Reset state when modal closes
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
    const res = await axios.get("http://localhost:8080/api/getIssueTmp");
const rawIssues = res.data.issues || [];

    // Map to normalized shape
    const normalized = await Promise.all(
      rawIssues.map(async (issue) => {
        const lat = issue.latitude ;
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
              address = ` ${state || ""} - ${postcode || ""}`;
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
            : new Date(), // fallback
        };
      })
    );

    setIssues((prev) => {
      const prevIds = prev.map((i) => i.id);
      const fresh = normalized.filter((i) => !prevIds.includes(i.id));

      // mark new ones
      const freshWithFlag = fresh.map((i) => ({ ...i, isNew: true }));

      // merge old + new
      const merged = [...freshWithFlag, ...prev];

      // sort by createdAtDate desc
      merged.sort((a, b) => b.createdAtDate - a.createdAtDate);

      return merged;
    });

    setLoading(false);
  } catch (error) {
    console.error("Error fetching issues:", error);
    setLoading(false);
  }
};

  // 🔹 Initial load + refresh every 15s
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


  // 🔹 Filters
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

  // 🔹 Color helpers
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {translations.issueManagement}
        </h2>
        <p className="text-gray-600">{translations.issueManagementDesc}</p>
      </div>

      {/* Loader while fetching */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Filters */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 🔍 Search */}
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

        {/* 📌 Status Filter */}
        <Listbox value={filterStatus} onChange={setFilterStatus}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                {statusOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
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

        {/* ⚡ Priority Filter */}
        <Listbox value={filterPriority} onChange={setFilterPriority}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                {priorityOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
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

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div
              key={issue.issue_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {issue.isNew ? (
                <div className="p-4">
                  <Skeleton height={20} width={120} className="mb-2" />
                  <Skeleton height={15} count={2} />
                  <Skeleton height={30} className="mt-4" />
                </div>
              ) : (
                <>
                  {/* Issue Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {issue.issue_id || translations.noComplaintNumber}
                      </h3>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            issue.priority
                          )}`}
                        >
                          {issue.priority}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>
                      </div>
                    </div>
                    <h2 className="font-semibold text-gray-800 text-lg">
                      {issue.complaint.dept_id || translations.noTitle}
                    </h2>

                    <p className="text-gray-600 text-sm line-clamp-2">
{issue.complaint?.description || translations.noDescription}
                    </p>
                    <p>{issue.dept?.name || translations.noDepartment}</p>

                  </div>

                  {/* Issue Details */}
                  <div className="p-4 space-y-3">
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
                    <div className="flex items-center gap-3 pt-3">
                      <button
                        onClick={() => setViewIssue(issue)}
                        className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                      >
                        <Eye size={16} className="mr-1.5" />
                        View Complaints
                      </button>

                      {/* <button
  onClick={() => {
    setSelectedIssue(issue); // set the issue for which modal opens
    setShowAssignModal(true); // open the modal
  }}
  className="flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-sm font-medium"
>
  <RefreshCw size={16} className="mr-1.5" />
  Re-Assign Dept
</button> */}

   {/* <button
                onClick={() => setShowTrackingModal(issue)}
                className="flex items-center px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 text-sm font-medium"
              >
                <AlertCircle size={16} className="mr-1.5" /> Check Status
              </button> */}


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
      enter="ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black/30" />
    </Transition.Child>

    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-90"
      >
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white shadow-lg p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Complaints for Issue {viewIssue?.id}
          </Dialog.Title>

       {viewIssue && filteredIssues.length > 0 ? (
  <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
    {filteredIssues
      .filter((issue) => issue.id === viewIssue.id)
      .map((issue) => (
        <li key={issue.id} className="p-3 border rounded-lg bg-gray-50 text-sm">
          <p className="font-medium text-gray-800">Complaint ID: {issue.complaintId || "N/A"}</p>
          <p className="text-gray-600 text-sm">
            Description: {issue.complaint?.description || translations.noDescription}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={14} />
            {issue.location?.address || translations.noAddress}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar size={14} />
            {issue.createdAtDate
              ? issue.createdAtDate.toLocaleString(language === "hi" ? "hi-IN" : "en-IN")
              : translations.noDate}
          </p>

          <p>{issue.complaint.transcribe || "N/A"}</p>
          <p>{issue.complaint.translate || "N/A"}</p>
        </li>
      ))}
  </ul>
) : (
  <p className="text-gray-500 text-sm">No complaints found for this issue.</p>
)}


          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setViewIssue(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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
    // API call to assign department
    axios.post(`http://localhost:8080/api/issues/${issueId}/assign`, {
      departments: deptIds,
      comment,
    }).then(() => {
      fetchIssues(); // refresh issues
      setShowAssignModal(false);
    });
  }}
/>

  {/* --- Tracking Modal --- */}
      <Transition appear show={!!showTrackingModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowTrackingModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-lg p-6">
                <Dialog.Title className="text-lg font-semibold text-gray-800 mb-6">
                  Issue Status: {showTrackingModal?.id}
                </Dialog.Title>

                <div className="space-y-4">
                  {["pending", "in-progress", "completed"].map((step, idx) => {
                    const stepLabel =
                      step === "pending" ? "Reported to Department" :
                      step === "in-progress" ? "In Progress" :
                      "Solved by Department";

                    const stepComplete =
                      step === "pending" ? true :
                      step === "in-progress" ? showTrackingModal.status !== "pending" :
                      showTrackingModal.status === "completed";

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        {stepComplete ? <CheckCircle className="text-green-600" /> : <Circle className="text-gray-400" />}
                        <span className={`${stepComplete ? "text-gray-800" : "text-gray-400"} font-medium`}>
                          {stepLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {showTrackingModal.status !== "completed" && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => markAsComplete(showTrackingModal.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Mark as Complete
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
        </>
      )}

    </div>
  );
};

export default IssuesPage;

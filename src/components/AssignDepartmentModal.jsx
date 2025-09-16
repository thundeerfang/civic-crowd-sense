// AssignDepartmentModal.jsx
import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Check, ChevronsDownUp } from "lucide-react";

const AssignDepartmentModal = ({ isOpen, onClose, issue, departments, onAssignDepartment }) => {
  // 🔹 Always define hooks at the top
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [comment, setComment] = useState("");
  const [headInfo, setHeadInfo] = useState(null);

  // Update head info when selection changes
  useEffect(() => {
    if (selectedDepartments.length === 1) {
      const dept = departments.find(d => d.id === selectedDepartments[0]);
      setHeadInfo(dept?.head || null);
    } else {
      setHeadInfo(null);
    }
  }, [selectedDepartments, departments]);

  const handleAssign = () => {
    if (issue) onAssignDepartment(issue.id, selectedDepartments, comment);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
                Re-Assign Departments for Issue {issue?.id || "N/A"}
              </Dialog.Title>

              {/* Only render department selection if issue exists */}
              {issue && (
                <>
                  {/* Department Multi-Select */}
                  <Listbox multiple value={selectedDepartments} onChange={setSelectedDepartments}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span className="block truncate">
                          {selectedDepartments.length === 0
                            ? "Select Department(s)"
                            : selectedDepartments.map(id => departments.find(d => d.id === id)?.name).join(", ")}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronsDownUp className="h-4 w-4 text-gray-400" />
                        </span>
                      </Listbox.Button>

                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                        {departments.map((dept) => (
                          <Listbox.Option
                            key={dept.id}
                            value={dept.id}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                  {dept.name}
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
                    </div>
                  </Listbox>

                  {/* Head Info */}
                  {headInfo && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-800">Head of Department</h4>
                      <p className="text-sm text-gray-600">Name: {headInfo.name}</p>
                      <p className="text-sm text-gray-600">Email: {headInfo.email}</p>
                      <p className="text-sm text-gray-600">Phone: {headInfo.phone}</p>
                    </div>
                  )}

                  {/* Comment Box */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment (optional)"
                    className="mt-4 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Assign
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AssignDepartmentModal;

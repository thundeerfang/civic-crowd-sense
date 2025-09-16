import React, { useState } from 'react';
import { Building2, Users, CheckCircle, Clock, Phone, Mail, TrendingUp, Plus } from 'lucide-react';
import AddDepartmentModal from './AddDepartmentModal';

const DepartmentsPage = ({ departments, issues, language, translations, onAddDepartment }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getDepartmentIssues = (departmentId) => {
    return issues.filter(issue => issue.assignedDepartments.includes(departmentId));
  };

  const getDepartmentStats = (departmentId) => {
    const deptIssues = getDepartmentIssues(departmentId);
    const completedIssues = deptIssues.filter(issue => issue.status === 'completed');
    const pendingIssues = deptIssues.filter(issue => issue.status === 'pending');
    const inProgressIssues = deptIssues.filter(issue => issue.status === 'in-progress');
    
    return {
      total: deptIssues.length,
      completed: completedIssues.length,
      pending: pendingIssues.length,
      inProgress: inProgressIssues.length,
      completionRate: deptIssues.length > 0 ? Math.round((completedIssues.length / deptIssues.length) * 100) : 0
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {translations.departmentManagement}
            </h2>
            <p className="text-gray-600">{translations.departmentManagementDesc}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>{language === 'hi' ? 'नया विभाग जोड़ें' : 'Add New Department'}</span>
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const stats = getDepartmentStats(department.id);
          
          return (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDepartment(department)}
            >
              {/* Department Header */}
              <div className="p-4 border-b border-gray-100 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{department.name}</h3>
                    <p className="text-sm text-gray-600">{translations.head}: {department.head}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-xs text-gray-600">{translations.totalIssues}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs text-gray-600">{translations.completed}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{translations.completionRate}</span>
                    <span>{stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>{department.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>{department.email}</span>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs">
                    <div className="text-center">
                      <div className="text-red-600 font-semibold">{stats.pending}</div>
                      <div className="text-gray-500">{translations.pending}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-600 font-semibold">{stats.inProgress}</div>
                      <div className="text-gray-500">{translations.inProgress}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-semibold">{stats.completed}</div>
                      <div className="text-gray-500">{translations.completed}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Detail Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedDepartment.name} - {translations.detailedView}
              </h3>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Department Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">{translations.departmentInfo}</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">{translations.head}:</span> {selectedDepartment.head}</div>
                  <div><span className="font-medium">{translations.phone}:</span> {selectedDepartment.phone}</div>
                  <div><span className="font-medium">{translations.email}:</span> {selectedDepartment.email}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">{translations.performance}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {(() => {
                    const stats = getDepartmentStats(selectedDepartment.id);
                    return (
                      <>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{stats.total}</div>
                          <div className="text-xs text-gray-600">{translations.totalIssues}</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">{stats.completionRate}%</div>
                          <div className="text-xs text-gray-600">{translations.completionRate}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Assigned Issues */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                {translations.assignedIssues} ({getDepartmentIssues(selectedDepartment.id).length})
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {getDepartmentIssues(selectedDepartment.id).map((issue) => (
                  <div key={issue.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{issue.complaintNumber}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'completed' ? 'bg-green-100 text-green-800' :
                        issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        issue.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {issue.status === 'completed' ? translations.completed :
                         issue.status === 'in-progress' ? translations.inProgress :
                         issue.status === 'assigned' ? translations.assigned : translations.pending}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{issue.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(issue.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                    </p>
                  </div>
                ))}
                
                {getDepartmentIssues(selectedDepartment.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="mx-auto h-8 w-8 mb-2" />
                    <p>{translations.noIssuesAssigned}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <AddDepartmentModal
          onAdd={(newDept) => {
            onAddDepartment(newDept);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
          language={language}
          translations={translations}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
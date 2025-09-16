import React, { useState } from 'react';
import { Filter, Search, Clock, User, MapPin } from 'lucide-react';

const IssuesSidebar = ({ issues = [], onIssueSelect, selectedIssue }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

const filteredIssues = issues.filter((issue) => {
  const matchesFilter = filter === 'all' || issue.priority === filter;
  const matchesSearch =
    (issue.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (issue.complaintNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (issue.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  return matchesFilter && matchesSearch;
});



  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-l-red-500 bg-red-50';
      case 'Medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'Low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'High': return 'उच्च';
      case 'Medium': return 'मध्यम';
      case 'Low': return 'कम';
      default: return priority;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return 'लंबित';
      case 'Assigned': return 'आवंटित';
      case 'In Progress': return 'प्रगतिशील';
      case 'Completed': return 'पूर्ण';
      default: return status;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">
          शिकायतें सूची / Issues List
        </h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="खोजें / Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-1">
          {['all', 'High', 'Medium', 'Low'].map((priority) => (
            <button
              key={priority}
              onClick={() => setFilter(priority)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                filter === priority
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {priority === 'all' ? 'सभी' : getPriorityLabel(priority)}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            onClick={() => onIssueSelect(issue)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors border-l-4 ${
              getPriorityColor(issue.priority)
            } ${selectedIssue?.id === issue.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">
                  {issue.issue_id}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                  issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getPriorityLabel(issue.priority)}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                {issue.title}
              </h4>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {issue.description}
              </p>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User size={12} />
                  <span>{issue.userName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{new Date(issue.createdAtDate).toLocaleDateString('hi-IN')}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <MapPin size={12} />
                <span className="line-clamp-1">{issue.location.address}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  स्थिति: {getStatusLabel(issue.status)}
                </span>
               {Array.isArray(issue.assignedDepartments) && issue.assignedDepartments.length > 0 && (
  <span className="text-xs text-blue-600">
    {issue.assignedDepartments.length} विभाग आवंटित
  </span>
)}

              </div>
            </div>
          </div>
        ))}
        
        {filteredIssues.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-lg mb-2">कोई शिकायत नहीं मिली</div>
            <div className="text-sm">No issues found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesSidebar;
import React from 'react';
import { X, Clock, CheckCircle, AlertCircle, User, Calendar, MapPin } from 'lucide-react';

const IssueProgressModal = ({ issue, onClose, language, translations }) => {
  const getProgressSteps = () => {
    const steps = [
      {
        id: 'created',
        label: language === 'hi' ? 'शिकायत दर्ज' : 'Issue Created',
        icon: AlertCircle,
        completed: true,
        date: issue.createdAt,
        description: language === 'hi' ? 'नागरिक द्वारा शिकायत दर्ज की गई' : 'Issue registered by citizen'
      },
      {
        id: 'assigned',
        label: language === 'hi' ? 'विभाग आवंटित' : 'Department Assigned',
        icon: User,
        completed: ['assigned', 'in-progress', 'completed'].includes(issue.status),
        date: issue.assignedAt || issue.updatedAt,
        description: language === 'hi' ? 'संबंधित विभाग को आवंटित' : 'Assigned to relevant department'
      },
      {
        id: 'in-progress',
        label: language === 'hi' ? 'कार्य प्रगति में' : 'Work in Progress',
        icon: Clock,
        completed: ['in-progress', 'completed'].includes(issue.status),
        date: issue.inProgressAt || (issue.status === 'in-progress' ? issue.updatedAt : null),
        description: language === 'hi' ? 'समस्या का समाधान शुरू' : 'Resolution work started'
      },
      {
        id: 'completed',
        label: language === 'hi' ? 'कार्य पूर्ण' : 'Work Completed',
        icon: CheckCircle,
        completed: issue.status === 'completed',
        date: issue.completedAt || (issue.status === 'completed' ? issue.updatedAt : null),
        description: language === 'hi' ? 'समस्या का समाधान पूर्ण' : 'Issue resolution completed'
      }
    ];

    return steps;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'assigned': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const progressSteps = getProgressSteps();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'hi' ? 'शिकायत प्रगति ट्रैकिंग' : 'Issue Progress Tracking'}
            </h3>
            <p className="text-sm text-gray-600">{issue.complaintNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Issue Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">{issue.title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>{issue.userName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>{issue.location.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>{formatDate(issue.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                issue.status === 'completed' ? 'bg-green-100 text-green-800' :
                issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                issue.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {issue.status === 'completed' ? translations.completed :
                 issue.status === 'in-progress' ? translations.inProgress :
                 issue.status === 'assigned' ? translations.assigned : translations.pending}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="space-y-6">
          <h4 className="font-medium text-gray-800">
            {language === 'hi' ? 'प्रगति टाइमलाइन' : 'Progress Timeline'}
          </h4>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {progressSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex items-start space-x-4 pb-8">
                  {/* Timeline Node */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-green-100 border-green-500 text-green-600' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className={`font-medium ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                        {step.label}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {formatDate(step.date)}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.description}
                    </p>
                    
                    {/* Additional Info for Assigned Step */}
                    {step.id === 'assigned' && issue.assignedDepartments.length > 0 && step.completed && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">
                          {language === 'hi' ? 'आवंटित विभाग:' : 'Assigned Departments:'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {issue.assignedDepartments.map((deptId, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {deptId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Summary */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">
            {language === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'}
          </h5>
          <p className="text-sm text-blue-700">
            {issue.status === 'completed' 
              ? (language === 'hi' ? 'यह शिकायत सफलतापूर्वक हल हो गई है।' : 'This issue has been successfully resolved.')
              : issue.status === 'in-progress'
              ? (language === 'hi' ? 'इस शिकायत पर काम चल रहा है।' : 'Work is in progress on this issue.')
              : issue.status === 'assigned'
              ? (language === 'hi' ? 'यह शिकायत संबंधित विभाग को सौंपी गई है।' : 'This issue has been assigned to the relevant department.')
              : (language === 'hi' ? 'यह शिकायत अभी भी लंबित है।' : 'This issue is still pending.')
            }
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueProgressModal;
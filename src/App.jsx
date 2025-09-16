import React, { useState, useEffect } from 'react';
import { mockIssues, mockDepartments } from './data/mockData.js';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import IssuesPage from './components/IssuesPage';
import ComplaintsPage from './components/ComplaintsPage';
import DepartmentsPage from './components/DepartmentsPage';
import AboutPage from './components/AboutPage';
import LoadingScreen from './components/LoadingScreen';
import LoadingSpinner from './components/LoadingSpinner';
import ProfileDropdown from './components/ProfileDropdown';
import { User, Globe, Building2, Info } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState(mockIssues);
  const [departments, setDepartments] = useState(mockDepartments);
  const [userRole, setUserRole] = useState('admin'); // 'admin' or 'department'

  const translations = {
    hi: {
      // Common
      nagarNigam: 'इंदौर नगर निगम',
      nagarNigamSecondary: 'Indore Municipal Corporation',
      nagarNigamShort: 'इंदौर नगर निगम',
      nagarNigamShortSecondary: 'Indore Municipal Corp.',
      adminDashboard: 'प्रशासन डैशबोर्ड',
      switchLanguage: 'English',
      governmentOfIndia: 'भारत सरकार',
      
      // Login
      adminLogin: 'व्यवस्थापक लॉगिन',
      username: 'यूजरनेम',
      password: 'पासवर्ड',
      enterUsername: 'अपना यूजरनेम दर्ज करें',
      enterPassword: 'अपना पासवर्ड दर्ज करें',
      login: 'लॉग इन',
      loggingIn: 'लॉग इन हो रहे हैं...',
      invalidCredentials: 'गलत यूजरनेम या पासवर्ड',
      demoCredentials: 'डेमो क्रेडेंशियल्स:',
      
  
      // Sidebar
      mainMap: 'मुख्य मानचित्र',
      mainMapSecondary: 'Main Map',
      issues: 'शिकायतें',
      issuesSecondary: 'Issues',
      departments: 'विभाग',
      departmentsSecondary: 'Departments',
      complainants: "शिकायतकर्ता",
      complainantsSecondary: "Complainants",
      about: 'जानकारी',
      aboutSecondary: 'About',
      logout: 'लॉग आउट',
      logoutSecondary: 'Logout',
      
      // Map
      issuesList: 'शिकायतें सूची',
      all: 'सभी',
      priority: 'प्राथमिकता',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      pending: 'लंबित',
      assigned: 'आवंटित',
      inProgress: 'प्रगतिशील',
      completed: 'पूर्ण',
      totalIssues: 'कुल शिकायतें',
      noIssuesFound: 'कोई शिकायत नहीं मिली',
      complaintNo: 'शिकायत संख्या',
      name: 'नाम',
      
      // Issues Page
      issueManagement: 'शिकायत प्रबंधन',
      issueManagementDesc: 'सभी शिकायतों का विस्तृत विवरण',
      search: 'खोजें...',
      allStatus: 'सभी स्थिति',
      allPriority: 'सभी प्राथमिकता',
      created: 'बनाया गया',
      assignedDepartments: 'आवंटित विभाग',
      assignDepartment: 'विभाग आवंटित करें',
      markComplete: 'पूर्ण चिह्नित करें',
      reopen: 'पुनः खोलें',
      noIssuesFoundDesc: 'आपके मापदंड से मेल खाने वाली कोई शिकायत नहीं मिली',
      
      // Departments Page
      departmentManagement: 'विभाग प्रबंधन',
      departmentManagementDesc: 'सभी नगर निगम विभागों की जानकारी और प्रदर्शन',
      head: 'प्रमुख',
      completionRate: 'पूर्णता दर',
      detailedView: 'विस्तृत विवरण',
      departmentInfo: 'विभाग जानकारी',
      phone: 'फोन',
      email: 'ईमेल',
      performance: 'प्रदर्शन',
      assignedIssues: 'आवंटित शिकायतें',
      noIssuesAssigned: 'कोई शिकायत आवंटित नहीं',
      
      // Assign Department Modal
      confirmAssignment: 'पुष्टि करें',
      issue: 'शिकायत',
      departmentsToBeAssigned: 'आवंटित किए जाने वाले विभाग',
      confirmAssignmentQuestion: 'क्या आप वाकई इस शिकायत को चुने गए विभागों को आवंटित करना चाहते हैं?',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      issueDetails: 'शिकायत विवरण',
      complainant: 'शिकायतकर्ता',
      location: 'स्थान',
      category: 'श्रेणी',
      description: 'विवरण',
      selectDepartments: 'विभाग चुनें',
      selectOneOrMore: 'एक या अधिक विभाग चुन सकते हैं',
      selectedDepartments: 'चयनित विभाग',
      assign: 'आवंटित करें',
      selectAtLeastOneDepartment: 'कृपया कम से कम एक विभाग का चयन करें'
    },
    en: {
      // Common
      nagarNigam: 'Indore Municipal Corporation',
      nagarNigamSecondary: 'इंदौर नगर निगम',
      nagarNigamShort: 'Indore Municipal Corp.',
      nagarNigamShortSecondary: 'इंदौर नगर निगम',
      adminDashboard: 'Admin Dashboard',
      switchLanguage: 'हिंदी',
      governmentOfIndia: 'Government of India',
      
      // Login
      adminLogin: 'Admin Login',
      username: 'Username',
      password: 'Password',
      enterUsername: 'Enter your username',
      enterPassword: 'Enter your password',
      login: 'Login',
      loggingIn: 'Logging in...',
      invalidCredentials: 'Invalid credentials',
      demoCredentials: 'Demo Credentials:',
      
     
      // Sidebar
      mainMap: 'Main Map',
      mainMapSecondary: 'मुख्य मानचित्र',
      issues: 'Issues',
      issuesSecondary: 'शिकायतें',
      complainant: "Complainants",
      complainantSecondary: "शिकायतकर्ता",
      departments: 'Departments',
      departmentsSecondary: 'विभाग',
      about: 'About',
      aboutSecondary: 'जानकारी',
      logout: 'Logout',
      logoutSecondary: 'लॉग आउट',
      
      // Map
      issuesList: 'Issues List',
      all: 'All',
      priority: 'Priority',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      pending: 'Pending',
      assigned: 'Assigned',
      inProgress: 'In Progress',
      completed: 'Completed',
      totalIssues: 'Total Issues',
      noIssuesFound: 'No issues found',
      complaintNo: 'Complaint No',
      name: 'Name',
      
      // Issues Page
      issueManagement: 'Issue Management',
      issueManagementDesc: 'Detailed view of all issues',
      search: 'Search...',
      allStatus: 'All Status',
      allPriority: 'All Priority',
      created: 'Created',
      assignedDepartments: 'Assigned Departments',
      assignDepartment: 'Assign Department',
      markComplete: 'Mark Complete',
      reopen: 'Reopen',
      noIssuesFoundDesc: 'No issues found matching your criteria',

      // Complainant Page
      complainantManagement: 'Complainant Management',
      complainantManagementDesc: 'Detailed view of all complainants',
      noComplainantsFoundDesc: 'No complainants found matching your criteria',
      
      // Complainant Details Page
      complainantDetails: 'Complainant Details',
      contactInfo: 'Contact Information',
      totalComplaints: 'Total Complaints',
      complaintsByStatus: 'Complaints by Status',
      complaintsByPriority: 'Complaints by Priority',
      recentComplaints: 'Recent Complaints',
      viewAllComplaints: 'View All Complaints',

      
      // Departments Page
      departmentManagement: 'Department Management',
      departmentManagementDesc: 'Information and performance of all municipal departments',
      head: 'Head',
      completionRate: 'Completion Rate',
      detailedView: 'Detailed View',
      departmentInfo: 'Department Information',
      phone: 'Phone',
      email: 'Email',
      performance: 'Performance',
      assignedIssues: 'Assigned Issues',
      noIssuesAssigned: 'No issues assigned',
      
      // Assign Department Modal
      confirmAssignment: 'Confirm Assignment',
      issue: 'Issue',
      departmentsToBeAssigned: 'Departments to be assigned',
      confirmAssignmentQuestion: 'Are you sure you want to assign this issue to the selected departments?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      issueDetails: 'Issue Details',
      complainants: 'Complainants',
      location: 'Location',
      category: 'Category',
      description: 'Description',
      selectDepartments: 'Select Departments',
      selectOneOrMore: 'You can select one or more departments',
      selectedDepartments: 'Selected Departments',
      assign: 'Assign',
      selectAtLeastOneDepartment: 'Please select at least one department'
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
        setIsAuthenticated(true);
    }, 1500);
  };


  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsLoading(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsLoading(false);
      }, 800);
    }
  };

  const toggleLanguage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLanguage(language === 'en' ? 'hi' : 'en');
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setActiveTab('map');
      setIsLoading(false);
    }, 1000);
  };

  const handleAssignDepartment = (issueId, departmentIds) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId
          ? { ...issue, assignedDepartments: departmentIds, status: 'in-progress' }
          : issue
      )
    );
  };

  const handleUpdateIssueStatus = (issueId, newStatus) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId
          ? { ...issue, status: newStatus }
          : issue
      )
    );
  };

  const onIssueSelect = (issue) => {
    console.log('Issue selected:', issue);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        language={language} 
        onToggleLanguage={toggleLanguage}
        translations={t}
      />
    );
  }



  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
        language={language}
        translations={t}
        userRole={userRole}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{t.nagarNigam}</h1>
                <p className="text-sm text-gray-500">{t.adminDashboard}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span>{t.switchLanguage}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <ProfileDropdown 
                  onLogout={handleLogout}
                  language={language}
                  translations={t}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-scroll">
          {activeTab === 'map' && (
            <MapView 
              language={language} 
              issues={issues} 
              onIssueSelect={onIssueSelect}
              translations={t}
            />
          )}
          {activeTab === 'issues' && (
            <IssuesPage 
              language={language} 
              issues={issues} 
              departments={departments} 
              onAssignDepartment={handleAssignDepartment} 
              onUpdateIssueStatus={handleUpdateIssueStatus}
              translations={t}
            />
          )}
          {activeTab === 'complaints' && (
            <ComplaintsPage 
              language={language} 
              issues={issues} 
              departments={departments} 
              onAssignDepartment={handleAssignDepartment} 
              onUpdateIssueStatus={handleUpdateIssueStatus}
              translations={t}
            />
          )}
          {activeTab === 'departments' && (
            <DepartmentsPage 
              language={language} 
              departments={departments} 
              issues={issues}
              onAddDepartment={(newDept) => setDepartments(prev => [...prev, newDept])}
              translations={t}
            />
          )}
          {activeTab === 'about' && (
            <AboutPage 
              language={language} 
              translations={t}
            />
          )}
        </main>
      </div>
      
    </div>
  );
}

export default App;
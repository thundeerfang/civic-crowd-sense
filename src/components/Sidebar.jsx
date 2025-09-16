import React from 'react';
import { Map, FileText, Building2, Info, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Sidebar = ({ collapsed, onToggleCollapse, activeTab, onTabChange, onLogout, language = 'hi', translations, userRole = 'admin' }) => {
  const menuItems = [
    { 
      id: 'map', 
      label: translations.mainMap, 
      icon: Map, 
      labelSecondary: translations.mainMapSecondary
    },
    { 
      id: 'issues', 
      label: translations.issues, 
      icon: FileText, 
      labelSecondary: translations.issuesSecondary
    },
       {
      id: 'complaints',
      label: translations.complainants,
      icon: FileText,
      labelSecondary: translations.complainantsSecondary
    },
    // ...(userRole === 'admin' ? [{ 
    //   id: 'departments', 
    //   label: translations.departments, 
    //   icon: Building2, 
    //   labelSecondary: translations.departmentsSecondary
    // }] : []),
    { 
      id: 'about', 
      label: translations.about, 
      icon: Info, 
      labelSecondary: translations.aboutSecondary
    }

 
  ];

  return (
    <div className={`${!collapsed ? 'w-64' : 'w-16'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {translations.nagarNigamShort}
              </h2>
              <p className="text-xs text-gray-600">
                {translations.nagarNigamShortSecondary}
              </p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {!collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center py-3 px-1.5 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <div className="ml-3 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.labelSecondary}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default Sidebar;
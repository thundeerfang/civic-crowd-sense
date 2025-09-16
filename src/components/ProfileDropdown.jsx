import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, LogOut, Settings, Bell } from 'lucide-react';

const ProfileDropdown = ({ onLogout, language, translations, userRole = 'admin' }) => {
  const userEmail = userRole === 'admin' ? 'admin@indore.gov.in' : 'dept@indore.gov.in';
  const userName = userRole === 'admin' ? 'Admin User' : 'Department User';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Item>
          {({ active }) => (
            <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-600">{userEmail}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      userRole === 'admin' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userRole === 'admin' ? 'Administrator' : 'Department User'}
                    </span>
                  </div>
                </div>
              </div>

          

              {/* Logout Section */}
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onLogout}
                      className={`${
                        active ? 'bg-red-50 text-red-900' : 'text-red-700'
                      } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600" />
                      {translations.logout}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </div>
          )}
        </Menu.Item>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
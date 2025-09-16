import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, Save } from 'lucide-react';

const AddDepartmentModal = ({ onAdd, onClose, language, translations }) => {
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    phone: '',
    email: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.name || !formData.head || !formData.phone || !formData.email) {
      alert(language === 'hi' ? 'कृपया सभी आवश्यक फील्ड भरें' : 'Please fill all required fields');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newDepartment = {
        id: `dept-${Date.now()}`,
        name: formData.name,
        head: formData.head,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        totalIssues: 0,
        completedIssues: 0,
        createdAt: new Date().toISOString()
      };

      onAdd(newDepartment);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'hi' ? 'नया विभाग जोड़ें' : 'Add New Department'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'विभाग का नाम' : 'Department Name'} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'hi' ? 'विभाग का नाम दर्ज करें' : 'Enter department name'}
            />
          </div>

          {/* Department Head */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'विभाग प्रमुख' : 'Department Head'} *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="head"
                value={formData.head}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'hi' ? 'प्रमुख का नाम दर्ज करें' : 'Enter head name'}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'फोन नंबर' : 'Phone Number'} *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'ईमेल पता' : 'Email Address'} *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="department@indore.gov.in"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'विवरण' : 'Description'}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'hi' ? 'विभाग का विवरण (वैकल्पिक)' : 'Department description (optional)'}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'hi' ? 'जोड़ा जा रहा है...' : 'Adding...'}
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'विभाग जोड़ें' : 'Add Department'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
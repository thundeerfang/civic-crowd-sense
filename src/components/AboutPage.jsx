import React from 'react';
import { Info, Users, Code, Award, ExternalLink, Github, Linkedin, Mail, Calendar, MapPin, Phone } from 'lucide-react';

const AboutPage = ({ language, translations }) => {
  const teamMembers = [
    {
      name: 'Harshit Kushwah',
      role: 'Full Stack Developer',
      email: 'harshit@example.com',
      github: 'https://github.com/harshitkushwah08',
      linkedin: 'https://linkedin.com/in/harshitkushwah',
      avatar: '👨‍💻'
    },
    {
      name: 'Team Member 2',
      role: 'Frontend Developer',
      email: 'member2@example.com',
      github: 'https://github.com/member2',
      linkedin: 'https://linkedin.com/in/member2',
      avatar: '👩‍💻'
    },
    {
      name: 'Team Member 3',
      role: 'UI/UX Designer',
      email: 'member3@example.com',
      github: 'https://github.com/member3',
      linkedin: 'https://linkedin.com/in/member3',
      avatar: '🎨'
    }
  ];

  const projectInfo = {
    name: 'Indore Municipal Corporation Dashboard',
    version: '1.0.0',
    hackathon: 'Smart City Hackathon 2024',
    description: language === 'hi' 
      ? 'इंदौर नगर निगम के लिए एक आधुनिक प्रशासनिक डैशबोर्ड जो नागरिकों की शिकायतों का प्रभावी प्रबंधन करता है।'
      : 'A modern administrative dashboard for Indore Municipal Corporation that effectively manages citizen complaints.',
    technologies: ['React', 'MapLibre GL', 'Tailwind CSS', 'Headless UI', 'Lucide Icons'],
    features: language === 'hi' 
      ? ['इंटरैक्टिव मैप व्यू', 'रियल-टाइम शिकायत ट्रैकिंग', 'विभाग प्रबंधन', 'बहुभाषी समर्थन', 'रोल-बेस्ड एक्सेस']
      : ['Interactive Map View', 'Real-time Issue Tracking', 'Department Management', 'Multi-language Support', 'Role-based Access']
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {language === 'hi' ? 'प्रोजेक्ट के बारे में' : 'About Project'}
        </h2>
        <p className="text-gray-600">
          {language === 'hi' 
            ? 'इंदौर नगर निगम डैशबोर्ड की विस्तृत जानकारी'
            : 'Detailed information about Indore Municipal Corporation Dashboard'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-8 h-8 text-yellow-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'hi' ? 'हैकाथॉन प्रोजेक्ट' : 'Hackathon Project'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700">
                {language === 'hi' ? 'नाम:' : 'Name:'}
              </span>
              <p className="text-gray-600 mt-1">{projectInfo.name}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">
                {language === 'hi' ? 'हैकाथॉन:' : 'Hackathon:'}
              </span>
              <p className="text-gray-600 mt-1">{projectInfo.hackathon}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">
                {language === 'hi' ? 'संस्करण:' : 'Version:'}
              </span>
              <p className="text-gray-600 mt-1">{projectInfo.version}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">
                {language === 'hi' ? 'विवरण:' : 'Description:'}
              </span>
              <p className="text-gray-600 mt-1">{projectInfo.description}</p>
            </div>
          </div>

          {/* Technologies */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-3">
              {language === 'hi' ? 'तकनीकें:' : 'Technologies:'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {projectInfo.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-3">
              {language === 'hi' ? 'मुख्य विशेषताएं:' : 'Key Features:'}
            </h4>
            <ul className="space-y-2">
              {projectInfo.features.map((feature, index) => (
                <li key={index} className="text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'hi' ? 'टीम सदस्य' : 'Team Members'}
            </h3>
          </div>
          
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">{member.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-800 transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Links */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Code className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'hi' ? 'प्रोजेक्ट लिंक्स' : 'Project Links'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <a
              href="https://github.com/harshitkushwah08/ivm-np"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Github className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">GitHub Repository</span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
            
            <a
              href="#"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">
                {language === 'hi' ? 'लाइव डेमो' : 'Live Demo'}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Info className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-gray-800">Indore Municipal Corporation</p>
                <p className="text-sm text-gray-600">Indore, Madhya Pradesh, India</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-gray-800">+91 731 2345678</p>
                <p className="text-sm text-gray-600">Office Hours: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-gray-800">info@indore.gov.in</p>
                <p className="text-sm text-gray-600">Official Email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        <p>© 2024 Indore Municipal Corporation | All Rights Reserved</p>
        <p className="mt-1">Developed for Smart City Initiative</p>
      </div>
    </div>
  );
};

export default AboutPage;
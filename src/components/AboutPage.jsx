import React from 'react';
import { Info, Users, Code, Award, ExternalLink, Github, Linkedin, Mail, Calendar, MapPin, Phone, Star, Zap, Shield, Globe } from 'lucide-react';

const AboutPage = ({ language, translations }) => {
  const teamMembers = [
    {
      name: 'Harshit Kushwah',
      role: language === 'hi' ? 'फुल स्टैक डेवलपर' : 'Full Stack Developer',
      email: 'harshit@example.com',
      github: 'https://github.com/harshitkushwah08',
      linkedin: 'https://linkedin.com/in/harshitkushwah',
      avatar: '👨‍💻',
      skills: ['React', 'Node.js', 'Firebase', 'AWS']
    },
    {
      name: 'Team Member 2',
      role: language === 'hi' ? 'फ्रंटएंड डेवलपर' : 'Frontend Developer',
      email: 'member2@example.com',
      github: 'https://github.com/member2',
      linkedin: 'https://linkedin.com/in/member2',
      avatar: '👩‍💻',
      skills: ['React', 'Tailwind', 'UI/UX']
    },
    {
      name: 'Team Member 3',
      role: language === 'hi' ? 'UI/UX डिज़ाइनर' : 'UI/UX Designer',
      email: 'member3@example.com',
      github: 'https://github.com/member3',
      linkedin: 'https://linkedin.com/in/member3',
      avatar: '🎨',
      skills: ['Figma', 'Design Systems', 'Prototyping']
    }
  ];

  const projectFeatures = [
    {
      icon: Globe,
      title: language === 'hi' ? 'इंटरैक्टिव मैप' : 'Interactive Map',
      description: language === 'hi' ? 'रियल-टाइम शिकायत ट्रैकिंग के साथ' : 'With real-time complaint tracking'
    },
    {
      icon: Zap,
      title: language === 'hi' ? 'तत्काल अपडेट' : 'Instant Updates',
      description: language === 'hi' ? 'लाइव डेटा सिंक्रोनाइज़ेशन' : 'Live data synchronization'
    },
    {
      icon: Shield,
      title: language === 'hi' ? 'सुरक्षित प्रमाणीकरण' : 'Secure Authentication',
      description: language === 'hi' ? 'Firebase आधारित सुरक्षा' : 'Firebase-based security'
    },
    {
      icon: Star,
      title: language === 'hi' ? 'बहुभाषी समर्थन' : 'Multi-language Support',
      description: language === 'hi' ? 'हिंदी और अंग्रेजी में उपलब्ध' : 'Available in Hindi and English'
    }
  ];

  const stats = [
    { label: language === 'hi' ? 'कुल शिकायतें' : 'Total Complaints', value: '1,234' },
    { label: language === 'hi' ? 'हल की गई' : 'Resolved', value: '987' },
    { label: language === 'hi' ? 'सक्रिय विभाग' : 'Active Departments', value: '12' },
    { label: language === 'hi' ? 'उपयोगकर्ता' : 'Users', value: '5,678' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-6">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'hi' ? 'इंदौर नगर निगम डैशबोर्ड' : 'Indore Municipal Dashboard'}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'स्मार्ट सिटी पहल के लिए एक आधुनिक समाधान'
                : 'A modern solution for Smart City Initiative'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projectFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {language === 'hi' ? 'हमारी टीम' : 'Our Team'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{member.avatar}</div>
                  <h3 className="font-semibold text-gray-800 text-lg">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">{member.role}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center space-x-3">
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

        {/* Project Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Code className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-800">
                {language === 'hi' ? 'तकनीकी विवरण' : 'Technical Details'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">
                  {language === 'hi' ? 'फ्रंटएंड:' : 'Frontend:'}
                </span>
                <p className="text-gray-600 mt-1">React, Tailwind CSS, Headless UI</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">
                  {language === 'hi' ? 'बैकएंड:' : 'Backend:'}
                </span>
                <p className="text-gray-600 mt-1">Node.js, Express, Firebase</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">
                  {language === 'hi' ? 'डेटाबेस:' : 'Database:'}
                </span>
                <p className="text-gray-600 mt-1">Firestore, AWS S3</p>
              </div>

              <div>
                <span className="font-medium text-gray-700">
                  {language === 'hi' ? 'मैप सेवा:' : 'Map Service:'}
                </span>
                <p className="text-gray-600 mt-1">MapLibre GL, OpenStreetMap</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Info className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-semibold text-gray-800">
                {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-800 font-medium">Indore Municipal Corporation</p>
                  <p className="text-gray-600 text-sm">Indore, Madhya Pradesh, India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-800">+91 731 2345678</p>
                  <p className="text-gray-600 text-sm">Office Hours: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-800">info@indore.gov.in</p>
                  <p className="text-gray-600 text-sm">Official Email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Links */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <ExternalLink className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl font-semibold text-gray-800">
              {language === 'hi' ? 'प्रोजेक्ट लिंक्स' : 'Project Links'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://github.com/harshitkushwah08/ivm-np"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <Github className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
              <div className="flex-1">
                <span className="text-gray-800 font-medium">GitHub Repository</span>
                <p className="text-sm text-gray-600">View source code</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            
            <a
              href="#"
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <Globe className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
              <div className="flex-1">
                <span className="text-gray-800 font-medium">
                  {language === 'hi' ? 'लाइव डेमो' : 'Live Demo'}
                </span>
                <p className="text-sm text-gray-600">Try the application</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-medium mb-2">© 2024 इंदौर नगर निगम | Indore Municipal Corporation</p>
          <p className="text-gray-400">All Rights Reserved | Developed for Smart City Initiative</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
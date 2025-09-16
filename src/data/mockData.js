export const mockIssues = [
  {
    id: '1',
    complaintNumber: 'IND2024001',
    userName: 'राहुल शर्मा',
    userPhone: '+91 9876543210',
    userEmail: 'rahul.sharma@email.com',
    registeredBy: 'राहुल शर्मा',
    registeredAt: '2024-01-15T10:30:00Z',
    title: 'सड़क में गड्ढे',
    description: 'मुख्य सड़क पर बड़े गड्ढे हैं जो दुर्घटनाओं का कारण बन रहे हैं। यातायात में बहुत परेशानी हो रही है।',
    category: 'Infrastructure',
    priority: 'high',
    status: 'pending',
    location: {
      lat: 22.7196,
      lng: 75.8577,
      address: 'राजवाड़ा, इंदौर'
    },
    images: [
      {
        url: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        caption: 'मुख्य सड़क पर गड्ढे'
      },
      {
        url: 'https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg',
        caption: 'यातायात की समस्या'
      }
    ],
    assignedDepartments: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    completedAt: null
  }
]

export const mockDepartments = [
  {
    id: 'water-dept',
    name: 'जल आपूर्ति विभाग',
    head: 'श्री रमेश कुमार',
    phone: '+91 9876501234',
    email: 'water@indore.gov.in',
    totalIssues: 12,
    completedIssues: 8
  },
  
];
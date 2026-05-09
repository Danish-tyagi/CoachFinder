require('dotenv').config();
const mongoose = require('mongoose');
const Institute = require('./models/Institute');
const User = require('./models/User');

const institutes = [
  {
    name: 'Aakash Institute Noida',
    description: 'Premier coaching institute for IIT-JEE and NEET preparation with experienced faculty and proven results. Aakash has been a trusted name in competitive exam coaching for over 30 years.',
    category: 'IIT-JEE',
    fees: { monthly: 8500, annual: 95000 },
    rating: { average: 4.7, count: 312 },
    images: [
      { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', caption: 'Main Campus' },
      { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', caption: 'Classroom' }
    ],
    latitude: 28.5355, longitude: 77.3910,
    address: { street: 'A-25, Sector 18', sector: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543210', email: 'noida@aakash.ac.in', website: 'https://aakash.ac.in',
    established: 1988, faculty: 45, students: 2400, batchSize: 40,
    timing: 'Mon-Sat: 7AM-9PM',
    features: ['Online Classes', 'Test Series', 'Study Material', 'Doubt Sessions', 'Scholarship'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'FIITJEE Noida Centre',
    description: 'FIITJEE is renowned for producing IIT toppers consistently. Our Noida centre offers comprehensive JEE Main and Advanced preparation with world-class infrastructure.',
    category: 'IIT-JEE',
    fees: { monthly: 9200, annual: 105000 },
    rating: { average: 4.8, count: 289 },
    images: [
      { url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', caption: 'Campus' },
      { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', caption: 'Library' }
    ],
    latitude: 28.5672, longitude: 77.3219,
    address: { street: 'B-12, Sector 62', sector: 'Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201309' },
    phone: '+91-9876543211', email: 'noida@fiitjee.com', website: 'https://fiitjee.com',
    established: 1992, faculty: 52, students: 2800, batchSize: 35,
    timing: 'Mon-Sat: 6AM-10PM',
    features: ['IIT Toppers Faculty', 'Rankers Batch', 'Online Portal', 'Mock Tests', 'Hostel'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Allen Career Institute Noida',
    description: 'Allen is India\'s largest coaching institute for NEET and JEE. Our Noida branch offers the same quality education with dedicated medical and engineering streams.',
    category: 'NEET',
    fees: { monthly: 7800, annual: 88000 },
    rating: { average: 4.6, count: 445 },
    images: [
      { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', caption: 'Institute' },
      { url: 'https://images.unsplash.com/photo-1532094349884-543559c5f7f0?w=800', caption: 'Lab' }
    ],
    latitude: 28.5921, longitude: 77.3156,
    address: { street: 'C-45, Sector 63', sector: 'Sector 63', city: 'Noida', state: 'Uttar Pradesh', pincode: '201307' },
    phone: '+91-9876543212', email: 'noida@allen.ac.in', website: 'https://allen.ac.in',
    established: 1988, faculty: 60, students: 3200, batchSize: 45,
    timing: 'Mon-Sun: 6AM-9PM',
    features: ['NEET Toppers', 'Biology Lab', 'Chemistry Lab', 'Test Series', 'Scholarship'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Resonance Noida',
    description: 'Resonance offers top-quality coaching for IIT-JEE with a focus on conceptual clarity and problem-solving skills. Known for consistent results in JEE Advanced.',
    category: 'IIT-JEE',
    fees: { monthly: 8000, annual: 90000 },
    rating: { average: 4.5, count: 198 },
    images: [
      { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', caption: 'Building' }
    ],
    latitude: 28.5489, longitude: 77.3367,
    address: { street: 'D-78, Sector 27', sector: 'Sector 27', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543213', email: 'noida@resonance.ac.in', website: 'https://resonance.ac.in',
    established: 1996, faculty: 38, students: 1800, batchSize: 40,
    timing: 'Mon-Sat: 7AM-8PM',
    features: ['DLP Program', 'Online Tests', 'Study Material', 'Parent Portal'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Vajiram & Ravi IAS Academy',
    description: 'Premier UPSC coaching institute with a legacy of producing IAS, IPS, and IFS officers. Our Noida centre offers comprehensive GS, Optional, and Interview preparation.',
    category: 'UPSC',
    fees: { monthly: 12000, annual: 135000 },
    rating: { average: 4.9, count: 567 },
    images: [
      { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800', caption: 'Classroom' },
      { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', caption: 'Library' }
    ],
    latitude: 28.5744, longitude: 77.3562,
    address: { street: 'E-15, Sector 16', sector: 'Sector 16', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543214', email: 'noida@vajiramandravi.com', website: 'https://vajiramandravi.com',
    established: 1976, faculty: 35, students: 1200, batchSize: 30,
    timing: 'Mon-Sun: 8AM-8PM',
    features: ['Current Affairs', 'Answer Writing', 'Mock Interviews', 'GS Foundation', 'Optional Subjects'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Drishti IAS Noida',
    description: 'Drishti IAS is a trusted name in UPSC preparation. Our comprehensive courses cover all aspects of civil services examination with expert guidance.',
    category: 'UPSC',
    fees: { monthly: 10500, annual: 118000 },
    rating: { average: 4.7, count: 423 },
    images: [
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', caption: 'Faculty' }
    ],
    latitude: 28.5612, longitude: 77.3445,
    address: { street: 'F-22, Sector 15', sector: 'Sector 15', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543215', email: 'noida@drishtiias.com', website: 'https://drishtiias.com',
    established: 1999, faculty: 28, students: 950, batchSize: 25,
    timing: 'Mon-Sat: 9AM-7PM',
    features: ['Hindi Medium', 'English Medium', 'Online Classes', 'Test Series', 'Magazine'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Coding Ninjas Noida',
    description: 'India\'s leading coding bootcamp offering courses in Data Structures, Web Development, Machine Learning, and more. Industry-aligned curriculum with placement support.',
    category: 'Coding',
    fees: { monthly: 6500, annual: 72000 },
    rating: { average: 4.6, count: 892 },
    images: [
      { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', caption: 'Coding Lab' },
      { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', caption: 'Workshop' }
    ],
    latitude: 28.5921, longitude: 77.3089,
    address: { street: 'G-56, Sector 62', sector: 'Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201309' },
    phone: '+91-9876543216', email: 'noida@codingninjas.com', website: 'https://codingninjas.com',
    established: 2016, faculty: 25, students: 1500, batchSize: 20,
    timing: 'Mon-Sat: 9AM-9PM',
    features: ['Placement Support', 'Live Projects', 'Mentorship', 'Certificate', 'Job Guarantee'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Masai School Noida',
    description: 'Masai School offers an Income Share Agreement model for full-stack development. Pay only after you get placed. Intensive 30-week program with industry mentors.',
    category: 'Coding',
    fees: { monthly: 0, annual: 0 },
    rating: { average: 4.4, count: 334 },
    images: [
      { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', caption: 'Campus' }
    ],
    latitude: 28.5834, longitude: 77.3178,
    address: { street: 'H-89, Sector 58', sector: 'Sector 58', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543217', email: 'noida@masaischool.com', website: 'https://masaischool.com',
    established: 2019, faculty: 18, students: 800, batchSize: 15,
    timing: 'Mon-Fri: 9AM-6PM',
    features: ['ISA Model', 'Full Stack', 'Job Guarantee', 'Peer Learning', 'Industry Projects'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'British Council Noida',
    description: 'The British Council offers world-class English language courses, IELTS preparation, and cultural programs. Internationally recognized certificates accepted worldwide.',
    category: 'Language',
    fees: { monthly: 5500, annual: 62000 },
    rating: { average: 4.8, count: 678 },
    images: [
      { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', caption: 'Language Lab' }
    ],
    latitude: 28.5456, longitude: 77.3234,
    address: { street: 'I-34, Sector 18', sector: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543218', email: 'noida@britishcouncil.in', website: 'https://britishcouncil.in',
    established: 1934, faculty: 22, students: 600, batchSize: 15,
    timing: 'Mon-Sat: 9AM-7PM',
    features: ['IELTS Prep', 'Business English', 'Spoken English', 'Cambridge Exams', 'Cultural Events'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Berlitz Language Center',
    description: 'Berlitz offers immersive language learning in French, German, Spanish, Japanese, and more. Our unique method ensures rapid fluency through conversation-based learning.',
    category: 'Language',
    fees: { monthly: 6200, annual: 70000 },
    rating: { average: 4.5, count: 234 },
    images: [
      { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', caption: 'Classroom' }
    ],
    latitude: 28.5678, longitude: 77.3456,
    address: { street: 'J-67, Sector 25', sector: 'Sector 25', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543219', email: 'noida@berlitz.com', website: 'https://berlitz.com',
    established: 1878, faculty: 15, students: 400, batchSize: 10,
    timing: 'Mon-Sat: 8AM-8PM',
    features: ['French', 'German', 'Spanish', 'Japanese', 'Mandarin', 'Corporate Training'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'IMS Learning Centre',
    description: 'IMS is India\'s top MBA coaching institute with 40+ years of experience. Comprehensive preparation for CAT, XAT, GMAT, and other management entrance exams.',
    category: 'MBA',
    fees: { monthly: 7500, annual: 85000 },
    rating: { average: 4.6, count: 445 },
    images: [
      { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', caption: 'Centre' }
    ],
    latitude: 28.5789, longitude: 77.3567,
    address: { street: 'K-12, Sector 18', sector: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543220', email: 'noida@imsindia.com', website: 'https://imsindia.com',
    established: 1977, faculty: 20, students: 700, batchSize: 25,
    timing: 'Mon-Sat: 9AM-8PM',
    features: ['CAT Prep', 'GMAT', 'GD-PI Training', 'Mock Tests', 'B-School Guidance'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'TIME Institute Noida',
    description: 'T.I.M.E. is a leading coaching institute for CAT, GATE, GRE, GMAT, and banking exams. Structured programs with experienced faculty and comprehensive study material.',
    category: 'MBA',
    fees: { monthly: 6800, annual: 76000 },
    rating: { average: 4.4, count: 312 },
    images: [
      { url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800', caption: 'Institute' }
    ],
    latitude: 28.5345, longitude: 77.3678,
    address: { street: 'L-45, Sector 22', sector: 'Sector 22', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543221', email: 'noida@time4education.com', website: 'https://time4education.com',
    established: 1992, faculty: 18, students: 550, batchSize: 30,
    timing: 'Mon-Sat: 8AM-9PM',
    features: ['CAT', 'GATE', 'GRE', 'Banking', 'SSC', 'Online Tests'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Bankers Adda Coaching',
    description: 'Specialized banking exam coaching for SBI PO, IBPS PO, RBI Grade B, and other banking sector exams. Expert faculty with banking industry experience.',
    category: 'Banking',
    fees: { monthly: 4500, annual: 50000 },
    rating: { average: 4.3, count: 567 },
    images: [
      { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800', caption: 'Classroom' }
    ],
    latitude: 28.5567, longitude: 77.3789,
    address: { street: 'M-78, Sector 12', sector: 'Sector 12', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543222', email: 'noida@bankersadda.com', website: 'https://bankersadda.com',
    established: 2010, faculty: 12, students: 900, batchSize: 50,
    timing: 'Mon-Sun: 7AM-9PM',
    features: ['SBI PO', 'IBPS PO', 'RBI Grade B', 'Mock Tests', 'Current Affairs'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Vidyamandir Classes Noida',
    description: 'Vidyamandir Classes is known for its rigorous IIT-JEE preparation methodology. Small batch sizes ensure personalized attention and better results.',
    category: 'IIT-JEE',
    fees: { monthly: 7200, annual: 82000 },
    rating: { average: 4.5, count: 189 },
    images: [
      { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', caption: 'Campus' }
    ],
    latitude: 28.5234, longitude: 77.3456,
    address: { street: 'N-23, Sector 50', sector: 'Sector 50', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543223', email: 'noida@vidyamandir.com', website: 'https://vidyamandir.com',
    established: 1992, faculty: 30, students: 1200, batchSize: 25,
    timing: 'Mon-Sat: 7AM-8PM',
    features: ['Small Batches', 'IIT Alumni Faculty', 'Weekly Tests', 'Parent Meetings'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Narayana IIT Academy',
    description: 'Narayana Group is one of India\'s largest educational institutions. Our Noida IIT Academy offers integrated programs for Class 11-12 students targeting JEE.',
    category: 'IIT-JEE',
    fees: { monthly: 8800, annual: 99000 },
    rating: { average: 4.4, count: 267 },
    images: [
      { url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', caption: 'Academy' }
    ],
    latitude: 28.5456, longitude: 77.3123,
    address: { street: 'O-56, Sector 44', sector: 'Sector 44', city: 'Noida', state: 'Uttar Pradesh', pincode: '201303' },
    phone: '+91-9876543224', email: 'noida@narayanaiit.com', website: 'https://narayanaiit.com',
    established: 1979, faculty: 42, students: 2000, batchSize: 40,
    timing: 'Mon-Sat: 6AM-9PM',
    features: ['Integrated Program', 'Hostel', 'Transport', 'Digital Classes', 'Scholarship'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Unacademy Learning Centre',
    description: 'Unacademy\'s offline learning centre brings the best of online and offline education. Access top educators for NEET, JEE, UPSC, and more with hybrid learning.',
    category: 'NEET',
    fees: { monthly: 5500, annual: 62000 },
    rating: { average: 4.3, count: 789 },
    images: [
      { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', caption: 'Centre' }
    ],
    latitude: 28.5678, longitude: 77.3890,
    address: { street: 'P-89, Sector 62', sector: 'Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201309' },
    phone: '+91-9876543225', email: 'noida@unacademy.com', website: 'https://unacademy.com',
    established: 2015, faculty: 35, students: 2500, batchSize: 50,
    timing: 'Mon-Sun: 8AM-10PM',
    features: ['Hybrid Learning', 'Top Educators', 'Live Classes', 'Recorded Lectures', 'Doubt Solving'],
    isFeatured: true, isVerified: true
  },
  {
    name: 'Byju\'s Tuition Centre Noida',
    description: 'BYJU\'S Tuition Centre offers personalized learning for Class 4-10 students. Adaptive learning technology combined with expert teachers for school subjects.',
    category: 'School Tuition',
    fees: { monthly: 3500, annual: 40000 },
    rating: { average: 4.2, count: 456 },
    images: [
      { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', caption: 'Centre' }
    ],
    latitude: 28.5345, longitude: 77.3234,
    address: { street: 'Q-12, Sector 37', sector: 'Sector 37', city: 'Noida', state: 'Uttar Pradesh', pincode: '201303' },
    phone: '+91-9876543226', email: 'noida@byjus.com', website: 'https://byjus.com',
    established: 2011, faculty: 20, students: 800, batchSize: 15,
    timing: 'Mon-Sat: 9AM-7PM',
    features: ['Adaptive Learning', 'Tablet-Based', 'All Subjects', 'Progress Reports', 'Parent App'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Toppr Coachify Noida',
    description: 'Toppr Coachify offers comprehensive school tuition and competitive exam preparation. AI-powered personalized learning paths for every student.',
    category: 'School Tuition',
    fees: { monthly: 2800, annual: 32000 },
    rating: { average: 4.1, count: 234 },
    images: [
      { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', caption: 'Centre' }
    ],
    latitude: 28.5789, longitude: 77.3345,
    address: { street: 'R-45, Sector 41', sector: 'Sector 41', city: 'Noida', state: 'Uttar Pradesh', pincode: '201303' },
    phone: '+91-9876543227', email: 'noida@toppr.com', website: 'https://toppr.com',
    established: 2013, faculty: 15, students: 600, batchSize: 20,
    timing: 'Mon-Sat: 10AM-7PM',
    features: ['AI Learning', 'Live Doubt Solving', 'Practice Tests', 'Video Lectures'],
    isFeatured: false, isVerified: false
  },
  {
    name: 'CA Foundation Academy',
    description: 'Specialized coaching for CA Foundation, Intermediate, and Final examinations. Expert faculty with Big 4 experience and 95% pass rate in CA exams.',
    category: 'Commerce',
    fees: { monthly: 5000, annual: 56000 },
    rating: { average: 4.6, count: 345 },
    images: [
      { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', caption: 'Academy' }
    ],
    latitude: 28.5567, longitude: 77.3567,
    address: { street: 'S-78, Sector 19', sector: 'Sector 19', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543228', email: 'info@cafoundation.in', website: 'https://cafoundation.in',
    established: 2005, faculty: 12, students: 450, batchSize: 30,
    timing: 'Mon-Sat: 8AM-8PM',
    features: ['CA Foundation', 'CA Inter', 'CA Final', 'Mock Tests', 'Study Material'],
    isFeatured: false, isVerified: true
  },
  {
    name: 'Fine Arts Academy Noida',
    description: 'Premier arts coaching institute offering preparation for NID, NIFT, CEED, and other design entrance exams. Expert faculty from top design schools.',
    category: 'Arts',
    fees: { monthly: 4200, annual: 48000 },
    rating: { average: 4.5, count: 178 },
    images: [
      { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', caption: 'Studio' }
    ],
    latitude: 28.5234, longitude: 77.3789,
    address: { street: 'T-23, Sector 29', sector: 'Sector 29', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
    phone: '+91-9876543229', email: 'info@finearts.in', website: 'https://finearts.in',
    established: 2008, faculty: 10, students: 300, batchSize: 15,
    timing: 'Mon-Sat: 9AM-6PM',
    features: ['NID Prep', 'NIFT Prep', 'Portfolio Building', 'Sketching', 'Digital Art'],
    isFeatured: false, isVerified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coachfinder');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Institute.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@coachfinder.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin created:', admin.email);

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@coachfinder.com',
      password: 'user123',
      role: 'user'
    });

    // Seed institutes
    const createdInstitutes = await Institute.insertMany(
      institutes.map(inst => ({
        ...inst,
        createdBy: admin._id,
        location: { type: 'Point', coordinates: [inst.longitude, inst.latitude] },
        address: {
          ...inst.address,
          fullAddress: [inst.address.street, inst.address.sector, inst.address.city, inst.address.state, inst.address.pincode].filter(Boolean).join(', ')
        }
      }))
    );
    console.log(`Seeded ${createdInstitutes.length} institutes`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin: admin@coachfinder.com / admin123');
    console.log('User:  user@coachfinder.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();

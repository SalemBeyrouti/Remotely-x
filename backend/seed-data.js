// Seed script to populate MongoDB with sample data
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/remotelyx?authSource=admin';

const sampleJobs = [
  {
    company_name: 'TechCorp',
    job_title: 'Senior Software Engineer',
    location: 'Remote - US',
    seniority_level: 'Senior',
    employment_type: 'Full-time',
    compensation_min: 120000,
    compensation_max: 160000,
    requirements: ['Python', 'AWS', 'Docker', 'React', 'MongoDB'],
    industry: 'Technology',
    posted_date: new Date('2024-01-15'),
    job_id: 'tech001'
  },
  {
    company_name: 'DataFlow Inc',
    job_title: 'Data Scientist',
    location: 'Remote - Global',
    seniority_level: 'Mid',
    employment_type: 'Full-time',
    compensation_min: 95000,
    compensation_max: 125000,
    requirements: ['Python', 'SQL', 'Tableau', 'Machine Learning', 'Pandas'],
    industry: 'Data & Analytics',
    posted_date: new Date('2024-01-14'),
    job_id: 'data001'
  },
  {
    company_name: 'CloudBase',
    job_title: 'DevOps Engineer',
    location: 'Remote - EU',
    seniority_level: 'Senior',
    employment_type: 'Full-time',
    compensation_min: 110000,
    compensation_max: 140000,
    requirements: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Linux'],
    industry: 'Cloud Computing',
    posted_date: new Date('2024-01-14'),
    job_id: 'cloud001'
  },
  {
    company_name: 'StartupXYZ',
    job_title: 'Product Manager',
    location: 'Remote - US',
    seniority_level: 'Senior',
    employment_type: 'Full-time',
    compensation_min: 130000,
    compensation_max: 170000,
    requirements: ['Product Strategy', 'Analytics', 'SQL', 'Agile', 'User Research'],
    industry: 'Product',
    posted_date: new Date('2024-01-13'),
    job_id: 'prod001'
  },
  {
    company_name: 'GreenTech',
    job_title: 'Frontend Developer',
    location: 'Remote - Americas',
    seniority_level: 'Mid',
    employment_type: 'Full-time',
    compensation_min: 85000,
    compensation_max: 115000,
    requirements: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
    industry: 'Frontend Development',
    posted_date: new Date('2024-01-13'),
    job_id: 'front001'
  },
  {
    company_name: 'InnovateLab',
    job_title: 'Backend Developer',
    location: 'Remote - Worldwide',
    seniority_level: 'Mid',
    employment_type: 'Contract',
    compensation_min: 90000,
    compensation_max: 120000,
    requirements: ['Node.js', 'MongoDB', 'API', 'Express', 'GraphQL'],
    industry: 'Backend Development',
    posted_date: new Date('2024-01-12'),
    job_id: 'back001'
  },
  {
    company_name: 'DigitalFirst',
    job_title: 'Full Stack Developer',
    location: 'Remote - US/Canada',
    seniority_level: 'Senior',
    employment_type: 'Full-time',
    compensation_min: 100000,
    compensation_max: 130000,
    requirements: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    industry: 'Full Stack',
    posted_date: new Date('2024-01-12'),
    job_id: 'full001'
  },
  {
    company_name: 'NextGen Solutions',
    job_title: 'UI/UX Designer',
    location: 'Remote - US',
    seniority_level: 'Mid',
    employment_type: 'Full-time',
    compensation_min: 80000,
    compensation_max: 110000,
    requirements: ['Figma', 'Adobe XD', 'UX Research', 'Prototyping', 'User Testing'],
    industry: 'Design',
    posted_date: new Date('2024-01-11'),
    job_id: 'design001'
  },
  {
    company_name: 'AI Dynamics',
    job_title: 'Machine Learning Engineer',
    location: 'Remote - Global',
    seniority_level: 'Senior',
    employment_type: 'Full-time',
    compensation_min: 140000,
    compensation_max: 180000,
    requirements: ['Python', 'TensorFlow', 'MLOps', 'AWS', 'Kubernetes'],
    industry: 'AI/ML',
    posted_date: new Date('2024-01-11'),
    job_id: 'ml001'
  },
  {
    company_name: 'WebScale',
    job_title: 'Cloud Architect',
    location: 'Remote - US',
    seniority_level: 'Senior',
    employment_type: 'Full-time',
    compensation_min: 135000,
    compensation_max: 175000,
    requirements: ['AWS', 'Microservices', 'Docker', 'Kubernetes', 'Architecture'],
    industry: 'Cloud Architecture',
    posted_date: new Date('2024-01-10'),
    job_id: 'arch001'
  }
];

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('remotelyx');
    const collection = db.collection('jobs');
    
    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing jobs');
    
    // Insert sample data
    const result = await collection.insertMany(sampleJobs);
    console.log(`Inserted ${result.insertedCount} jobs`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase();

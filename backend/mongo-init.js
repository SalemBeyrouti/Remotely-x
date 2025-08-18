// MongoDB initialization script
db = db.getSiblingDB('remotelyx');

// Create a user for the application
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'remotelyx'
    }
  ]
});

// Create collections
db.createCollection('jobs');
db.createCollection('monthly_frequency');
db.createCollection('skill_correlation');
db.createCollection('seniority');

// Create indexes for better performance
db.jobs.createIndex({ "job_title": 1 });
db.jobs.createIndex({ "seniority_level": 1 });
db.jobs.createIndex({ "skills": 1 });

db.monthly_frequency.createIndex({ "level": 1 }, { unique: true });
db.skill_correlation.createIndex({ "skillA": 1, "skillB": 1 });
db.seniority.createIndex({ "level": 1 }, { unique: true });

print('MongoDB initialization completed successfully!');

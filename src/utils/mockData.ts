export interface CounsellingData {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  relationship_status: string;
  country: string;
  state: string;
  address: string;
  nearest_bus_stop: string;
  isStudent: string;
  age_group: string;
  school: string;
  occupation: string;
  denomination: string;
  gender: string;
  availability_for_follow_up: string;
}

export const mockDocuments: CounsellingData[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  email: `person${i + 1}@example.com`,
  phone_number: `+234${Math.floor(Math.random() * 1000000000)}`,
  date_of_birth: `199${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  relationship_status: ['Single', 'Married', 'Divorced'][Math.floor(Math.random() * 3)],
  country: 'Nigeria',
  state: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'][Math.floor(Math.random() * 4)],
  address: `${Math.floor(Math.random() * 100)} Main Street`,
  nearest_bus_stop: ['Central', 'Market Square', 'Township'][Math.floor(Math.random() * 3)],
  isStudent: Math.random() > 0.5 ? 'Yes' : 'No',
  age_group: ['18-24', '25-34', '35-44'][Math.floor(Math.random() * 3)],
  school: ['University of Lagos', 'Covenant University', 'Babcock University'][Math.floor(Math.random() * 3)],
  occupation: ['Student', 'Engineer', 'Teacher', 'Business Owner'][Math.floor(Math.random() * 4)],
  denomination: ['Christian', 'Catholic', 'Pentecostal'][Math.floor(Math.random() * 3)],
  gender: Math.random() > 0.5 ? 'Male' : 'Female',
  availability_for_follow_up: Math.random() > 0.3 ? 'Yes' : 'No',
}));
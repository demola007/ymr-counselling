export interface Convert {
  id: number;
  name: string;
  gender: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  country: string;
  state: string;
  address: string;
  relationship_status: string;
  occupation: string;
  is_student: boolean;
  school: string;
  age_group: string;
  denomination: string;
  nearest_bus_stop: string;
  availability_for_follow_up: boolean;
  online: boolean;
}

export const convertColumns = [
  { key: 'name', label: 'Name' },
  { key: 'gender', label: 'Gender' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'country', label: 'Country' },
  { key: 'state', label: 'State' },
  { key: 'is_student', label: 'Student' },
  { key: 'denomination', label: 'Denomination' },
  { key: 'online', label: 'Online Convert' },
];
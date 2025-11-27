import { Convert } from "@/types/convert";

// Mock AI processing endpoint
export const processDocumentsWithAI = async (files: File[]): Promise<Convert[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock response - return one convert per file
  return files.map((file, index) => ({
    id: Date.now() + index,
    name: index === 0 ? "Ademola Adesina Sobaki" : "Tomilola Daniel",
    gender: index === 0 ? "Male" : "Female",
    email: index === 0 ? "demo1asina@gmail.com" : "tomi_ajose@yahoo.com",
    phone_number: index === 0 ? "08069459884" : "08069144619",
    date_of_birth: "",
    relationship_status: index === 0 ? "Single" : "Married",
    country: "Nigeria",
    state: "Lagos",
    address: index === 0 ? "46-48 Km Lagos-Ibadan expressway, Ogun state" : "14 Ogundare Street, Iyana Abesan, Lagos",
    nearest_bus_stop: index === 0 ? "Mowe bus stop" : "Gate bus stop",
    is_student: false,
    age_group: index === 0 ? "35-44" : "25-34",
    school: "",
    occupation: index === 0 ? "Software Engineer" : "Lawyer",
    denomination: "RCCG",
    availability_for_follow_up: true,
    online: false,
  }));
};

// Mock bulk submit endpoint
export const bulkSubmitConverts = async (converts: Convert[]): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("Submitting converts:", converts);
};

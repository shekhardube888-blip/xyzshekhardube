// Pre-seeded list of existing students with their internship data.
// Email + Phone are the primary keys. If a user enters a matching
// email + phone on the login page, they go straight to their dashboard.

export type ExistingStudent = {
  id: string
  name: string
  email: string
  phone: string
  stream: string
  qualification: string
  year: string
  college: string
  city: string
  category: string
  subcategory: string
  track: string
  guardianEmail: string
  guardianRole: string
  startDate: number
}

export const EXISTING_STUDENTS: ExistingStudent[] = [
  {
    id: "ex_1",
    name: "Aditya Sharma",
    email: "aditya.s@iiti.ac.in",
    phone: "9876543210",
    stream: "MBA · Marketing",
    qualification: "MBA",
    year: "2nd Year",
    college: "IIM Indore",
    city: "Indore",
    category: "MBA / Management",
    subcategory: "Marketing & Brand Strategy",
    track: "MBA",
    guardianEmail: "hod@iiti.ac.in",
    guardianRole: "HOD",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "ex_2",
    name: "Priya Menon",
    email: "priya.m@nmims.edu",
    phone: "9876512345",
    stream: "BBA · Digital Marketing",
    qualification: "BBA",
    year: "2nd Year",
    college: "NMIMS Mumbai",
    city: "Mumbai",
    category: "BBA / Business",
    subcategory: "Digital Marketing",
    track: "BBA",
    guardianEmail: "parent.menon@gmail.com",
    guardianRole: "Parent",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: "ex_3",
    name: "Kartik Verma",
    email: "kartik.v@xaviers.edu",
    phone: "9876509876",
    stream: "BSc · Statistics",
    qualification: "BSc",
    year: "3rd Year",
    college: "St. Xavier's Mumbai",
    city: "Mumbai",
    category: "BSc Statistics / Maths",
    subcategory: "Actuarial & Risk",
    track: "BSc",
    guardianEmail: "father.verma@gmail.com",
    guardianRole: "Parent",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "ex_4",
    name: "Sneha Kulkarni",
    email: "sneha.k@fergusson.edu",
    phone: "9876498765",
    stream: "BSc · Computer Science",
    qualification: "BSc",
    year: "2nd Year",
    college: "Fergusson College",
    city: "Pune",
    category: "BSc Computer Science",
    subcategory: "Data Science & Analytics",
    track: "BSc",
    guardianEmail: "sneha.hod@fergusson.edu",
    guardianRole: "HOD",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "ex_5",
    name: "Rahul Joshi",
    email: "rahul.j@symbiosis.edu",
    phone: "9876487654",
    stream: "BBA · Entrepreneurship",
    qualification: "BBA",
    year: "1st Year",
    college: "Symbiosis Pune",
    city: "Pune",
    category: "BBA / Business",
    subcategory: "Entrepreneurship & Startup",
    track: "BBA",
    guardianEmail: "rahul.parent@gmail.com",
    guardianRole: "Parent",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "ex_6",
    name: "Nidhi Patel",
    email: "nidhi.p@nmims.edu",
    phone: "9876476543",
    stream: "MBA · Operations",
    qualification: "MBA",
    year: "1st Year",
    college: "NMIMS Bangalore",
    city: "Bangalore",
    category: "MBA / Management",
    subcategory: "Operations & Supply Chain",
    track: "MBA",
    guardianEmail: "nidhi.hod@nmims.edu",
    guardianRole: "HOD",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "ex_7",
    name: "Arjun Mehta",
    email: "arjun.mehta@iitb.ac.in",
    phone: "9876465432",
    stream: "MBA · Marketing",
    qualification: "MBA",
    year: "2nd Year",
    college: "IIT Bombay",
    city: "Mumbai",
    category: "MBA / Management",
    subcategory: "Marketing & Brand Strategy",
    track: "MBA",
    guardianEmail: "arjun.parent@gmail.com",
    guardianRole: "Parent",
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: "ex_8",
    name: "Divya Reddy",
    email: "divya.r@nitt.edu",
    phone: "9876454321",
    stream: "BSc · Data Science",
    qualification: "BSc",
    year: "3rd Year",
    college: "NIT Trichy",
    city: "Trichy",
    category: "BSc Computer Science",
    subcategory: "Data Science & Analytics",
    track: "BSc",
    guardianEmail: "divya.hod@nitt.edu",
    guardianRole: "HOD",
    startDate: Date.now(),
  },
]

/**
 * Check if an email + phone match an existing student.
 * Returns the student if found, null otherwise.
 */
export function findExistingStudent(email: string, phone: string): ExistingStudent | null {
  const cleanEmail = email.trim().toLowerCase()
  const cleanPhone = phone.replace(/\D/g, "")
  return (
    EXISTING_STUDENTS.find(
      (s) =>
        s.email.toLowerCase() === cleanEmail && s.phone.replace(/\D/g, "") === cleanPhone,
    ) ?? null
  )
}

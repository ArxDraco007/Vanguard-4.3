export interface Class {
  id: string
  name: string
  year: number
  description?: string
  created_at: string
}

export interface Candidate {
  id: string
  name: string
  title: string
  class_id: string
  created_at: string
}

export const classes: Class[] = [
  {
    id: 'class-2025',
    name: 'Class of 2025',
    year: 2025,
    description: 'The inaugural Vanguard leadership cohort',
    created_at: '2024-01-01T00:00:00Z'
  }
]

export const candidatesWithClasses: Candidate[] = [
  { id: 'aadhya-agarwal', name: 'AADHYA AGARWAL', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'aaditya-kansal', name: 'AADITYA KANSAL', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'aashi-parth-aghera', name: 'AASHI PARTH AGHERA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'arav-jagadesh', name: 'ARAV JAGADESH', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'aryan-ashik-kozhiparambil', name: 'ARYAN ASHIK KOZHIPARAMBIL', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'arnav-dipak-shedbale', name: 'ARNAV DIPAK SHEDBALE', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'arnav-nair', name: 'ARNAV NAIR', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'arush-jakkhodia', name: 'ARUSH JAKKHODIA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'avyukth-arunkumar', name: 'AVYUKTH ARUNKUMAR', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'garvit-sukhani', name: 'GARVIT SUKHANI', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'gauraang-agarwal', name: 'GAURAANG AGARWAL', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ishaan-paresh-bhalodia', name: 'ISHAAN PARESH BHALODIA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'jai-vardhan-deorah', name: 'JAI VARDHAN DEORAH', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'jatan-vinay-jain', name: 'JATAN VINAY JAIN', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'k-harshini', name: 'K HARSHINI', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'khuvi-sarawgi', name: 'KHUVI SARAWGI', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'kunkudevi-preetham', name: 'KUNKUDEVI PREETHAM', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'mahant-m', name: 'MAHANT M', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'mahir-jay-marvania', name: 'MAHIR JAY MARVANIA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'mythili-aravind', name: 'MYTHILI ARAVIND', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'patanjali-a-r', name: 'PATANJALI A R', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ramdhan-sarawgi', name: 'RAMDHAN SARAWGI', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 's-m-rubajanani', name: 'S M RUBAJANANI', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 's-rakshana', name: 'S.RAKSHANA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'sachit-pandey', name: 'SACHIT PANDEY', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'sara-fujikawa-choudhary', name: 'SARA FUJIKAWA CHOUDHARY', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'shruthika-neela', name: 'SHRUTHIKA NEELA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'sidharth-raja-ponnurengam', name: 'SIDHARTH RAJA PONNURENGAM', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tanmmay-n-hambigi', name: 'TANMMAY N HAMBIGI', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'vishesh-khaitan', name: 'VISHESH KHAITAN', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' },
  { id: 'vrishank-mehta', name: 'VRISHANK MEHTA', title: 'Vanguard Candidate', class_id: 'class-2025', created_at: '2024-01-01T00:00:00Z' }
]
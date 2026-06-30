import { Hospital, MedicationRequest, MedicationOffer } from '../types';

export const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'Instituto Nacional de Perinatología (INPer)',
    address: 'Montes Urales 800, Lomas de Virreyes',
    city: 'Ciudad de México',
    state: 'CDMX',
    phone: '+52 55 5520 9900',
    email: 'contacto@inper.mx',
    director: 'Dr. Arturo Cardona Pérez',
    beds: 250,
    type: 'public',
    specialties: ['Neonatología', 'Obstetricia', 'Medicina Fetal'],
    status: 'active',
    verified: true
  },
  {
    id: '2',
    name: 'Hospital de la Mujer',
    address: 'Salvador Díaz Mirón 374, Santo Tomás',
    city: 'Ciudad de México',
    state: 'CDMX',
    phone: '+52 55 5341 1100',
    email: 'contacto@hospitalmujer.mx',
    director: 'Dra. Elizabeth Alvarado',
    beds: 180,
    type: 'public',
    specialties: ['Ginecología', 'Obstetricia', 'Neonatología'],
    status: 'active',
    verified: true
  },
  {
    id: '3',
    name: 'Hospital General de México',
    address: 'Dr. Balmis 148, Doctores',
    city: 'Ciudad de México',
    state: 'CDMX',
    phone: '+52 55 2789 2000',
    email: 'contacto@hgm.mx',
    director: 'Dra. Guadalupe Guerrero',
    beds: 320,
    type: 'public',
    specialties: ['Pediatría', 'Cirugía General', 'Urgencias'],
    status: 'active',
    verified: true
  }
];

export const medicationRequests: MedicationRequest[] = [
  {
    id: '1',
    hospitalId: '1',
    hospitalName: 'Instituto Nacional de Perinatología (INPer)',
    medication: {
      name: 'Amoxicilina',
      genericName: 'Amoxicilina',
      dosage: '500mg',
      form: 'capsule',
      manufacturer: 'Laboratorios Pisa',
      quantity: 100,
      unit: 'units',
      category: 'antibiotics',
      requiresRefrigeration: false,
      controlledSubstance: false
    },
    quantityRequested: 500,
    urgency: 'high',
    reason: 'Brote de infecciones respiratorias en pediatría',
    contactPerson: 'Dr. Luis Hernández',
    contactPhone: '+52 55 5520 9901',
    contactEmail: 'lhernandez@inper.mx',
    dateRequested: '2024-01-15',
    dateNeeded: '2024-01-20',
    status: 'pending',
    responses: []
  },
  {
    id: '2',
    hospitalId: '2',
    hospitalName: 'Hospital de la Mujer',
    medication: {
      name: 'Morfina',
      genericName: 'Sulfato de Morfina',
      dosage: '10mg/ml',
      form: 'injection',
      manufacturer: 'Pfizer',
      quantity: 50,
      unit: 'ml',
      category: 'analgesics',
      requiresRefrigeration: true,
      controlledSubstance: true
    },
    quantityRequested: 200,
    urgency: 'critical',
    reason: 'Pacientes post-quirúrgicos con dolor severo',
    contactPerson: 'Dra. Patricia Vega',
    contactPhone: '+52 55 5341 1102',
    contactEmail: 'pvega@hospitalmujer.mx',
    dateRequested: '2024-01-16',
    dateNeeded: '2024-01-18',
    status: 'pending',
    responses: []
  }
];

export const medicationOffers: MedicationOffer[] = [
  {
    id: '1',
    hospitalId: '3',
    hospitalName: 'Hospital General de México',
    medication: {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminofén',
      dosage: '500mg',
      form: 'tablet',
      manufacturer: 'Laboratorios Silanes',
      expirationDate: '2024-12-31',
      quantity: 1000,
      unit: 'units',
      category: 'analgesics',
      requiresRefrigeration: false,
      controlledSubstance: false
    },
    quantityAvailable: 1000,
    pricePerUnit: 0.50,
    conditions: 'Medicamento en buen estado, almacenado correctamente',
    contactPerson: 'Dr. Roberto Sánchez',
    contactPhone: '+52 55 2789 2003',
    contactEmail: 'rsanchez@hgm.mx',
    datePosted: '2024-01-10',
    validUntil: '2024-02-10',
    status: 'available'
  },
  {
    id: '2',
    hospitalId: '1',
    hospitalName: 'Instituto Nacional de Perinatología (INPer)',
    medication: {
      id: '2',
      name: 'Insulina Glargina',
      genericName: 'Insulina Glargina',
      dosage: '100 UI/ml',
      form: 'injection',
      manufacturer: 'Sanofi',
      expirationDate: '2024-08-15',
      quantity: 20,
      unit: 'units',
      category: 'endocrine',
      requiresRefrigeration: true,
      controlledSubstance: false
    },
    quantityAvailable: 20,
    conditions: 'Refrigerado desde origen, cadena de frío garantizada',
    contactPerson: 'Dra. Elena Ramírez',
    contactPhone: '+52 55 5520 9904',
    contactEmail: 'eramirez@inper.mx',
    datePosted: '2024-01-12',
    validUntil: '2024-02-12',
    status: 'available'
  }
];
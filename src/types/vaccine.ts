export interface VaccineLot {
  id: string;
  vaccineId: string;
  vaccineName: string;
  lotNumber: string;
  manufacturer: string;
  expiryDate: Date;
  quantityReceived: number;
  quantityCurrent: number;
  receivedDate: Date;
  status: 'available' | 'low' | 'critical' | 'expired';
}

export interface VaccineApplication {
  id: string;
  date: Date;
  vaccineId: string;
  vaccineName: string;
  lotNumber: string;
  doseType: 'D1' | 'D2' | 'D3' | 'DU' | 'REF' | 'REF1' | 'REF2';
  ageGroup: string;
  quantity: number;
  appliedBy: string;
}

export interface VaccineLoss {
  id: string;
  date: Date;
  vaccineId: string;
  vaccineName: string;
  lotNumber: string;
  quantity: number;
  reason: 'expired' | 'broken' | 'temperature' | 'contaminated' | 'other';
  notes?: string;
  registeredBy: string;
}

export interface TemperatureReading {
  id: string;
  date: Date;
  time: string;
  temperatureCelsius: number;
  equipmentId: string;
  equipmentName: string;
  responsible: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface DailyChecklist {
  id: string;
  date: Date;
  temperatureVerified: boolean;
  equipmentOk: boolean;
  lotsValid: boolean;
  epiOk: boolean;
  cleaningDone: boolean;
  responsible: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: 'create' | 'update' | 'delete' | 'apply' | 'loss' | 'transfer';
  entity: string;
  entityId: string;
  details: string;
}

export interface DashboardStats {
  totalLots: number;
  availableDoses: number;
  applicationsToday: number;
  lossesToday: number;
  expiringIn30Days: number;
  criticalStock: number;
  lastTemperature: number;
  temperatureStatus: 'normal' | 'warning' | 'critical';
}

export type CompanyFormData = {
  companyName: string
  noOfLocations: number;
  email: string
  gstNo: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
  contactPerson: string
  personMobile: string
  personDesignation: string
}

export type Company = {
  id: number
  name: string
  email: string | null
  gst: string
  address: string
  city: string
  state: string
  country: string
  pin: string
  contact_person_name: string
  contact_person_mobile: string
  contact_person_designation: string
  is_active: number
  created_at: string
  updated_at: string
}

export type LocationData = {
    locationCount: number;
    locationName: string[]
    locationAddress: string[]
    contactPerson: string[]
    personMobile: string[]
}

export type LocationDetails = {
  id: number
  company_id: number
  location_name: string
  location_address: string
  valet_count: number
  contact_person_name: string
  contact_person_mobile: string
  is_active: number
  created_at: string
  updated_at: string
}

// export interface ValetBoyDetails {
//   id: string
//   name: string
//   mobile: string
//   prk_lot_id: string
//   valet_boy_id: string
//   status: "on-duty" | "off-duty" | "break"
// }

export interface ValetBoyData {
  count: number
  name: string[]
  mobile: string[]
  prk_lot_id: string[]
  valet_boy_id: string[]
}

export type ValetBoyDetails = {
  id: number
  company_id: number
  valet_location_id: number
  valet_boy_id: string
  valet_boy_name: string
  prk_lot_id: string
  status: string
  created_at: string
  mobile: string
}

export type Location = {
  id: Number;
  location_name: string 
  contact_person_name: string
}

export type VehicleEntry = {
  vehicleNumber: string;
  token: string;
  owner: string; 
  mobile: string;
}

export type VehicleExit = {
  vehicleNumber: string;
  status: string;
  token: string;
  mode: string;
}

export type VehicleData = {
  id: number;
  valet_location_id: number;
  company_id: number;
  vehicle_number: string;
  owner_name: string;
  owner_mobile: string;
  entry_time: Date;
  exit_time: Date | null;
  total_duration_hrs: number | null;
  created_at: Date;
  exit_by_valet: number | null;
  entry_by_valet: number;
  charge_rate: number | null;
  token: string;
  dropped_by: number | null;
  assigned_valet: number | null;
  status: string | null;
  vehicle_requested: string | null;
  valet_boy_name: string | null;
  location_name: string | null;
};

export type Request = {
    id: number;
    vehicle_number: string;
    customer_name: string;
    request_time: string;
};

export type LocationManager = {
  id: number;
  company_id: number;
  location_name: string;
  location_address: string;
  valet_count: number;
  contact_person_name: string;
  contact_person_mobile: string;
  is_active: number; // or boolean if you convert it
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};
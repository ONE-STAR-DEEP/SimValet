export type CompanyFormData = {
  companyName: string
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
  owner: string; 
  mobile: string;
}
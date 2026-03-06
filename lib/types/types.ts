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
export type LocationData = {
    locationCount: number;
    locationName: string[]
    locationAddress: string[]
    contactPerson: string[]
    personMobile: string[]
}

export interface ValetBoyDetails {
  id: string
  name: string
  mobile: string
  prk_lot_id: string
  valet_boy_id: string
  status: "on-duty" | "off-duty" | "break"
}

export interface ValetBoyData {
  count: number
  name: string[]
  mobile: string[]
  prk_lot_id: string[]
  valet_boy_id: string[]
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
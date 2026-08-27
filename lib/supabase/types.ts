export type UserRole = 'owner' | 'employee'
export type OfferType = 'schaetzung' | 'kva' | 'festpreis'
export type OfferStatus = 'entwurf' | 'gesendet' | 'angenommen' | 'abgelehnt'
export type InvoiceStatus = 'entwurf' | 'gesendet' | 'bezahlt' | 'mahnung'
export type ItemType = 'material' | 'labor' | 'heading' | 'text'

export interface Profile {
  id: string
  name: string
  role: UserRole
  phone: string | null
  created_at: string
}

export interface Customer {
  id: string
  name: string
  company: string | null
  street: string | null
  zip: string | null
  city: string | null
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
  created_by: string | null
}

export interface Material {
  id: string
  name: string
  unit: string
  price_per_unit: number
  category: string | null
  created_at: string
}

export interface OfferBlock {
  id: string
  name: string
  description: string | null
  created_at: string
  items?: OfferBlockItem[]
}

export interface OfferBlockItem {
  id: string
  block_id: string
  position: number
  type: 'material' | 'labor' | 'text'
  description: string
  material_id: string | null
  quantity: number | null
  unit: string | null
  unit_price: number | null
  labor_hours: number | null
}

export interface Offer {
  id: string
  offer_number: string
  customer_id: string
  title: string
  type: OfferType
  status: OfferStatus
  inspection_date: string | null
  valid_until: string | null
  discount_percent: number
  hourly_rate: number | null
  notes: string | null
  created_at: string
  created_by: string | null
  customer?: Customer
  items?: OfferItem[]
}

export interface OfferItem {
  id: string
  offer_id: string
  position: number
  type: ItemType
  description: string
  quantity: number | null
  unit: string | null
  unit_price: number | null
  labor_hours: number | null
  block_item_id: string | null
}

export interface Invoice {
  id: string
  invoice_number: string
  offer_id: string | null
  customer_id: string
  status: InvoiceStatus
  issue_date: string | null
  due_date: string | null
  paid_date: string | null
  notes: string | null
  created_at: string
  customer?: Customer
  offer?: Offer
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  position: number
  type: ItemType
  description: string
  quantity: number | null
  unit: string | null
  unit_price: number | null
  labor_hours: number | null
}

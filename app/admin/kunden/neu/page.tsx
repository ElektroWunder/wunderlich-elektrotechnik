import CustomerForm from '@/components/admin/CustomerForm'

export const metadata = { title: 'Neuer Kunde – Wunderlich Admin' }

export default function NeuKundePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Neuer Kunde</h1>
        <p className="text-gray-500 text-sm mt-1">Kundendaten eingeben</p>
      </div>
      <CustomerForm />
    </div>
  )
}

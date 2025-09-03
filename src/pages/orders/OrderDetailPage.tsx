import { useParams } from 'react-router-dom'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order #{id} Details</h2>
          <p className="text-gray-600 mb-4">
            Detailed order information will be displayed here.
          </p>
          <p className="text-sm text-gray-500">
            This will include order items, shipping details, payment information, and tracking status.
          </p>
        </div>
      </div>
    </div>
  )
}

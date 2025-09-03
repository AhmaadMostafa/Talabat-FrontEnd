interface OrderTotalsProps {
  subtotal: number
  shipping: number
  total: number
}

export default function OrderTotals({ subtotal, shipping, total }: OrderTotalsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
          </span>
        </div>
        
        <div className="border-t pt-2">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
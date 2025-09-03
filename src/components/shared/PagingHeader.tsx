interface PagingHeaderProps {
  totalCount: number
  pageNumber: number
  pageSize: number
}

export default function PagingHeader({ totalCount, pageNumber, pageSize }: PagingHeaderProps) {
  const startItem = (pageNumber - 1) * pageSize + 1
  const endItem = Math.min(pageNumber * pageSize, totalCount)

  if (totalCount === 0) {
    return (
      <div className="text-sm text-gray-600">
        No items found
      </div>
    )
  }

  return (
    <div className="text-sm text-gray-600">
      Showing {startItem}-{endItem} of {totalCount} results
    </div>
  )
}
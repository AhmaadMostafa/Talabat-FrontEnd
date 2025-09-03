import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust startPage if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = generatePageNumbers()

  return (
    <nav className="flex items-center justify-center">
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            'p-2 rounded-md transition-colors',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          )}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* First page if not in visible range */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-gray-500">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'px-3 py-2 text-sm rounded-md transition-colors',
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        ))}

        {/* Last page if not in visible range */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            'p-2 rounded-md transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          )}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}
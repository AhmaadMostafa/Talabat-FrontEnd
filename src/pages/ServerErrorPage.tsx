import { Link } from 'react-router-dom'

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-red-300">500</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Server Error</h2>
          <p className="mt-2 text-sm text-gray-600">
            Something went wrong on our end. Please try again later.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="btn btn-primary"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
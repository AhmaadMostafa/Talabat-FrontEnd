export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} talabat All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
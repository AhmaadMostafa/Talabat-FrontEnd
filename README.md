# React E-commerce Application

A modern e-commerce application built with React, TypeScript, Vite, and Tailwind CSS. This project was converted from an Angular application to React, maintaining all the core functionality while leveraging React's ecosystem.

## 🚀 Features

### Core Features
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Shopping Basket**: Add, remove, and manage items in your cart
- **User Authentication**: Login and registration system
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient state management

### Pages & Components
- **Home Page**: Hero carousel and featured content
- **Shop Page**: Product listing with filters, search, and pagination
- **Product Details**: Detailed product view with quantity selection
- **Shopping Basket**: Cart management with item controls
- **Authentication**: Login and registration forms
- **User Navigation**: Protected routes and user menu

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Headless UI** - Accessible UI components
- **Heroicons** - Icon library

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── basket/         # Basket-related components
│   ├── layout/         # Layout components (NavBar, Footer)
│   ├── shared/         # Shared components (Pagination, LoadingSpinner)
│   └── shop/           # Shop-related components
├── lib/                # Utilities and API configuration
├── pages/              # Page components
│   ├── account/        # Login and Register pages
│   ├── basket/         # Basket page
│   ├── checkout/       # Checkout pages
│   ├── orders/         # Orders pages
│   └── shop/           # Shop and Product pages
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
└── main.tsx            # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd react-ecommerce-client
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:4200](http://localhost:4200) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
The application expects a backend API at `/api`. Configure proxy settings in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:5001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### API Integration
The application includes API utilities for:
- Product management
- User authentication
- Basket operations
- Order processing

## 🎨 Styling

The project uses Tailwind CSS with custom component classes:
- Button variants (primary, secondary, outline)
- Input styling
- Card components
- Custom utilities for common patterns

## 🔒 Authentication

- JWT-based authentication
- Protected routes for checkout and orders
- Persistent login state with localStorage
- Automatic token refresh handling

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation with mobile menu
- Adaptive grid layouts
- Touch-friendly interactions

## 🔮 Future Enhancements

### Planned Features
- **Complete Checkout Flow**: Multi-step checkout with address, delivery, and payment
- **Order Management**: Full order history and tracking
- **Advanced Search**: Filters, categories, and search suggestions
- **User Profiles**: Account management and preferences
- **Payment Integration**: Stripe or PayPal integration
- **Wishlist**: Save items for later
- **Reviews & Ratings**: Product feedback system

### Technical Improvements
- **Testing**: Unit and integration tests
- **Performance**: Image optimization and lazy loading
- **SEO**: Server-side rendering with Next.js
- **PWA**: Offline support and app-like experience
- **Internationalization**: Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original Angular application architecture
- Tailwind CSS for the design system
- React community for excellent tooling and libraries
# Checkout Setup Guide

This guide explains how to set up the checkout functionality with Stripe integration and your backend API.

## Prerequisites

1. **Stripe Account**: You need a Stripe account with API keys
2. **Backend API**: Your .NET backend should be running on `https://localhost:7076`
3. **Authentication**: Users must be logged in to access checkout (JWT token required)

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration (optional, defaults to https://localhost:7076/api)
VITE_API_BASE_URL=https://localhost:7076/api
```

## Stripe Setup

1. **Get your publishable key** from your Stripe dashboard
2. **Replace the placeholder** in the `.env` file with your actual key
3. **Test mode**: Use `pk_test_...` keys for development

## Backend API Endpoints

The checkout system expects these endpoints from your backend:

### Orders Controller
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get specific order
- `GET /api/orders/deliveryMethods` - Get available delivery methods

### Payments Controller
- `POST /api/payments/{basketId}` - Create/update payment intent

## Features

### 1. Shipping Address Form
- First Name, Last Name
- Street Address
- City, Country
- All fields are required

### 2. Delivery Method Selection
- Fetched from `/api/orders/deliveryMethods`
- Shows delivery time, description, and cost
- Automatically calculates shipping price

### 3. Stripe Payment Integration
- Secure card input using Stripe Elements
- Payment intent creation before order placement
- Handles payment processing securely

### 4. Order Creation
- Creates payment intent first
- Then creates order with shipping details
- Clears basket after successful order
- Redirects to success page

## User Flow

1. **User adds items to basket** → Navigate to checkout
2. **Fill shipping address** → Required fields validation
3. **Select delivery method** → Shows available options with costs
4. **Enter payment details** → Stripe card input
5. **Place order** → Creates payment intent + order
6. **Success page** → Order confirmation with details

## Security Features

- **Protected routes**: Checkout requires authentication
- **JWT tokens**: Automatically included in API requests
- **Stripe Elements**: Secure card input handling
- **Server-side validation**: Backend validates all data

## Error Handling

- **Network errors**: Toast notifications for API failures
- **Validation errors**: Form validation with user feedback
- **Payment errors**: Stripe error handling
- **Authentication**: Automatic redirect to login if unauthorized

## Testing

1. **Use test card numbers** from Stripe documentation
2. **Test different delivery methods** to ensure cost calculation
3. **Verify order creation** in your backend database
4. **Check payment intents** in Stripe dashboard

## Troubleshooting

### Common Issues

1. **Stripe not loading**: Check your publishable key
2. **API errors**: Verify backend is running and accessible
3. **Authentication errors**: Check JWT token in localStorage
4. **CORS issues**: Ensure backend allows requests from frontend

### Debug Steps

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Confirm Stripe key is correct
4. Check authentication token is valid

## Dependencies

The following packages are required and already installed:

- `@stripe/stripe-js` - Stripe JavaScript SDK
- `@stripe/react-stripe-js` - React components for Stripe
- `axios` - HTTP client for API calls
- `react-hot-toast` - Toast notifications
- `zustand` - State management

## Next Steps

After setup, you can:

1. **Customize the UI** - Modify colors, layout, and styling
2. **Add more payment methods** - Integrate additional Stripe payment options
3. **Email notifications** - Send order confirmations via your backend
4. **Order tracking** - Add shipment tracking functionality
5. **Analytics** - Track checkout conversion rates

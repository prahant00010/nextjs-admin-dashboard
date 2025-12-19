Kaka Kaka engineering easiest# Admin Dashboard - Next.js Application

A modern, responsive admin dashboard built with Next.js, Material-UI (MUI), Zustand, and NextAuth. This application provides user and product management features with authentication, pagination, search, and filtering capabilities.

## Features

### Authentication
- ✅ Secure login using NextAuth with DummyJSON API
- ✅ Protected routes for authenticated users only
- ✅ Session management with JWT tokens
- ✅ Zustand state management for auth state

### Users Management
- ✅ Users list with pagination
- ✅ Search functionality (by name, email, username)
- ✅ Responsive table/card layout
- ✅ Detailed user view with comprehensive information
- ✅ Displays: name, email, gender, phone, company

### Products Management
- ✅ Products list with pagination
- ✅ Search functionality
- ✅ Category filtering
- ✅ Responsive grid layout
- ✅ Detailed product view with image carousel
- ✅ Displays: image, title, price, category, rating, reviews

### Performance Optimizations
- ✅ React.memo for component memoization
- ✅ useCallback and useMemo hooks to prevent unnecessary re-renders
- ✅ Client-side caching (5-minute cache duration)
- ✅ API-side pagination (not loading all data at once)

### UI/UX
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Material-UI components throughout
- ✅ Clean, modern interface
- ✅ Loading states and error handling
- ✅ Smooth navigation and transitions

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI component library
- **Zustand** - Lightweight state management
- **NextAuth** - Authentication library
- **DummyJSON API** - Backend data source

## Why Zustand?

Zustand was chosen for state management because:

1. **Simplicity**: Minimal boilerplate compared to Redux - no actions, reducers, or providers needed
2. **Small footprint**: ~1KB gzipped vs Redux's larger bundle size
3. **Built-in async actions**: No need for middleware like Redux Thunk - async actions work out of the box
4. **Better for small-medium apps**: Less overhead, easier to maintain, faster development
5. **TypeScript support**: Excellent type inference out of the box
6. **No provider needed**: Can be used anywhere without wrapping components in providers
7. **Persistence**: Built-in middleware for localStorage persistence

## Caching Strategy

The application implements client-side caching to improve performance:

- **Cache Duration**: 5 minutes (300,000ms)
- **Cache Key**: Combination of search query, category, skip, and limit parameters
- **Storage**: In-memory Map structure within Zustand stores
- **Benefits**: 
  - Reduces API calls
  - Improves response time
  - Better user experience
  - Reduces server load
- **Trade-off**: Slightly stale data (acceptable for this use case)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-app-nxt
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

**Note**: For production, use a strong, randomly generated secret. You can generate one using:
```bash
openssl rand -base64 32
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Login with test credentials:
   - **Username**: `emilys`
   - **Password**: `emilyspass`

   Or use any valid DummyJSON user credentials. You can get user credentials from the users API endpoint.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
my-app-nxt/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts          # NextAuth configuration
│   │   ├── dashboard/
│   │   │   ├── page.tsx                  # Dashboard home
│   │   │   ├── users/
│   │   │   │   ├── page.tsx              # Users list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # User detail
│   │   │   └── products/
│   │   │       ├── page.tsx               # Products list
│   │   │       └── [id]/
│   │   │           └── page.tsx          # Product detail
│   │   ├── login/
│   │   │   └── page.tsx                  # Login page
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home (redirects to login)
│   │   └── providers.tsx                 # MUI & NextAuth providers
│   ├── components/
│   │   ├── DashboardLayout.tsx           # Dashboard layout with sidebar
│   │   └── ProtectedRoute.tsx            # Route protection component
│   ├── store/
│   │   ├── authStore.ts                  # Authentication state
│   │   ├── usersStore.ts                 # Users data state
│   │   └── productsStore.ts              # Products data state
│   └── types/
│       └── index.ts                      # TypeScript type definitions
├── .env.local                            # Environment variables (create this)
├── package.json
└── README.md
```

## API Endpoints Used

All data comes from [DummyJSON API](https://dummyjson.com/):

### Authentication
- `POST https://dummyjson.com/auth/login` - User login
- `GET https://dummyjson.com/auth/me` - Get current user (with token)

### Users
- `GET https://dummyjson.com/users?limit=10&skip=0` - List users
- `GET https://dummyjson.com/users/search?q=...` - Search users
- `GET https://dummyjson.com/users/{id}` - Get user by ID

### Products
- `GET https://dummyjson.com/products?limit=10&skip=0` - List products
- `GET https://dummyjson.com/products/search?q=...` - Search products
- `GET https://dummyjson.com/products/category/{category}` - Filter by category
- `GET https://dummyjson.com/products/{id}` - Get product by ID

## Performance Optimizations Implemented

1. **React.memo**: Used for `UserRow` and `ProductCard` components to prevent unnecessary re-renders
2. **useCallback**: Used for event handlers to maintain referential equality
3. **useMemo**: Used for calculated values like total pages and category lists
4. **Client-side caching**: 5-minute cache for API responses
5. **API-side pagination**: Only loads data for current page, not all data at once
6. **Debounced search**: 500ms debounce to reduce API calls during typing

## Responsive Design

The application is fully responsive and works on:
- **Mobile**: < 600px (single column, mobile drawer)
- **Tablet**: 600px - 960px (2-3 columns)
- **Desktop**: > 960px (full layout with sidebar)

## Environment Variables

Create a `.env.local` file with:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

For production, ensure `NEXTAUTH_URL` points to your production domain.

## Known Limitations

- Cache duration is fixed at 5 minutes (could be made configurable)
- No refresh token mechanism (sessions expire on browser close)
- Search debounce is fixed at 500ms (could be made configurable)

## Future Enhancements

- [ ] Add refresh token support
- [ ] Implement infinite scroll as an alternative to pagination
- [ ] Add export functionality (CSV, PDF)
- [ ] Add bulk operations for users/products
- [ ] Implement advanced filtering options
- [ ] Add dark mode support
- [ ] Add unit and integration tests

## License

This project is created for assessment purposes.

## Author

Built as part of a technical assessment demonstrating:
- Next.js App Router expertise
- State management with Zustand
- Material-UI component usage
- API integration
- Performance optimization
- Responsive design
- Clean code architecture

---

**Note**: This application uses the public DummyJSON API for demonstration purposes. In a production environment, you would replace this with your own backend API.

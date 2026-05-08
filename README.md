# NIORA Frontend (React + Vite)

The customer storefront and owner admin console for NIORA — *Detailing your outfits.*

Built with **React 18, Vite, React Router, Framer Motion, Axios, and Lucide icons**. Pure CSS — no Tailwind. Editorial luxury aesthetic in emerald + cream.

## Features

### Customer side (no login)
- Editorial **homepage** with hero, magazine-style gallery, marquee, featured products, philosophy split, and "Services Coming Soon" teaser
- **Collection** page with category filters, sort, search
- **Product detail** with size/color selection, quantity stepper, related products
- **Cart drawer** with quantity controls, persistent localStorage
- **Checkout → WhatsApp**: customer fills name + phone, order is saved to backend AND WhatsApp opens prefilled with the full order to **+91 9495959099**
- **Contact page** that sends enquiries to the backend
- **About** and **Services (Coming Soon)** pages
- Smooth Framer Motion page transitions and scroll reveals

### Owner side (`/admin`, login required)
- **Dashboard** with stats (products, orders, enquiries, revenue) + recent activity
- **Products**: full CRUD, image upload, stock +/- buttons, featured toggle, category quick-add
- **Orders**: filter by status, view full order with items, change status, one-click reply on WhatsApp
- **Enquiries**: filter, view full message, mark read/responded/closed, reply on WhatsApp or email
- Token auth (stored in localStorage)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment
cp .env.example .env
# edit VITE_API_BASE_URL if your backend isn't at http://127.0.0.1:8000

# 3. Make sure the Django backend is running on port 8000
# (see ../niora-backend/README.md)

# 4. Start the dev server
npm run dev
```

Open http://localhost:5173.

## Logging in as the owner

1. Visit http://localhost:5173/admin/login
2. Default credentials (from `seed_demo` in the backend): **`admin`** / **`niora123`**
3. Change the password via Django admin (`/admin/` on the backend) for production.

## Build for production

```bash
npm run build
# outputs static files to ./dist
```

Serve `dist/` from any static host (Netlify, Vercel, S3+CloudFront, nginx). Make sure `VITE_API_BASE_URL` points at your deployed backend.

## Project structure

```
src/
├── App.jsx                  # routes
├── main.jsx                 # entry point + providers
├── components/
│   ├── Navbar.jsx           # editorial sticky nav
│   ├── Footer.jsx
│   ├── CartDrawer.jsx       # cart + WhatsApp checkout
│   ├── ProductCard.jsx
│   ├── AdminShell.jsx       # owner dashboard layout
│   ├── ProtectedRoute.jsx
│   └── Toast.jsx
├── context/
│   ├── AuthContext.jsx      # owner auth + token
│   └── CartContext.jsx      # cart state + persistence
├── pages/
│   ├── Home.jsx
│   ├── Collection.jsx
│   ├── ProductDetail.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Contact.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminOrders.jsx
│       └── AdminEnquiries.jsx
├── services/
│   └── api.js               # all backend calls in one place
├── styles/
│   └── global.css           # design system + base styles
└── assets/                  # NIORA logos
```

## Notes

- Customers do **not** sign up or log in. They browse → add to cart → submit details → WhatsApp opens.
- The cart persists in `localStorage` so a refresh doesn't lose the bag.
- All currency is rendered as `INR` via `Intl.NumberFormat('en-IN')`.
- Image uploads go through `multipart/form-data`; you can also paste a URL on the product form.
- The owner WhatsApp number is set in `.env` and in `services/api.js`.

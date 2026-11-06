# BookNook

**Live Site:** https://booknook-client-livid.vercel.app

BookNook is a small online library where readers can add a book, borrow a book and return it when they are done.

## Features

- Email and password login with BetterAuth, plus Google login
- Password validation on registration (uppercase, lowercase, minimum 6 characters)
- Add, view, update and delete books with image upload to imgbb
- Borrow system with copies tracking and no double borrowing
- Private routes that stay logged in on reload and redirect back after login
- JWT protected API routes on the Express server
- Swiper.js hero slider and dynamic New Arrivals from MongoDB
- Responsive design with toast messages and a custom 404 page

## Tech Stack

Next.js (App Router), Tailwind CSS, DaisyUI, BetterAuth, Express.js, MongoDB, JWT, Swiper.js, Framer Motion

## Run Locally

1. Run `npm install`
2. Create a `.env.local` file with MONGODB_URI, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_API_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and NEXT_PUBLIC_IMGBB_KEY
3. Run `npm run dev`
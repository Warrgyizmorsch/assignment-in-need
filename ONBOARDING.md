# Project Documentation (Assignment In Need)

Welcome to the **Assignment In Need** project documentation. This document outlines the project architecture, tech stack, and local development setup.

---

## 1. Project Overview

This is a modern web application built for **Assignment In Need**, serving as a full-stack platform where users can explore academic writing services, check out writers, view city-specific or subject-specific pages, read blogs, and place orders.

### **Tech Stack**
- **Framework**: [Next.js (App Router)](https://nextjs.org/) - Version 16+
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components & Icons**: Radix UI, Lucide React, Framer Motion (for animations), Swiper (for carousels)
- **Notifications**: React Hot Toast

---

## 2. Folder Structure

The project follows a standard Next.js App Router architecture. The core application logic resides inside the `src/` directory.

```text
assignment-in-need/
│
├── public/                 # Static assets (images, fonts, icons)
│
├── src/
│   ├── app/                # Next.js App Router (Pages & API routes)
│   │   ├── (auth)/         # Authentication routes (Login, Register)
│   │   ├── about/          # About Us page
│   │   ├── blog/           # Blog pages
│   │   ├── cities/         # City-specific landing pages
│   │   ├── order/          # Order placement flow
│   │   ├── profile/        # User profile
│   │   ├── service/        # Services offered
│   │   ├── subjects/       # Subject-specific pages
│   │   ├── writers/        # Expert writers profiles
│   │   ├── globals.css     # Global styles & Tailwind directives
│   │   ├── layout.tsx      # Root layout (Navbar, Footer)
│   │   └── page.tsx        # Main Homepage
│   │
│   ├── components/         # Reusable UI Components
│   │   ├── auth/           # Login/Signup forms
│   │   ├── city/           # City page specific components
│   │   ├── common/         # Generic elements (Buttons, Inputs, Modals)
│   │   ├── home/           # Sections of the homepage
│   │   ├── layout/         # Structural components (Navbar, Footer, Sidebar)
│   │   └── ui/             # Reusable UI elements (cards, badges, etc.)
│   │
│   └── lib/                # Utility functions, API helpers, and constants
│
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS theme and styling rules
└── package.json            # Project dependencies and scripts
```

---

## 💻 3. Local Development Setup

Follow these steps to set up and run the project locally.

### **Prerequisites**
- [Node.js](https://nodejs.org/) (version 20+ recommended).

### **Step 1: Install Dependencies**
Execute the following command in the project root:
```bash
npm install
npm i 
```

### **Step 2: Run the Development Server**
Start the local development server:
```bash
npm run dev
```
The application will be accessible at: **http://localhost:3000**

---

## 4. Architecture & Development Guidelines

### **Routing (App Router)**
Routing is managed via the Next.js **App Router**, which is folder-based.
- To create a new page at `/contact-us`, create a directory `src/app/contact-us/` and add a `page.tsx` file inside it.
- **Dynamic Routes:** Folders enclosed in brackets like `[id]` (e.g., `src/app/blog/[slug]/page.tsx`) define dynamic routes (e.g., individual blog posts).

### **Styling**
The project uses **Tailwind CSS** for styling. Utilize utility classes directly in `.tsx` files.
```tsx
// Example of Tailwind classes
<div className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg">
  Content
</div>
```
Global styles and configuration are maintained in `tailwind.config.ts` and `src/app/globals.css`.

### **Components**
Promote reusability by creating shared components. For instance, a generic button should reside in `src/components/common/Button.tsx` and be imported as needed.

### **SEO & Sitemaps**
Search Engine Optimization (SEO) is a core aspect of the project. Various `sitemap.xml` folders exist within `src/app/` to dynamically generate sitemaps for cities, writers, subjects, and blogs, facilitating search engine indexing.

---

## 5. Common Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the project for production deployment.
- `npm start` - Starts the production server (requires a prior build).
- `npm run lint` - Runs ESLint for code quality checks.

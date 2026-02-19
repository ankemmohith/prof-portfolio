# Prof. Navrati Saxena — Portfolio

A personal academic portfolio built with **React + Vite**. It includes a light/dark theme toggle, role-based authentication (admin / user), and editable portfolio sections.

---

## Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org/) **v18 or higher** (comes with `npm`)
- A terminal (Command Prompt, PowerShell, bash, zsh, etc.)
- [Git](https://git-scm.com/) (to clone the repository)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ankemmohith/prof-portfolio.git
cd prof-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local development server with hot reload |
| `npm run build` | Builds the app for production into the `dist/` folder |
| `npm run preview` | Serves the production build locally for testing |
| `npm run lint` | Runs ESLint to check for code issues |

---

## Default Login Credentials

The app uses a localStorage-based auth system (no backend required). A default admin account is seeded automatically on first load:

| Field | Value |
|---|---|
| **Email** | `navrati.saxena@sjsu.edu` |
| **Password** | `navrati` |
| **Role** | `admin` |

> **Important:** Logging in as admin unlocks **Edit Mode**, which lets you update portfolio content directly in the browser. Changes are saved to localStorage.
>
> To change the default admin credentials, update the `SEED_ADMIN` object in [src/auth/AuthContext.jsx](src/auth/AuthContext.jsx).

---

## Project Structure

```
navrati-portfolio/
├── public/
│   └── images/          # Static images
├── src/
│   ├── App.jsx          # Main app — all portfolio sections + routing
│   ├── App.css          # Global styles
│   ├── index.css        # Base CSS / Tailwind entry
│   ├── main.jsx         # React entry point
│   ├── auth/
│   │   └── AuthContext.jsx   # Auth logic (login, signup, roles)
│   └── pages/
│       ├── Login.jsx    # Login page
│       └── Signup.jsx   # Signup page
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 7](https://vitejs.dev/)
- [React Router DOM v7](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

## Building for Production

```bash
npm run build
```

This generates a `dist/` folder. You can deploy its contents to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## Troubleshooting

**Port already in use**
Vite will automatically try the next available port. Check the terminal output for the actual URL.

**Blank page / styles missing**
Run `npm install` again to make sure all dependencies are present, then restart with `npm run dev`.

**Login not working after clearing browser data**
The admin account is re-seeded automatically on page reload — just refresh and try again.

**`node_modules` missing**
Always run `npm install` after cloning or pulling new changes.

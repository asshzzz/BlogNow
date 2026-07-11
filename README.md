# BlogNow

Stories worth your time — a full-stack blogging platform where users can write, publish, and manage posts, generate AI cover images, and read long-form stories from other writers.

## Features

- **Authentication** — email/password signup and login, with a persisted session
- **Blog CRUD** — create, edit, delete, and read blog posts
- **AI cover images** — generate a cover image for a post from a text prompt, or upload your own
- **Profile management** — view and edit your name and email
- **Category browsing** — filter posts by topic (Technology, Science, Entertainment, Art, Health, Lifestyle)
- **Admin dashboard** — role-gated admin view
- **Responsive UI** — usable across desktop and mobile, with a shared navbar and consistent design system across all pages

## Tech stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- lucide-react (icons)
- react-toastify (notifications)

**Backend**
- REST API hosted at `blognow-ckae.onrender.com`
- Token-based auth (Bearer token stored in `localStorage`)
- Image uploads served from `/uploads`

> The backend lives in a separate service/repo. This README covers the frontend.

## Project structure

```
src/
├── api.js                  # API client wrapper
├── context/
│   └── AuthContext.jsx     # auth state, login/signup/logout
├── assets/
│   └── logo.svg
├── components/
│   └── Navbar.jsx          # shared site navigation
└── pages/
    ├── Home.jsx             # landing page, featured + latest posts
    ├── Login.jsx
    ├── Signup.jsx
    ├── Profile.jsx
    ├── EditProfile.jsx
    ├── MyBlogs.jsx          # logged-in user's posts
    ├── CreateBlog.jsx       # new post + AI image generation
    ├── EditBlog.jsx
    ├── BlogDetail.jsx       # single post view
    ├── Contact.jsx
    ├── AdminDashboard.jsx
    └── NotFound.jsx
```

## Getting started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <your-repo-url>
cd frontend
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
VITE_API_URL=https://blognow-ckae.onrender.com
```

> Some pages currently call the backend URL directly instead of reading from an env variable. If you move the backend or run it locally, search the codebase for `blognow-ckae.onrender.com` and replace those calls with `import.meta.env.VITE_API_URL` for a single source of truth.

### Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
npm run preview
```

## Design system

All pages share one visual language:

| Token | Value |
|---|---|
| Background | `#FAFAF9` |
| Surface (cards) | `#FFFFFF` |
| Primary text | `#111827` |
| Secondary text | `#6B7280` |
| Border | `#E5E7EB` |
| Accent | `#4F46E5` |
| Danger | `#DC2626` |

- Cards use `1px` borders with a subtle `hover:shadow-md`, not gradients or glassmorphism
- Primary actions are solid dark buttons (`#111827` → `#1F2937` on hover)
- Form fields use a consistent border + indigo focus ring
- Icons are from `lucide-react` throughout

## Known limitations / possible improvements

- Backend base URL is hardcoded in several files instead of centralized in `api.js` or an env variable
- No automated tests yet
- No password reset flow

## Contributing

1. Fork the repo and create a feature branch
2. Keep new UI consistent with the design tokens above
3. Open a PR with a clear description of the change and why it was made

## License

Add your license here (e.g. MIT).

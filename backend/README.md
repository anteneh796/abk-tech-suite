ABK Technologies Backend

Development notes

- Run the server: `npm run dev`
- Copy `.env.example` to `.env` and fill in values (Mongo URI, JWT secrets, Cloudinary)

Auth endpoints

- POST /api/v1/auth/register - body: { name, email, password, role }
- POST /api/v1/auth/login - body: { email, password }
- POST /api/v1/auth/refresh - uses HTTPOnly cookie `refreshToken` (must send credentials)
- POST /api/v1/auth/logout - clears refresh cookie
- GET /api/v1/auth/me - requires Authorization: Bearer <accessToken>

---

Cloudinary & Image Compression

- Configure Cloudinary via `.env` (copy `.env.example` and set real values):
  - `CLOUDINARY_URL` (or CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME)
  - `CLOUDINARY_FOLDER` (default: `abk/services`)
  - `IMAGE_MAX_WIDTH` (default: `1600`)
  - `IMAGE_QUALITY` (default: `80`)

Notes

- Refresh token is stored as HTTPOnly cookie. When calling `/refresh` from the browser use `fetch('/api/v1/auth/refresh', { credentials: 'include', method: 'POST' })` so the cookie is sent.
- Access token is returned in response body; include it in `Authorization: Bearer <token>` when calling protected APIs.

# Tourism Platform Backend

## Setup
1. `npm install`
2. Create `.env` from `.env.example`
3. Start MongoDB
4. `npm run seed` to seed data
5. `npm start` or `npm run dev`

## API Documentation (Summary)
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Places: `/api/places` (GET, POST, PUT, DELETE)
- Hotels: `/api/hotels`
- Jeeps: `/api/jeeps`
- Reviews: `/api/reviews`
- Feedback: `/api/feedback`
- Lost & Found: `/api/lostfound`
- Admin: `/api/admin/users`

Check `server.js` for all route registrations.

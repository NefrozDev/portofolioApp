# Portfolio backend

Express API for portfolio data and contact-form delivery. Contact messages are
sent to the configured inbox through Resend; the API does not persist their
personal data.

## Local development

1. Copy `.env.example` to `.env` and provide real values.
2. Make the variables available to the process (or configure them in your IDE).
3. From the repository root, run `npm run start:back`.

The API is served at `http://localhost:3000/api`. `GET /api/health` can be used
as a health check.

## Deploy to Vercel

1. Import this repository as a new Vercel project.
2. Set **Root Directory** to `Backend` and keep Vercel's Express framework
   detection/build settings. The checked-in `vercel.json` also pins the
   framework to Express so Vercel does not expect a static `public` directory.
3. Keep **Include source files outside of the Root Directory in the Build Step**
   enabled because the API imports shared models and translations from `Common`.
4. Add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `ALLOWED_ORIGINS` in the
   project's environment variables. `CONTACT_TO_EMAIL` is optional and can
   override the default recipient, `demoorsteven@yahoo.com`.
5. Verify the sender domain in Resend and deploy.

`CONTACT_FROM_EMAIL` must use the verified sender domain. Set
`ALLOWED_ORIGINS` to the frontend origins allowed to call the API, separated by
commas (include preview origins only if you want previews to submit messages).

After deployment, replace `apiUrl` in
`portfolio/src/environments/environment.production.ts` with
`https://<backend-project>.vercel.app/api`, then deploy the frontend.

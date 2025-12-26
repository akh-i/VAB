<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Built with AI Studio

The fastest path from prompt to production with Gemini.

View your app in AI Studio: https://ai.studio/apps/drive/1Ail2yr3QFK9xUFaNvC8SUsb_vf-KOdPF

---

## Run and deploy your AI Studio app

This repository contains everything you need to run your app locally and get it ready for deployment.

---

## Run locally

**Prerequisites:**
- **Node.js:** Install the latest LTS version
- **Gemini API key:** Create one in your AI Studio account

**Steps:**
1. **Install dependencies:**
   - `npm install`
2. **Configure environment:**
   - **Create:** `.env.local` in the project root
   - **Set:** `GEMINI_API_KEY=<your_api_key_here>`
3. **Start the dev server:**
   - `npm run dev`
4. **Open the app:**
   - **URL:** http://localhost:3000 (or the port shown in your terminal)

---

## Environment variables

- **`GEMINI_API_KEY`:** Your Gemini API key used to authenticate requests.

Tip: Do not commit `.env.local`. Ensure it’s in `.gitignore`.

---

## Project structure

- **`components/`**: Reusable UI components (e.g., `ComparisonTable.tsx`)
- **`pages/` or `app/`**: Route entry points depending on your Next.js setup
- **`lib/`**: Client utilities and API helpers
- **`.env.local`**: Local environment config (not checked in)

---

## Deployment

- **Build:** `npm run build`
- **Preview:** `npm run start`
- **Host options:** Vercel, Netlify, or your preferred Node host
  - **Set env:** Add `GEMINI_API_KEY` in your hosting provider’s environment settings
  - **Redeploy:** Trigger a build after updating environment variables

---

## Troubleshooting

- **Missing API key:** Ensure `GEMINI_API_KEY` is set in `.env.local` and available in your runtime.
- **Dev server port in use:** Change the port or stop the conflicting process.
- **Network errors:** Check that your API key is valid and your host allows outbound requests.

---

<a href="https://aistudio.google.com/apps">Start building</a>

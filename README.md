<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# H.R. Helper - Lucky Draw & Team Grouper

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1DPyUhWsrR8dZDkIT4AfUbBnBs9C32Zfs

## Run Locally

**Prerequisites:**  Node.js v20+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.example` to `.env` or `.env.local`:
     ```bash
     cp .env.example .env
     ```
   - Set the `GEMINI_API_KEY` in your `.env` file.

3. **Run the app:**
   ```bash
   npm run dev
   ```

## Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.


### Setup for Deployment

1. **Push to GitHub:**
   Ensure your code is pushed to a GitHub repository.

2. **Configure Secrets:**
   - Go to your repository **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Name: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key.

3. **Enable GitHub Pages:**
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, select **GitHub Actions** as the source.

4. **Trigger Deployment:**
   - Push to the `main` branch to trigger the deployment workflow automatically.
   - Or go to the **Actions** tab, select **Deploy to GitHub Pages**, and run the workflow manually.

## Files Structure

- `.github/workflows`: Contains the CI/CD pipeline configuration.
- `src`: Source code files (if structure moved to stricter vite structure, but currently flatter).
- `package.json`: Dependencies and scripts.
- `.gitignore`: Files excluded from version control.

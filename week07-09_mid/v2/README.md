# ResumeAI (Midterm v2)

**ResumeAI** is an intelligent resume builder powered by OpenAI and Next.js. It allows users to generate, customize, and export professional resumes with AI assistance.

## 🚀 Features

*   **AI-Powered Content:** Generate professional summaries and bullet points using OpenAI's GPT models.
*   **Real-time Preview:** See changes instantly as you edit your resume.
*   **PDF Export:** Download high-quality PDFs using `@react-pdf/renderer`.
*   **Authentication:** Secure user accounts via Supabase Auth (Email, Google, GitHub).
*   **Dashboard:** Manage multiple resumes and track their status.
*   **Responsive Design:** Built with Tailwind CSS for a seamless mobile and desktop experience.

## 🛠 Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Database & Auth:** Supabase
*   **AI Integration:** OpenAI API
*   **PDF Generation:** @react-pdf/renderer, html2canvas, jspdf
*   **State Management:** React Hook Form, Zod

## 📦 Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env.local` file and add your keys (see `SETUP_SUPABASE.md` for details):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    OPENAI_API_KEY=your_openai_key
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Open App:**
    Navigate to `http://localhost:3000`.

## 📂 Project Structure

*   `app/`: Next.js App Router pages and layouts.
*   `components/`: Reusable UI components (Builder, Dashboard, etc.).
*   `lib/`: Utility functions and Supabase client.
*   `auth/`: Authentication logic.

## 📝 Notes
This is the **v2** iteration of the midterm project, focusing on full-stack integration and AI features. For the static/prototype version, see `v1`.

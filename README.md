🛒 Bazar Dor — বাজার দর

Bazar Dor is a responsive web application designed to help users explore essential daily products and check market prices in Bangladesh.

Users can browse product categories, view product details, check price changes, create an account, sign in, and manage their profile information.

🌐 Live Website

- Live Demo: [Add Your Vercel Deployment URL]
- GitHub Repository: https://github.com/mahbubur75/Assignment-7-mn

📖 About the Project

Bazar Dor makes it easier for users to explore the market prices of everyday essentials through a clean and user-friendly interface.

The application provides product listings, category-based browsing, product details, user authentication, and profile management. It is designed to work across mobile phones, tablets, and desktop devices.

🛠️ Technologies Used

- Next.js — React framework for web applications
- React — Building interactive user interfaces
- TypeScript — Type-safe JavaScript development
- Tailwind CSS — Utility-first styling
- DaisyUI — UI components
- Better Auth — User authentication
- MongoDB — Database
- React Hot Toast — User notifications
- Git & GitHub — Version control
- Vercel — Deployment and hosting

✨ Key Features

1. Responsive Design: Supports mobile, tablet, and desktop screens.
2. Product Listing: Displays available products with their names, prices, and categories.
3. Product Categories: Browse products by category.
4. Product Details: View additional information about individual products.
5. User Registration: Create an account using name, email, and password.
6. User Sign In: Authenticate with email and password.
7. Protected Product Details: Restricts product-detail access according to authentication requirements.
8. Profile Management: Update supported account information.
9. Price Change Information: Displays price increases or decreases when the API provides the required data.
10. Toast Notifications: Provides feedback for supported actions.
11. Shared Navbar: Provides consistent navigation across pages.
12. Shared Footer: Displays useful links and category shortcuts across pages.

📂 Project Structure

assignment-7-mn/
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   ├── update/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── Banner.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── Products.tsx
│   │
│   └── lib/
│       ├── auth-client.ts
│       └── auth.ts
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

Note: This structure represents the main project files. The actual files inside "src/app/api/" and "public/" may differ. Update this section if your project structure changes.

⚙️ Installation and Setup

Prerequisites

- Node.js
- npm
- A MongoDB database

1. Clone the repository

git clone https://github.com/mahbubur75/Assignment-7-mn.git

2. Navigate to the project folder

cd assignment-7-mn

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env" file in the project root and configure the variables required by your application.

Example:

MONGODB_URL=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secure_auth_secret
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

Replace the example values with your actual configuration. Set production environment variables in Vercel as well.

Security: Never commit ".env" files, database credentials, or authentication secrets to GitHub.

5. Start the development server

npm run dev

Open "http://localhost:3000" (http://localhost:3000) in your browser.

6. Build the project

npm run build

🔐 Authentication

The application uses Better Auth for email-and-password authentication.

Users can register, sign in, sign out, and access supported profile-management features. Access to protected pages follows the application's authentication rules.

🚀 Deployment

The project is hosted on Vercel.

To publish updates:

1. Commit your changes using Git.
2. Push the changes to GitHub.
3. Check the latest deployment in the Vercel dashboard.
4. Open the live website and verify that the changes work correctly.

👨‍💻 Author

Mahbubur Rahman Munna

- GitHub: https://github.com/mahbubur75

📄 License

This project was developed for educational purposes as part of Assignment-7.
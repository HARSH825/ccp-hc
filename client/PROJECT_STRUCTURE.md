# Credit Card Statement Parser - Frontend

A clean and modern React frontend for parsing credit card statements, built with Vite, React, Tailwind CSS v4.1, and DaisyUI.

## Features

- 📄 PDF file upload with validation
- 🎨 Light/Dark theme toggle
- 📊 Clean table display for extracted data
- 📱 Fully responsive design
- ⚡ Built with Vite for fast development

## Tech Stack

- **React 19** (JavaScript)
- **Vite 7** - Build tool
- **Tailwind CSS v4.1** - Utility-first CSS
- **DaisyUI 5** - Component library

## Project Structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Main app component with state management
├── index.css                # Tailwind CSS v4.1 imports
├── App.css                  # Custom styles (minimal)
└── components/
    ├── Navbar.jsx          # App header with theme toggle
    ├── UploadCard.jsx      # File upload interface
    └── ResultTable.jsx     # Results display table
```

## Components

### Navbar.jsx

- Fixed navbar at the top
- App title display
- Theme toggle (light/dark mode)
- Persists theme selection

### UploadCard.jsx

- PDF file upload input
- File name preview
- Validation (PDF only)
- Parse button (disabled until file selected)
- Clean card design

### ResultTable.jsx

- Displays extracted statement data
- Columns: Card Type, Last 4 Digits, Statement Period, Due Date, Total Due
- Zebra striping for readability
- Responsive table with horizontal scroll on mobile

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Usage

1. Click "Choose PDF file" to select a credit card statement (PDF only)
2. Selected file name will be displayed
3. Click "Parse Statement" to process (currently shows mock data)
4. View extracted data in the table below
5. Toggle theme using the sun/moon icon in the navbar

## Mock Data

The app currently displays mock data for demonstration:

- 3 sample credit card statements
- Various card types (Visa, Mastercard, Amex)
- Statement periods, due dates, and amounts

## Tailwind CSS v4.1 Setup

The project uses the latest Tailwind CSS v4.1 syntax:

**index.css:**

```css
@import "tailwindcss";
@plugin "daisyui";
```

**vite.config.js:**

```javascript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

No legacy `tailwind.config.js` file is needed!

## DaisyUI Theme

Uses DaisyUI's default theme with no customization. Theme switching is handled via `data-theme` attribute on the document root.

## Next Steps

To integrate with a backend:

1. Replace mock data in `App.jsx` with API calls
2. Add error handling for failed uploads
3. Add loading states during processing
4. Implement actual PDF parsing logic in backend

## License

MIT

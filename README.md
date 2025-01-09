# Document QA App

A modern web application built with React and Vite for document analysis and question-answering capabilities.

## Features

- Document upload and processing
- Interactive UI with modern design
- File drag-and-drop support
- Data visualization using Recharts
- Responsive layout with Tailwind CSS

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (version 16 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd document-qa-app
```

2. Install dependencies:
```bash
npm install
```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start the development server, typically at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be available in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `/src` - Source code directory
- `/public` - Static assets
- `/dist` - Production build output
- `index.html` - Entry HTML file
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Dropzone
- XLSX for spreadsheet processing
- Recharts for data visualization
- Lucide React for icons

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the LICENSE file for details.

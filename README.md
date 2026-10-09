# The Akashic Herbalist — Frontend

A React frontend for **The Akashic Herbalist**, a MERN application for exploring traditional herbal knowledge, saving favorite herbs, organizing herbs into collections, and maintaining a personal herbal journal.

## Description

The Akashic Herbalist is an interactive herbal knowledge application designed to make traditional plant information easier to explore and organize.

Users can browse and search herbs, filter results by traditional usage and geographic region, view detailed herb information, save favorites, create custom collections, and maintain personal journal entries. Authenticated features are protected through JWT-based authentication.

The frontend communicates with a RESTful Express backend and provides a responsive interface built around a botanical and ethereal visual design.

## Getting Started

### Dependencies

* Windows 10 or later
* Node.js
* npm
* React
* React Router
* Vite
* The Akashic Herbalist backend

### Installing

Clone the frontend repository and navigate into the project directory:

```bash
git clone <your-frontend-repository-url>
cd TheAkashicHerbalist_FRONTEND
```

Install the required dependencies:

```bash
npm install
```

### Executing program

Start the development server:

```bash
npm run dev
```

The frontend runs using the Vite development server.

The application communicates with the backend API at:

```
http://localhost:8888
```

Make sure the backend server is running before using features that require API data.

## Features

* Browse and search herbs
* Alphabetical herb sorting
* Filter herbs by:

  * Traditional usage
  * Continent
  * Country
* View detailed herb information
* User registration and login
* JWT authentication
* User profile management
* Save and remove favorite herbs
* Create and manage custom herb collections
* Create, edit, and delete journal entries
* Public/private journal entries
* Reusable navigation and UI components
* Loading and error states

## Main Pages

* **Home** — Browse and discover herbs
* **Login** — Authenticate existing users
* **Register** — Create an account
* **Profile** — View and edit user information
* **Favorites** — Manage saved herbs
* **Collections** — Organize herbs into custom collections
* **Journal** — Create and manage personal journal entries
* **Herb Details** — View detailed information about individual herbs

## API Integration

The frontend communicates with the Express backend through reusable service functions.

Current API integrations include:

* Authentication
* User profiles
* Herbs
* Favorites
* Collections
* Journal entries

Protected requests use the authenticated user's JWT.

## Project Structure

```
src/
├── components/     Reusable UI components
├── context/        Authentication context
├── pages/          Application pages
├── services/       API service functions
├── styles/         Application styling
├── App.jsx         Application routing
└── main.jsx        React entry point
```

## Design

The interface follows a botanical and ethereal visual direction inspired by the concept of an **Akashic herbal archive**.

The design uses:

* Soft cream and ivory backgrounds
* Sage and forest green accents
* Rounded cards and subtle borders
* Clean typography
* Reusable navigation
* Responsive layouts

## Help

If the application is not displaying herb data or user information:

1. Make sure the backend server is running.
2. Make sure the backend is running on port `8888`.
3. Refresh the frontend after starting the backend.
4. Check the browser console for errors.

To restart the development server:

```bash
npm run dev
```

## Authors

**Onayah Thompson**

Per Scholas Software Engineering Capstone Project

## Version History

* **0.2**

  * Added authentication and user profiles
  * Added herb search, sorting, and filtering
  * Added favorites and collections
  * Added journal CRUD functionality
  * Added reusable navigation and application components
  * Added herb detail views

* **0.1**

  * Initial React frontend setup
  * Added application routing
  * Added initial herb browsing functionality

## License

This project was created for educational purposes as part of the Per Scholas software engineering capstone program.

## Acknowledgments

* **Per Scholas** — Software engineering curriculum and capstone guidance
* **IMPPAT** — Traditional therapeutic-use plant data
* **Trefle** — Botanical data and plant imagery
* **React** — Frontend framework
* **Vite** — Development and build tooling
* **MongoDB / Express / Mongoose** — Backend technologies supporting the application

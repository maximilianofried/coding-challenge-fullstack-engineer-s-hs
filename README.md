# Rick and Morty Character Explorer

## Overview

This project is a web application that interacts with the Rick and Morty GraphQL API to display character information. The application allows users to log in, view character details, expand character cards to see recent episodes, and mark characters as favorites.

## Features

1. **Login Screen**

   - Users can log in with a username.
   - If the username does not exist, a new user is created.
   - If the username exists, the user's data is retrieved.
   - Includes a logout button that returns the user to the login screen.
   - User sessions are preserved across page reloads until logout.

2. **Character List**

   - Displays a list of character cards with the following details:
     - Image
     - Name
     - Species
     - Gender
     - Origin
     - Dimension
     - Status
   - Initially shows characters from the 1st page of the API.

3. **Expandable Character Cards**

   - Each card has a "more" button to expand the card.
   - Expanding a card shows the 3 latest episodes sorted from most recent to oldest.
   - The "more" button changes to "less" when expanded, and vice versa.

4. **Favorite Characters**

   - Each card has a "favorite" button to mark/unmark characters as favorites.
   - A "Display favorites" button toggles between showing all characters and only favorites.
   - Favorite characters are preserved across page reloads and per user.

5. **Data Fetching and Caching**
   - The server fetches data from the Rick and Morty API and caches it in a local database.
   - Cached data expires and is refreshed from the API periodically to reduce API calls.

## Technologies Used

- **Frontend**: React, Apollo Client
- **Backend**: Node.js, Apollo Server, Express, MongoDB
- **Styling**: CSS

## Running the Project Locally

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Steps

1. **Clone the repository**:

- git clone https://github.com/maximilianofried/coding-challenge-fullstack-engineer-s-hs.git
- cd coding-challenge-fullstack-engineer-s-hs

2. **Install dependencies**:

- To install dependencies in the frontend run "npm install" in root folder
- To install dependencies in the backend navigate to server folder with "cd server" and run "npm install"

3. **Set up environment variables**:

- For the sake of the example and since there is no sensitive data, the `.env` files are provided in the repository.

4. **Start the backend server**:

- "cd server" and "npm run dev"

5. **Start the frontend development server**:

- In root folder run "npm run start"

6. **Open the application in your browser**:

- http://localhost:3000

## Running the Project with Docker

### Prerequisites

- Docker and Docker Compose installed

1. **Clone the repository**:

- git clone https://github.com/maximilianofried/coding-challenge-fullstack-engineer-s-hs.git
- cd coding-challenge-fullstack-engineer-s-hs

2. **Build and run the Docker containers**:

- docker-compose up --build

3. **Open the application in your browser**:

- http://localhost:3000

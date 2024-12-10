Running the project with Docker

- Clone the git repository

    git clone https://github.com/vyom-nci/Support-Ticket-System.git

- Starting the Application

    docker-compose up --build

- Frontend - http://localhost:3001

- Backend - http://localhost:3000


Running the Application without Docker

- Clone the git repository

    git clone https://github.com/vyom-nci/Support-Ticket-System.git

- cd backend
- npm install
- npm run start
    Backend starts running at http://localhost:3000

- cd frontend
- npm install
- npm start (Press "y" for running at port 3001)
    Frontend starts running at http://localhost:3001

- Ensure that mongodb is installed and running locally.
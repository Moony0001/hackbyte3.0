# hackbyte3.0
this one for the win


# HackByte 3.0 - Centralized Bug Archive

## Tagline
A centralized bug archive where companies can share documented bugs and solutions. A bridge between proprietary and open-source, empowering startups to learn from the challenges and fixes of larger tech companies without revealing their own codebases.

---

## Project Description
In today's digital world, every company is amassing vast, complex codebases that expand exponentially over time. But so do their bugs. This bug infestation (pun intended) is a universal problem, plaguing every codebase. Developers in various companies often encounter remarkably similar problems, yet the solutions remain locked behind corporate walls. There is a lot of internal documentation for every bug that an employee of a company solves, but it’s of no use to the dev community as a whole.

This is where our project comes in. Any developer across the entire world can access our database of issues solved by the best minds of the industry, passing through various filters of company development practices and rigorous code reviews. We provide our own custom-built bug tracking system to ensure a seamless flow from internal documentation to the public archive. 

Our platform offers:
- **Basic Bug Tracking System**: All the essential functionalities of a bug tracking system.
- **Custom ML Model**: Automatically triages bugs for prioritization.
- **RAG Model**: Enables similarity search and search optimizations for efficient bug discovery.

Unlike generic Q&A platforms like Stack Overflow, our platform offers a stamp of authenticity, as every solution is directly contributed by developers from major companies. This authenticity builds trust and provides junior developers with access to proven practices and strategies. At the same time, it enables proprietary companies to earn goodwill and position themselves as leaders in the tech community. By opening a channel for collaboration between proprietary organizations and the wider developer community, we are breaking down traditional information silos and breaking through the red tape.

---

## Features
- **Centralized Bug Archive**: Access a global database of documented bugs and their solutions.
- **Custom Bug Tracking System**: Manage bugs with ease using our intuitive interface.
- **Machine Learning Integration**: Automatically triage bugs based on priority and severity.
- **Similarity Search**: Find related bugs and solutions using advanced search optimizations.
- **Developer Collaboration**: Bridge the gap between proprietary organizations and the open-source community.

---

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT-based authentication
- **Machine Learning**: Custom ML and RAG models for bug triaging and similarity search

---

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account for database setup

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hackbyte3.0.git
   cd hackbyte3.0

Install dependencies:

npm install

Set up environment variables: Create a .env file in the root directory and add the following:

SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
JWT_SECRET=<your-jwt-secret>

Start the development server:

npm run dev

Access the application at http://localhost:3000.

API Endpoints
/api/project/all
Method: GET
Description: Fetches all projects associated with the logged-in user.
Headers:
Cookie: Contains the JWT token for authentication.
Response:
200 OK: Returns a list of projects with details like name, manager, role, and bug count.
401 Unauthorized: If the JWT token is missing or invalid.
404 Not Found: If the user is not found in the database.


Folder Structure

hackbyte3.0/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── project/
│   │   │       └── all/
│   │   │           └── [route.js](http://_vscodecontentref_/0)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── UserContext.js
│   │   └── ...
│   └── ...
├── .env
├── [README.md](http://_vscodecontentref_/1)
└── ...


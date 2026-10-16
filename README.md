# QuickNotes System Design

QuickNotes is a full-stack system design project demonstrating an interactive frontend API client paired with comprehensive production backend documentation designed to scale to 1 million users.

## Project Structure
quicknotes-system-design/
├── index.html          # Web interface for API interactions
├── style.css           # Custom styles with success/error states
├── api.js              # Fetch wrapper and DOM logic
├── docs/
│   ├── api-design.md   # REST API specification & error codes
│   ├── data-model.md   # Relational schema, DDL, SQL queries & indexing
│   └── architecture.md # System architecture, estimations & request flows
└── README.md           # Project documentation
## How to Run the API Client
1. Clone or download this repository.
2. Open index.html directly in any web browser, or right-click index.html in VS Code and select Open with Live Server.
3. Click Load notes to request data from JSONPlaceholder.
4. Fill out the form to create a note, or click Delete on any note card to send API requests.

## Documentation Links
* [REST API Design Document](docs/api-design.md)
* [Data Model & SQL Schema](docs/data-model.md)
* [System Architecture & Scaling Plan](docs/architecture.md)

## What I Learned
1. How to wrap fetch calls in reusable JavaScript functions with full status handling for loading, success, error, and empty states.
2. How to design a clean REST API specification with standard HTTP status codes (201, 204, 400, 401, 403, 404, 500).
3. How to scale relational database schemas using join tables for many-to-many relationships and indexes for query optimization.
4. How to perform back-of-the-envelope capacity estimations to design scalable multi-tier architectures (CDNs, Load Balancers, Redis, Read Replicas, Message Queues).
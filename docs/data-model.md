# QuickNotes Data Model

## Entities & Attributes

1. users: Stores user credentials and profile details.
   - id (INT, Primary Key, Auto-increment)
   - username (VARCHAR(50), UNIQUE, NOT NULL)
   - email (VARCHAR(100), UNIQUE, NOT NULL)
   - password_hash (VARCHAR(255), NOT NULL)
   - created_at (TIMESTAMP, Default: CURRENT_TIMESTAMP)

2. notes: Stores note contents belonging to users.
   - id (INT, Primary Key, Auto-increment)
   - user_id (INT, Foreign Key referencing users(id), NOT NULL)
   - title (VARCHAR(100), NOT NULL)
   - body (TEXT)
   - created_at (TIMESTAMP, Default: CURRENT_TIMESTAMP)
   - updated_at (TIMESTAMP, Default: CURRENT_TIMESTAMP)

3. tags: Stores reusable tag labels.
   - id (INT, Primary Key, Auto-increment)
   - name (VARCHAR(30), UNIQUE, NOT NULL)

4. note_tags: Join table establishing many-to-many links between notes and tags.
   - note_id (INT, Foreign Key referencing notes(id))
   - tag_id (INT, Foreign Key referencing tags(id))
   - Primary Key: (note_id, tag_id)

---

## Entity Relationships
* User to Notes (One-to-Many): One user can own many notes (users.id -> notes.user_id). A note belongs to exactly one user.
* Notes to Tags (Many-to-Many): A note can have multiple tags, and a tag can be attached to multiple notes. Joined via note_tags.

---

## DDL (CREATE TABLE Statements)

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
---

## Example SQL Queries

### 1. Fetch all notes for a specific user
SELECT id, title, body, created_at 
FROM notes 
WHERE user_id = 42 
ORDER BY created_at DESC;
### 2. Fetch notes with their assigned tags (JOIN Query)
SELECT n.id, n.title, n.body, t.name AS tag_name
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON nt.tag_id = t.id
WHERE n.user_id = 42;
### 3. Count total notes created per user
SELECT u.username, COUNT(n.id) AS total_notes
FROM users u
LEFT JOIN notes n ON u.id = n.user_id
GROUP BY u.id;
---

## Indexing Strategy

CREATE INDEX idx_notes_user_id ON notes(user_id);
Reasoning: Since every API request to retrieve user notes queries WHERE user_id = ?, indexing user_id on the notes table prevents full table scans and keeps response times fast as the table grows to millions of rows.

---

## SQL vs. NoSQL Justification
We selected a Relational (SQL) database (PostgreSQL/MySQL) for QuickNotes. Relational databases provide ACID compliance, ensuring strict consistency for user credentials and note IDs. Structured foreign keys (ON DELETE CASCADE) prevent orphan data when tags or notes are deleted.
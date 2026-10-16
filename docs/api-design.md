# QuickNotes REST API Specification

## Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | /api/v1/notes | Retrieves a paginated list of notes for the authenticated user | 200 OK |
| GET | /api/v1/notes/:id | Retrieves details of a single note by ID | 200 OK |
| POST | /api/v1/notes | Creates a new note | 201 Created |
| PUT | /api/v1/notes/:id | Replaces/updates an existing note | 200 OK |
| DELETE | /api/v1/notes/:id | Deletes a note | 204 No Content |
| GET | /api/v1/tags | Lists all tags associated with the user's notes | 200 OK |

---

## Request & Response Examples

### 1. Creating a Note (POST /api/v1/notes)
Request Header:
Content-Type: application/json  
Authorization: Bearer <jwt_token>

Request Body:
{
  "title": "Meeting Agenda",
  "body": "Discuss Q4 targets and database migration.",
  "tag_ids": [1, 3]
}
Response Body (201 Created):
{
  "id": 101,
  "user_id": 42,
  "title": "Meeting Agenda",
  "body": "Discuss Q4 targets and database migration.",
  "tags": [
    { "id": 1, "name": "work" },
    { "id": 3, "name": "planning" }
  ],
  "created_at": "2026-10-16T14:30:00Z",
  "updated_at": "2026-10-16T14:30:00Z"
}
### 2. Listing Notes (GET /api/v1/notes?page=1&limit=2)
Response Body (200 OK):
{
  "data": [
    {
      "id": 101,
      "title": "Meeting Agenda",
      "body": "Discuss Q4 targets.",
      "created_at": "2026-10-16T14:30:00Z"
    },
    {
      "id": 100,
      "title": "Grocery List",
      "body": "Milk, Eggs, Bread",
      "created_at": "2026-10-15T09:15:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 2,
    "total": 25
  }
}
---

## Error Status Codes

* 400 Bad Request: Sent when input validation fails (e.g., missing title or title > 100 chars).
* 401 Unauthorized: Sent when no valid authentication token is provided.
* 403 Forbidden: Sent when requesting or modifying a note belonging to another user.
* 404 Not Found: Sent when accessing a note ID that does not exist.
* 500 Internal Server Error: Sent when an unexpected server error occurs.

### Example Error Response (400 Bad Request):
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "title",
        "issue": "Title field is required and cannot exceed 100 characters."
      }
    ]
  }
}
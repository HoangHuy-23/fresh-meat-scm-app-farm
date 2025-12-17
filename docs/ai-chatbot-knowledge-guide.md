## Overview

This guide shows how to integrate livestock knowledge management into your AI chatbot UI:

- Upload knowledge to Weaviate scoped by user's `facilityID` and email.
- View the knowledge a logged-in user has uploaded.

## Prerequisites

- Backend exposes:
  - `POST /knowledge/upload` (requires auth token)
  - `GET /knowledge/mine` (requires auth token; supports `limit`, `offset`, `include_email`)
- Auth token is available in the UI (e.g., after login) and sent in `Authorization: Bearer <token>`.

## Data Model Notes

- Upload stores `facilityID` (from token) and content fields provided by user.
- Email can be embedded in `content`; optional field `createdByEmail` may exist depending on schema.
- Listing filters by `facilityID`, optionally by `createdByEmail` when `include_email=true`.

## UI Flow

1. User logs in → store JWT token.
2. In chatbot UI:
   - “Upload Knowledge” form → calls `POST /knowledge/upload`.
   - “My Knowledge” tab → calls `GET /knowledge/mine` with pagination.

## API Usage

### Upload Knowledge

- Endpoint: `POST /knowledge/upload`
- Headers: `Authorization: Bearer <token>`; `Content-Type: application/json`
- Request body: array of items. Each item may contain:
  - `content`, `stage`, `species`, `min_age_days`, `max_age_days`, `recommended_feed`, `feed_dosage`, `medication`, `notes`.
- Behavior:
  - If `content` is omitted, backend composes content and tags with user email and `facilityID`.
- Example payload:

```json
[
  {
    "content": "Heo 90 ngày ăn Cám CP 201, 2.5 kg/con/ngày.",
    "stage": "Tăng trọng",
    "species": "heo",
    "min_age_days": 90,
    "max_age_days": 100,
    "recommended_feed": "CP 201",
    "feed_dosage": "2.5 kg/con/ngày",
    "medication": "",
    "notes": "Chuồng thoáng mát, mật độ phù hợp"
  }
]
```

### View My Knowledge

- Endpoint: `GET /knowledge/mine`
- Headers: `Authorization: Bearer <token>`
- Query parameters:
  - `limit` (default 20, 1..200)
  - `offset` (default 0)
  - `include_email` (`false`/`true`)
- Example: `GET /knowledge/mine?limit=20&offset=0&include_email=true`

## UI Integration Tips

- Add a button in the chatbot sidebar: “Upload Knowledge” → open a form modal.
- After successful upload, show a toast and optionally refresh “My Knowledge”.
- In “My Knowledge” tab:
  - Paginate with `limit`/`offset`.
  - Display key fields (stage, species, age range, feed, dosage, notes).
  - Include `createdByEmail` when `include_email=true` for clarity.

## Error Handling

- Authentication:
  - If 401/403, prompt re-login and clear local session.
- Validation:
  - Show field-level errors for missing or invalid inputs.
- Network:
  - Display a retry option if the upload/listing fails.

## Security Considerations

- Always send the JWT via `Authorization: Bearer <token>`.
- Avoid storing sensitive data in plain text fields where possible.
- Scope queries to the user’s `facilityID` to prevent cross-tenant access.

## Future Enhancements

- Bulk CSV upload mapped to the same schema.
- Inline “Add to Knowledge” from a chat message.
- Filter “My Knowledge” by stage/species/age range.

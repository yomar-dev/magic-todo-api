# Todo App API - Project Documentation

## Overview

API REST for task management (todos) built with Node.js, Express, TypeScript and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL (Docker)
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Testing**: Jest
- **Docker**: compose.yml for PostgreSQL

## Project Structure (Feature-based)

```
src/
├── config/              # Environment variables, configuration
├── features/
│   ├── auth/            # Authentication modules
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── types/
│   ├── todos/           # CRUD of tasks
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── types/
│   ├── categories/      # Task categories
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── types/
│   └── tags/            # Task tags
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── types/
├── shared/              # Shared resources
│   ├── middleware/      # Middlewares (auth, error handler, etc.)
│   ├── utils/           # Utilities
│   ├── exceptions/      # Custom errors
│   └── types/           # Shared types
├── database/            # Database configuration and Docker
└── tests/               # Unit and integration tests
```

## Data Model

### Users

| Field         | Type     | Constraints       |
| ------------- | -------- | ----------------- |
| id            | UUID     | PK, auto-generado |
| email         | String   | Unique, not null  |
| password_hash | String   | Not null          |
| name          | String   | Not null          |
| created_at    | DateTime | Auto              |
| updated_at    | DateTime | Auto              |

### Todos

| Field       | Type     | Constraints                      |
| ----------- | -------- | -------------------------------- |
| id          | UUID     | PK, auto-generated               |
| user_id     | UUID     | FK → users, not null             |
| title       | String   | Not null                         |
| description | Text     | Nullable                         |
| completed   | Boolean  | Default: false                   |
| priority    | Enum     | low/medium/high, default: medium |
| due_date    | DateTime | Nullable                         |
| notes       | Text     | Nullable                         |
| created_at  | DateTime | Auto                             |
| updated_at  | DateTime | Auto                             |

### Categories

| Field      | Type     | Constraints          |
| ---------- | -------- | -------------------- |
| id         | UUID     | PK, auto-generated   |
| user_id    | UUID     | FK → users, not null |
| name       | String   | Not null             |
| created_at | DateTime | Auto                 |

### Tags

| Field      | Type     | Constraints        |
| ---------- | -------- | ------------------ |
| id         | UUID     | PK, auto-generated |
| name       | String   | Unique, not null   |
| created_at | DateTime | Auto               |

### TodoTags (Many-to-Many Relationship (N:M))

| Field       | Type | Constraints       |
| ----------- | ---- | ----------------- |
| todo_id     | UUID | FK → todos        |
| tag_id      | UUID | FK → tags         |
| PRIMARY KEY |      | (todo_id, tag_id) |

## API Endpoints

### Auth (public)

- `POST /auth/register` - Register user
  - Body: `{ email, password, name }`
  - Response: `{ data: { user, accessToken, refreshToken } }`

- `POST /auth/login` - Login
  - Body: `{ email, password }`
  - Response: `{ data: { user, accessToken, refreshToken } }`

- `POST /auth/refresh` - Refresh token
  - Body: `{ refreshToken }`
  - Response: `{ data: { accessToken, refreshToken } }`

### Todos (Protected - JWT required)

- `GET /todos?limit=10&offset=0&completed=&priority=` - List with pagination and filters
  - Response: `{ data: [...], meta: { total, limit, offset } }`

- `GET /todos/:id` - Get task detail
  - Response: `{ data: { todo, category, tags } }`

- `POST /todos` - Create task
  - Body: `{ title, description?, completed?, priority?, due_date?, notes?, category_id?, tag_ids? }`
  - Response: `{ data: { todo } }`

- `PUT /todos/:id` - Update task
  - Body: `{ title?, description?, completed?, priority?, due_date?, notes?, category_id?, tag_ids? }`
  - Response: `{ data: { todo } }`

- `DELETE /todos/:id` - Delete task
  - Response: `{ data: { message: "Todo deleted" } }`

### Categories (Protected)

- `GET /categories` - List categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Edit category
- `DELETE /categories/:id` - Delete category

### Tags (Protected)

- `GET /tags` - List all tags
- `POST /tags` - Create tag
- `DELETE /tags/:id` - Delete tag

## Response Format (JSON:api style)

```json
{
  "data": { ... },
  "meta": { ... },
  "errors": [ ... ]
}
```

## Authentication

- JWT Access Token (expires in 15min)
- JWT Refresh Token (expires in 7 days)
- Stored in httpOnly cookies or headers
- Authentication middleware for protected routes

## Validation

- Zod for schema validation
- Validation at controller/validator level
- Structured error messages

## Docker

- `compose.yml` with PostgreSQL
- Port: 5432
- Database: `magic_todo`
- User: `magic_todo_db`
- Password: load from .env file

```sh
docker compose --env-file .env up -d
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio

## Development Rules

- Use ESLint + Prettier for code style
- Conventional Commits for commit messages
- Don't add comments unless necessary
- Tests are mandatory for services

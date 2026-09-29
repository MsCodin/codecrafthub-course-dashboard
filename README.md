# CodeCraftHub 🚀

CodeCraftHub is a lightweight, beginner-friendly REST API built with Node.js and Express. It allows developers to track and organize tech courses they want to complete using a local JSON file for data persistence.

---

## Features

- **Full CRUD Support**: Create, read, update, and delete course tracking entries.
- **Zero Database Setup**: Uses a local `courses.json` file as flat file storage.
- **Auto Storage Initialization**: Automatically generates `courses.json` if it doesn't already exist.
- **Auto Incremental IDs**: Sequentially generates integer IDs starting from `1`.
- **Status Tracking**: Track courses across three stages: `Not Started`, `In Progress`, and `Completed`.
- **Error Handling**: Comprehensive HTTP status codes and feedback for missing fields or bad queries.

---

## Prerequisites

Before running this project, ensure you have installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes bundled with Node.js)

---

## Installation Instructions

1. **Clone or download** this project folder to your machine.
2. Open your terminal and navigate into the project directory:
   ```bash
   cd codecrafthub
   ```
3. Install project dependencies:
   ```bash
   npm install
   ```

---

## How to Run the Application

Start the application using the start script:

```bash
npm start
```

Or run directly with Node:

```bash
node app.js
```

Once started, the server will listen on port **5000**:

```text
CodeCraftHub server running on http://localhost:5000
```

---

## API Documentation & Examples

### Course Object Schema

| Field         | Type    | Description                                  | Required?                            |
| :------------ | :------ | :------------------------------------------- | :----------------------------------- |
| `id`          | Integer | Auto-generated sequential ID                 | Auto                                 |
| `name`        | String  | Name of the course                           | Required                             |
| `description` | String  | Details about course content                 | Required                             |
| `target_date` | String  | Target completion date (`YYYY-MM-DD`)        | Required                             |
| `status`      | String  | `Not Started`, `In Progress`, or `Completed` | Optional (Defaults to `Not Started`) |
| `created_at`  | String  | ISO Timestamp of creation                    | Auto                                 |

---

### Endpoints Overview

#### 1. Get All Courses

- **HTTP Method:** `GET`
- **URL:** `/api/courses`
- **Example cURL:**
  ```bash
  curl http://localhost:5000/api/courses
  ```

#### 2. Get Single Course by ID

- **HTTP Method:** `GET`
- **URL:** `/api/courses/:id`
- **Example cURL:**
  ```bash
  curl http://localhost:5000/api/courses/1
  ```

#### 3. Create a New Course

- **HTTP Method:** `POST`
- **URL:** `/api/courses`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
  ```json
  {
    "name": "Node.js & Express Deep Dive",
    "description": "Learn REST APIs and middleware patterns",
    "target_date": "2026-11-30",
    "status": "In Progress"
  }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:5000/api/courses \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Docker Basics\",\"description\":\"Containers 101\",\"target_date\":\"2026-12-15\"}"
  ```

#### 4. Update an Existing Course

- **HTTP Method:** `PUT`
- **URL:** `/api/courses/:id`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
  ```json
  {
    "status": "Completed"
  }
  ```
- **Example cURL:**
  ```bash
  curl -X PUT http://localhost:5000/api/courses/1 \
    -H "Content-Type: application/json" \
    -d "{\"status\":\"Completed\"}"
  ```

#### 5. Delete a Course

- **HTTP Method:** `DELETE`
- **URL:** `/api/courses/:id`
- **Example cURL:**
  ```bash
  curl -X DELETE http://localhost:5000/api/courses/1
  ```

---

## Troubleshooting

### Error: `Cannot find module 'express'`

- **Cause:** Dependencies haven't been installed yet.
- **Solution:** Run `npm install` in your terminal root directory.

### Error: `MODULE_NOT_FOUND` when running `node app.js`

- **Cause:** You might be running the command from the wrong folder or `app.js` is inside a subfolder (e.g., `data/`).
- **Solution:** Ensure `app.js` is directly inside the root `codecrafthub` directory and run `node app.js` from there.

### Error: `EADDRINUSE: address already in use :::5000`

- **Cause:** Another process or application is already using Port 5000.
- **Solution:** Stop any active server running in another terminal window, or change `const PORT = 5000;` in `app.js` to a different port like `5001`.

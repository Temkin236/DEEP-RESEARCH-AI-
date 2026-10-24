# Database Schema & Migrations — Tech Research AI

## Database Architecture

Tech Research AI supports both SQLite (default for instant zero-configuration local development) and PostgreSQL (for production containerized deployments).
Migrations are managed using **Alembic**.

```
+-------------------------------------------------------+
|                     research_jobs                     |
|-------------------------------------------------------|
| id (PK, UUID)                                         |
| topic (VARCHAR)                                       |
| instructions (TEXT)                                   |
| depth (VARCHAR)                                       |
| focus (VARCHAR)                                       |
| max_sources (INTEGER)                                 |
| selected_documents (JSON)                             |
| status (VARCHAR)                                      |
| progress (INTEGER)                                    |
| current_stage (VARCHAR)                               |
| error_message (TEXT)                                  |
| created_at, updated_at, completed_at (TIMESTAMP)      |
+-------------------------------------------------------+
        |                 |                  |
        | 1:N             | 1:N              | 1:1
        v                 v                  v
+---------------+ +---------------+ +-------------------+
|    sources    | |   findings    | |      reports      |
|---------------| |---------------| |-------------------|
| id (PK)       | | id (PK)       | | id (PK)           |
| job_id (FK)   | | job_id (FK)   | | job_id (FK, Unique|
| title         | | subquestion   | | title             |
| url           | | claim         | | executive_summary |
| domain        | | excerpt       | | methodology       |
| snippet       | | confidence    | | key_findings(JSON)|
| pub_date      | | is_disputed   | | detailed_analysis |
| is_verified   | +---------------+ | comparison_tables |
+---------------+                   | recommendations   |
                                    | limitations       |
                                    | markdown_content  |
                                    | citations_data    |
                                    +-------------------+

+-----------------------+           +-----------------------+
|       documents       | 1:N       |    document_chunks    |
|-----------------------| --------> |-----------------------|
| id (PK, UUID)         |           | id (PK, UUID)         |
| filename              |           | document_id (FK)      |
| file_path             |           | chunk_index (INTEGER) |
| file_size             |           | content (TEXT)        |
| mime_type             |           | metadata_json (JSON)  |
| chunk_count           |           +-----------------------+
| is_indexed (BOOLEAN)  |
+-----------------------+
```

---

## Running Migrations

To apply pending migrations:
```bash
cd backend
.venv/bin/alembic upgrade head
```

To create a new schema migration:
```bash
cd backend
.venv/bin/alembic revision --autogenerate -m "describe_changes"
```

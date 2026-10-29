# Employee Management System

An Employee Management System developed as a technical assignment using **Angular, PrimeNG, Django REST Framework, and PostgreSQL**.

The application helps manage employee records, departments, companies, and related master data through a centralized web interface.

## Features

- **Authentication:** Login using Django authentication and JWT authentication.
- **Dashboard:** Dashboard summary and metrics.
- **Employee Management:** Create, view, update, and manage employee records.
- **Department Management:** Manage departments.
- **Company Management:** Manage company records.
- **Master Data Management:** Manage designations, locations, and employee types.
- **Search, Sorting & Pagination:** Available on employee, department, and company tables.
- **Form Validation:** Reactive forms with validation.
- **REST API Integration:** Centralized Angular API service pattern.
- **Database:** PostgreSQL with relational data management.
- **Employee Status Handling:** Soft-delete-style status handling for employees.
- **UI:** Responsive, enterprise-style interface.

## Tech Stack

- **Frontend:** Angular, TypeScript, PrimeNG
- **Backend:** Python, Django, Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT
- **API:** REST

## Project Structure

```text
employee-management-system/
├── backend/
├── frontend/
├── database/
│   └── schema.sql
└── README.md
```

## Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- PostgreSQL
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RakeshAtchuta/employee-management-system.git
cd employee-management-system
```

### 2. Backend Setup

Create and activate a Python virtual environment from the project root.

**Windows PowerShell:**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Configure PostgreSQL:

1. Create a PostgreSQL database named `employee_management`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Configure the required database settings and other environment variables.
4. Keep credentials private.

Run database migrations:

```bash
python backend/manage.py migrate
```

Create an administrator account:

```bash
python backend/manage.py createsuperuser
```

Start the backend:

```bash
python backend/manage.py runserver
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The Angular application expects the backend API at:

`http://127.0.0.1:8000`

Ensure the backend is running before using the application.

## Demo Login

Create your own Django superuser using the `createsuperuser` command and use the configured credentials if your login implementation supports them.

Do not publish passwords or access tokens.

## API Endpoints

Base URL: `http://127.0.0.1:8000/api`

| Resource | Endpoint |
|---|---|
| Authentication | `POST /auth/login/` |
| Employees | `/employees/` |
| Departments | `/departments/` |
| Companies | `/companies/` |
| Designations | `/designations/` |
| Locations | `/locations/` |
| Employee Types | `/employee-types/` |
| Dashboard | `GET /dashboard/` |

Employee detail endpoint:

`/employees/<id>/`

Supported operations depend on the configured backend routes and permissions.

## Database

PostgreSQL is used for persistent storage and relational data management.

Database setup resources are available in the `database/` directory.

## Notes

- The frontend and backend must be configured correctly to communicate.
- Configure environment variables before running the backend.
- The assignment reference screenshots are design references; this implementation uses its own enterprise-style layout.

## Author

**Rakesh Atchuta**

GitHub: https://github.com/RakeshAtchuta

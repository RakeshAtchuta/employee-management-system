# Employee Management System

Technical assignment implementation using Angular + PrimeNG, Django REST Framework, and PostgreSQL.

## Features
- Login using Django authentication
- Dashboard summary
- Employee CRUD
- Department CRUD
- Company CRUD
- Master data CRUD
- Search, sorting and pagination on employee/department/company tables
- Reactive-form validation
- REST APIs
- PostgreSQL relationships
- Responsive enterprise-style UI
- JWT authentication
- Centralized Angular API service pattern
- Soft-delete style status handling for employees

## Project structure
- `backend/` Django REST API
- `frontend/` Angular application
- `database/` PostgreSQL setup

## Backend setup
1. Create PostgreSQL database `employee_management`.
2. Copy `backend/.env.example` to `backend/.env` and set database values.
3. Create a Python virtual environment:
   `python -m venv venv`
4. Activate it.
5. Install dependencies:
   `pip install -r backend/requirements.txt`
6. Run:
   `python backend/manage.py migrate`
7. Create an admin user:
   `python backend/manage.py createsuperuser`
8. Start:
   `python backend/manage.py runserver`

## Frontend setup
1. Install Node.js.
2. From `frontend/`, run:
   `npm install`
3. Start:
   `npm start`

The Angular app expects the backend at `http://127.0.0.1:8000`.

## Demo login
Create your own Django superuser with `createsuperuser`, then use those credentials in the login screen.

## API
- POST `/api/auth/login/`
- GET/POST `/api/employees/`
- GET/PUT/PATCH/DELETE `/api/employees/<id>/`
- GET/POST `/api/departments/`
- GET/POST `/api/companies/`
- GET/POST `/api/designations/`
- GET/POST `/api/locations/`
- GET/POST `/api/employee-types/`
- GET `/api/dashboard/`

## Notes
The reference screenshots in the assignment are design references; this implementation uses its own enterprise-style layout.

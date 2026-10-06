# Smart Expense Budget Management

A full-stack personal finance and group expense management application built with React, Spring Boot and MySQL.

# Features

### Personal Finance
- User registration and login
- Add income and expenses
- Track total income
- Track total expenses
- View current balance
- Delete transactions
- Categorize transactions
- Custom transaction date and time

### Group Expense Management
- Create expense groups
- Add registered users to groups
- Add shared expenses
- Split expenses equally between group members
- Calculate amount paid by each member
- Calculate amount owed by each member
- View group balances
- Record settlements
- View settlement history

### Reports & Analytics
- Total income
- Total expense
- Current balance
- Category-wise expense
- Monthly expense analysis

##  Technology Stack

### Frontend
- React
- JavaScript
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Java
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- REST API
- Lombok
- Validation

### Database
- MySQL

### Tools
- IntelliJ IDEA
- VS Code
- Postman
- Git & GitHub

## 📁 Project Structure

```text
smart-expense-budget-management/
│
├── frontend/
│   └── smart-expense-frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── backend/
│   └── smart-expense-backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── org/example/smartexpensebackend/
│       │   │   │       ├── config/
│       │   │   │       ├── controller/
│       │   │   │       ├── dto/
│       │   │   │       ├── entity/
│       │   │   │       ├── exception/
│       │   │   │       ├── repository/
│       │   │   │       └── service/
│       │   │   └── resources/
│       │   └── test/
│       └── pom.xml
│
├── .gitignore
└── README.md
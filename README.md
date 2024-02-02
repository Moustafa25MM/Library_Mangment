# Bosta application Server

## Installation

```bash
Clone the github repository

if you have Docker in your machine :
run the following commands :
docker-compose build
docker-compose up

or :

npm install
npm start
```

## Usage

```python
1. create a .env file in the root directory and add the following as an example:
PORT=
DATABASE_URL="DATABASE_URL"
JWT_SECRET="JWT_SECRET"
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=YourSecureAdminPassword

2. npm start -> to run the server
3. npm test -> to run tests

```

## How to use

### Reister User

```python
1. endpoint =   http://localhost:4000/auth/register   "Or any port of your choice"

2. Provide the following example json in the body :
{     "name": "user1",
      "email": "user1@gmail.com",
      "password": "password"
}

It will return an object like this:
{
    "type": "success",
    "message": "user created successfully",
    "data": {
        "user": {
            "id": "2cb5ef0a-d73c-45a5-b91f-136e755e0b6b",
            "name": "user1",
            "email": "user1@gmail.com",
            "password": "$2b$12$2nF.mm54Dp0apt/H1P23QOJp1j0kzq8PtvFmhW0fCr4PDIzz.T6uG",
            "registeredDate": "2024-02-02T18:52:10.031Z",
            "role": "BORROWER"
        }
    }
}
```

### Login

```python
1. endpoint = http://localhost:4000/auth/login   "Or any port of your choice"
2. Provide the following example json in the body :
{
  "email":"user1@gmail.com",
    "password":"password"
}

It will return an object like this:
{
    "type": "success",
    "message": "user Login Successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjYjVlZjBhLWQ3M2MtNDVhNS1iOTFmLTEzNmU3NTVlMGI2YiIsImlhdCI6MTcwNjg5OTk1MSwiZXhwIjoxNzA3NTA0NzUxfQ.IkN5cxn7aNPxh7BrrHiJUDiwGKj_UVHDVm3qU5wFj_s",
        "user": {
            "id": "2cb5ef0a-d73c-45a5-b91f-136e755e0b6b",
            "name": "user1",
            "email": "user1@gmail.com",
            "role": "BORROWER"
        }
    }
}
```

### For Admin --> :

# Create Admin

```python
1. endpoint =   http://localhost:4000/admin/create/admin   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "name":"admin2",
    "email":"admin2@example.com",
    "password":"anotherAdmin"
}

It will return an object like this:

{
    "type": "success",
    "message": "Admin created successfully",
    "data": {
        "admin": {
            "id": "78fcd745-43dd-405a-a8e1-f6a027e4edea",
            "name": "admin2",
            "email": "admin2@example.com",
            "password": "$2b$12$Ks.XKdMc1WN/zzFLse0VLu8J/4vdX3uC7A3B091tg/rZjWVQQDorW",
            "registeredDate": "2024-02-02T18:54:15.138Z",
            "role": "ADMIN"
        }
    }
}
```

# Admin Update himself

```python
1. endpoint =  http://localhost:4000/admin/update/admin   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "email":"admin@example3.com"
}

It will return an object like this:

{
    "type": "success",
    "message": "Admin updated successfully",
    "data": {
        "updatedAdmin": {
            "id": "cafb2ce3-dd45-4093-84d6-8ed61488f494",
            "name": "Default Admin",
            "email": "admin@example3.com",
            "password": "$2b$12$SLIVG6PJWjikEsuvNbksR..Pm0xw4oYquEfnUMeEg4Oyos4c.qjHS",
            "registeredDate": "2024-02-02T15:50:51.464Z",
            "role": "ADMIN"
        }
    }
}
```

# delete borrower

```python
1. endpoint =  http://localhost:4000/admin/delete/3fd6db73-41e6-49e3-8ef3-e0b7860ba67e/borrower   "Or any port of your choice"
2. you provide an Authorization token in the headres


It will return an object like this:

{
    "type": "success",
    "message": "Borrower Deleted successfully",
}
```

# list borrowers

```python
1. endpoint =  http://localhost:4000/admin/get/borrowers   "Or any port of your choice"
2. you provide an Authorization token in the headres


It will return an object like this:
{
    "type": "success",
    "message": "Borrowers retrieved successfully",
    "data": {
        "paginatedResponse": {
            "pagination": {
                "totalDocs": 3,
                "limit": 10,
                "totalPages": 1,
                "page": 1,
                "pagingCounter": 1,
                "hasPrevPage": false,
                "hasNextPage": false,
                "prevPage": null,
                "nextPage": null
            },
            "borrowers": [
                {
                    "id": "2cb5ef0a-d73c-45a5-b91f-136e755e0b6b",
                    "name": "user1",
                    "email": "user1@gmail.com",
                    "password": "$2b$12$2nF.mm54Dp0apt/H1P23QOJp1j0kzq8PtvFmhW0fCr4PDIzz.T6uG",
                    "registeredDate": "2024-02-02T18:52:10.031Z",
                    "role": "BORROWER"
                },
                {
                    "id": "2f0ea487-e844-4980-9c94-d174207a940d",
                    "name": "New Test User",
                    "email": "newTestUser@example.com",
                    "password": "$2b$12$STpjG6sTbjlZQZsKbLq96OIroyJuGeaSd.pFlhFJC4nHpPFoToW1e",
                    "registeredDate": "2024-02-02T15:50:51.713Z",
                    "role": "BORROWER"
                },
                {
                    "id": "e26bd331-31c7-4018-a2b9-d9af09bda978",
                    "name": "Test User",
                    "email": "testUser@example.com",
                    "password": "$2b$12$kbu97JYIn7s4b7crPTQy8eGKN/BFS1OZoVnxrL.FNtG33BNEKfDy2",
                    "registeredDate": null,
                    "role": "BORROWER"
                }
            ]
        }
    }
}
```

# Add Book

```python
1. endpoint =  http://localhost:4000/book/add   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "title":"book3",
    "author":"taha",
    "isbn":"20120312322111",
    "quantity":21,
    "shelfLocation":"room1"
}

It will return an object like this:
{
    "type": "success",
    "message": "Book added successfully",
    "data": {
        "book": {
            "id": "584bfe53-6b12-4c50-a17e-5b4e2811a6bc",
            "title": "book3",
            "author": "taha",
            "isbn": "20120312322111",
            "quantity": 21,
            "shelfLocation": "room1"
        }
    }
}
```

# Update Book

```python
1. endpoint = http://localhost:4000/book/update/023f95a6-2348-4beb-a931-398e9a0d7029   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "quantity":13,
    "author":"ahmed"
}
It will return an object like this:
{
    "type": "success",
    "message": "Book updated successfully",
    "data": {
        "updatedBook": {
            "id": "023f95a6-2348-4beb-a931-398e9a0d7029",
            "title": "Updated Title",
            "author": "ahmed",
            "isbn": "123-updated",
            "quantity": 13,
            "shelfLocation": "U2"
        }
    }
}
```

# Delete Book

```python
1. endpoint = http://localhost:4000/book/delete/023f95a6-2348-4beb-a931-398e9a0d7029   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:
{
    "type": "success",
    "message": "Book deleted successfully",
    "data": {}
}
```

# List Books

```python
1. endpoint = http://localhost:4000/book/list/books   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:
{
    "type": "success",
    "message": "Books retrieved successfully",
    "data": {
        "paginatedResponse": {
            "pagination": {
                "totalDocs": 2,
                "limit": 10,
                "totalPages": 1,
                "page": 1,
                "pagingCounter": 1,
                "hasPrevPage": false,
                "hasNextPage": false,
                "prevPage": null,
                "nextPage": null
            },
            "books": [
                {
                    "id": "5069c351-0d54-4283-a8a8-208efc6a51b3",
                    "title": "New Test Book",
                    "author": "Author Test",
                    "isbn": "123-4567890123",
                    "quantity": 4,
                    "shelfLocation": "A1"
                },
                {
                    "id": "584bfe53-6b12-4c50-a17e-5b4e2811a6bc",
                    "title": "book3",
                    "author": "taha",
                    "isbn": "20120312322111",
                    "quantity": 21,
                    "shelfLocation": "room1"
                }
            ]
        }
    }
}
```

# Search Books

```python
1. endpoint = http://localhost:4000/book/search/books?author=updated   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:
{
    "type": "success",
    "message": "Books found successfully",
    "data": {
        "paginatedResponse": {
            "pagination": {
                "totalDocs": 1,
                "limit": 10,
                "totalPages": 1,
                "page": 1,
                "pagingCounter": 1,
                "hasPrevPage": false,
                "hasNextPage": false,
                "prevPage": null,
                "nextPage": null
            },
            "books": [
                {
                    "id": "023f95a6-2348-4beb-a931-398e9a0d7029",
                    "title": "Updated Title",
                    "author": "Updated Author",
                    "isbn": "123-updated",
                    "quantity": 15,
                    "shelfLocation": "U2"
                }
            ]
        }
    }
}
```

### For User

# Checkout Book

```python
1. endpoint =  http://localhost:4000/borrowing/checkout/book   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "bookId":"5069c351-0d54-4283-a8a8-208efc6a51b3"
}

It will return an object like this:
{
    "type": "success",
    "message": "Book Borrowed successfully",
    "data": {
        "borrowing": {
            "id": "b5df1615-9fde-488a-a126-9cdab1b127df",
            "borrowedDate": "2024-02-02T16:33:07.608Z",
            "dueDate": "2024-02-09T16:33:07.608Z",
            "returned": false,
            "bookId": "5069c351-0d54-4283-a8a8-208efc6a51b3",
            "userId": "e26bd331-31c7-4018-a2b9-d9af09bda978"
        }
    }
}
```

# Return Book

```python
1. endpoint =  http://localhost:4000/borrowing/return/book  "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "bookId":"a9402a27-bbc4-479e-b723-90eb61f63b84"
}

It will return an object like this:
{
    "type": "success",
    "message": "Book Returned successfully",

}
```

# User Get all Borrowed Books

```python
1. endpoint =  http://localhost:4000/borrowing/checked/books  "Or any port of your choice"
2. you provide an Authorization token in the headres


{
    "type": "success",
    "message": "Currently borrowed books retrieved successfully",
    "data": {
        "paginatedResponse": {
            "pagination": {
                "totalDocs": 1,
                "limit": 10,
                "totalPages": 1,
                "page": 1,
                "pagingCounter": 1,
                "hasPrevPage": false,
                "hasNextPage": false,
                "prevPage": null,
                "nextPage": null
            },
            "borrowedBooks": [
                {
                    "id": "e550615f-5112-496d-bb79-42860ff90e41",
                    "borrowedDate": "2024-02-02T19:09:05.005Z",
                    "dueDate": "2024-02-09T19:09:05.005Z",
                    "returned": false,
                    "bookId": "5069c351-0d54-4283-a8a8-208efc6a51b3",
                    "userId": "2cb5ef0a-d73c-45a5-b91f-136e755e0b6b",
                    "book": {
                        "id": "5069c351-0d54-4283-a8a8-208efc6a51b3",
                        "title": "New Test Book",
                        "author": "Author Test",
                        "isbn": "123-4567890123",
                        "quantity": 3,
                        "shelfLocation": "A1"
                    }
                }
            ]
        }
    }
}
```

# User Checks if have any over due Books

```python
1. endpoint =  http://localhost:4000/borrowing/list/user/overdue/books  "Or any port of your choice"
2. you provide an Authorization token in the headres

{
    "type": "success",
    "message": "You have no overdue books",
    "data": {
        "paginatedResponse": {
            "pagination": {
                "totalDocs": 0,
                "limit": 10,
                "totalPages": 0,
                "page": 1,
                "pagingCounter": 1,
                "hasPrevPage": false,
                "hasNextPage": false,
                "prevPage": null,
                "nextPage": null
            },
            "overdueBooks": []
        }
    }
}
```

### SYSTEM ADMIN

# Admin Lists all over due Books

```python
1. endpoint =  http://localhost:4000/borrowing/list/all/overdue/books  "Or any port of your choice"
2. you provide an Authorization token in the headres

{
    "type": "success",
    "message": "No overdue books found",
    "data": {
        "paginatedResponse": {
            "pagination": {
                "totalDocs": 0,
                "limit": 10,
                "totalPages": 0,
                "page": 1,
                "pagingCounter": 1,
                "hasPrevPage": false,
                "hasNextPage": false,
                "prevPage": null,
                "nextPage": null
            },
            "overdueBooks": []
        }
    }
}
```

### REPORTS

# Overdue Books in the last Month

```python
1. endpoint = http://localhost:4000/reports/overdue/books  "Or any port of your choice"
2. you provide an Authorization token in the headres

{
    "type": "success",
    "message": "Overdue books report generated successfully.",
    "data": {
        "overdueBookReports": []
    }
}
3. Will be exported as CSV
```

# Admin Lists Last Month Borrowings

```python
1. endpoint =  http://localhost:4000/reports/lastmonth/borrowings/books  "Or any port of your choice"
2. you provide an Authorization token in the headres

{
    "type": "success",
    "message": "Last month borrowings report generated successfully.",
    "data": {
        "borrowingReports": [
            {
                "borrowingId": "b5df1615-9fde-488a-a126-9cdab1b127df",
                "bookTitle": "New Test Book",
                "borrowedDate": "2024-02-02",
                "dueDate": "2024-02-09",
                "returned": false
            },
            {
                "borrowingId": "e550615f-5112-496d-bb79-42860ff90e41",
                "bookTitle": "New Test Book",
                "borrowedDate": "2024-02-02",
                "dueDate": "2024-02-09",
                "returned": false
            }
        ]
    }
}
3. Will be exported as CSV

```

# Admin Lists all Borrowing Books in a Specific Period

```python
1. endpoint = http://localhost:4000/reports/borrowings-in-period?startDate=2024-01-01&endDate=2024-02-31  "Or any port of your choice"
2. you provide an Authorization token in the headres

{
    "type": "success",
    "message": "Borrowings report for the specified period generated successfully.",
    "data": {
        "borrowingReports": [
            {
                "borrowingId": "b5df1615-9fde-488a-a126-9cdab1b127df",
                "bookTitle": "New Test Book",
                "borrowedDate": "2024-02-02",
                "dueDate": "2024-02-09",
                "borrowerName": "Test User",
                "borrowerEmail": "testUser@example.com",
                "returned": false
            },
            {
                "borrowingId": "e550615f-5112-496d-bb79-42860ff90e41",
                "bookTitle": "New Test Book",
                "borrowedDate": "2024-02-02",
                "dueDate": "2024-02-09",
                "borrowerName": "user1",
                "borrowerEmail": "user1@gmail.com",
                "returned": false
            }
        ]
    }
}
3. Will be exported as CSV
```

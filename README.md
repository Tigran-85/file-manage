# ExpressJS Authentication and File Management API

[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

## Introduction

This is a ExpressJS-based API for managing files, with authentication functionalities using JWT. The API supports creating, updating, deleting, retrieving, uploading and downloading files, as well as user registration, login, logout, refresh token and get user info.

This project is a web application written in MySQL using Sequelize

## Table of Contents

- [Installation](#installation)
- [Endpoints](#endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
    - [Registration](#registration)
    - [Login](#login)
    - [Logout](#logout)
    - [Refresh Token](#refresh-token)
    - [User Info](#user-info)
  - [File Management Endpoints](#file-management-endpoints)
    - [Upload File](#upload-file)
    - [List Files](#list-files)
    - [Get File by ID](#get-file-by-id)
    - [Update File](#update-file)
    - [Delete File](#delete-file)
    - [Download File](#download-file)
- [Features](#features)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Tigran-85/file-manage
    cd file-manage
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Run migrations:
    ```bash
    npm run db-create-users - // creates users table 
    ```
    ```bash
    npm run db-create-refreshTokens - // creates refreshTokens table
    ```
    ```bash
    npm run db-create-files - // creates refreshTokens table
    ```
    ```bash
    npm run db-create-blacklists - // creates blacklists tables
    ```

4. Install Mysql database and create database with name `files`

5. Create uploads folder in root folder:
    ```bash
    mkdir uploads
    ```

## Running the Application

1. Start the application in development mode:
    ```bash
    npm run dev
    ```
2. The application will be running at `http://localhost:3000`.

## Endpoints

### Authentication Endpoints

#### Registration
- **Endpoint:** `/api/auth/signup`
- **Method:** `POST`
- **Body:**
    - `email`: Must be valid email.
    - `password`: Must contain at least 3 uppercase, 3 lowercase, 2 numbers and 2 special character.

#### Login:
- **Endpoint:** `/api/auth/signin`
- **Method:** `POST`
- **Body:**
    - `email`: Must be valid email.
    - `password`: Must contain at least 5 characters

#### User Info:
- **Endpoint:** `/api/auth/info`
- **Method:** `GET`
- **Headers:**
    - `authorization: Bearer token`: Must be valid token.

#### Refresh token:
- **Endpoint:** `/api/auth/signin/new_token`
- **Method:** `POST`

#### Logout:
- **Endpoint:** `/api/auth/logout`
- **Method:** `GET`
- **Headers:**
    - `authorization: Bearer token`: Must be valid token.

### File Management Endpoints  

#### Upload file:
- **Endpoint:** `/api/file/upload`
- **Method:** `POST`
- **Body form-data:**
    - `Key-file: Value-file to upload`: files type must be in format of PNG, JPG, txt, PDF, WORD and EXCEL.

#### List files:
- **Endpoint:** `/api/file/list`
- **Method:** `GET`
- **Query Parameters:**
    - `list_size` (default: 10): Number of files per page.
    - `page` (default: 1): Page number for pagination.

#### Delete file
- **Endpoint:** `/api/file/delete{id}`
- **Method:** `DELETE`
- **Query Parameters:**
    - `id`: Unique identifier of the file.

#### Get File by ID:
- **Endpoint:** `/api/file/{id}`
- **Method:** `GET`
- **Query Parameters:**
    - `id`: Unique identifier of the file.

#### Download file:
- **Endpoint:** `/api/file/download/{id}`
- **Method:** `GET`
- **Query Parameters:**
    - `id`: Unique identifier of the file.

#### Update file:
- **Endpoint:** `/api/file/update/{id}`
- **Method:** `PUT`
- **Query Parameters:**
    - `id`: Unique identifier of the file.  
- **Body form-data:**
    - `Key-file: Value-file to upload`: files type must be in format of PNG, JPG, txt, PDF, WORD and EXCEL.     

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
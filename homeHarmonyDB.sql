-- Database: homeHarmonyDB

-- DROP DATABASE IF EXISTS "homeHarmonyDB";

CREATE DATABASE "homeHarmonyDB"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	CREATE TABLE usersTable (
    id INTEGER NOT NULL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    aptid INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    image BYTEA ,
    isManager BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL
)
 
INSERT INTO usersTable (id, fname, lname, aptid, email, birthdate, image, isManager, password)
VALUES (1, 'John', 'Doe', 123, 'john@example.com', '1990-01-01', NULL, FALSE, 'password123');
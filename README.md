# TreasueBox

A full stack TypeScript application for people who want to create and sotre customer and job data.

## Why I Built This

I wanted to build an application that can help people manage their customer and job information safely while being able to create invoices. 

## Technologies Used

- React.js
- TypeScript
- JavaScript
- Node.js
- Express.js
- Flexbox
- CSS
- HTML 5
- PostgreSQL
- Pgweb
- Tailwind
- AWS

## Live Demo

Try the application live at http://ec2-13-52-163-138.us-west-1.compute.amazonaws.com/

## Features

- User can create customer
- User can edit customer
- User can delete customer
- User can view customer list
- User can create job associated with customer
- User can edit job
- User can delete job
- User can search through customers to see all jobs associated with certain customer
- User can create invoices and send them

### System Requirements

- Node.js 18.18 or higher
- NPM 10 or higher
- PostgreSQL 14 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/Learning-Fuze/sgt-react
    cd sgt-react
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Import the starting database to PostgreSQL.

    ```shell
    createdb sgtDb
    npm run db:import
    ```

1. Start the project. Once started you can view the application by opening http://localhost:5173 in your browser.

    ```shell
    npm run dev
    ```

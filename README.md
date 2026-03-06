# Rag Pipeline Frontend

This is the frontend application for **Rag Pipeline**, built with
**Next.js**. It provides the user interface for managing pipelines,
chatting with agents, and interacting with your RAG system.

------------------------------------------------------------------------

## Overview

Rag Pipeline is a frontend for a Retrieval-Augmented Generation
workflow. Through this app, users can:

-   Manage RAG pipelines
-   Create and use agents
-   Upload and process documents
-   Start conversations with agents
-   View chat history and pipeline-related data

This project is built with:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS

------------------------------------------------------------------------

## Requirements

Before running the project locally, make sure you have:

-   **Node.js** installed
-   a package manager such as:
    -   npm
    -   yarn
    -   pnpm
    -   bun

------------------------------------------------------------------------

## Environment Setup

Create a file named:

.env.local

in the root of the project, then add the following variables:

    NEXT_PUBLIC_API_URL=https://uncrushable-lieselotte-venular.ngrok-free.dev
    NEXT_PUBLIC_APP_NAME=Rag Pipeline

### Variable reference

-   **NEXT_PUBLIC_API_URL** → backend API base URL used by the frontend
-   **NEXT_PUBLIC_APP_NAME** → application name displayed in the
    frontend

------------------------------------------------------------------------

## Installation

Install dependencies:

    npm install

or

    yarn install

or

    pnpm install

or

    bun install

------------------------------------------------------------------------

## Running the Project Locally

Start the development server:

    npm run dev

or

    yarn dev

or

    pnpm dev

or

    bun dev

Once the server is running, open:

http://localhost:3000

in your browser.

------------------------------------------------------------------------

## Project Structure

Example structure:

    app/
    components/
    api/
    store/
    types/
    public/

### Folder Description

-   **app/** → Next.js routes and pages
-   **components/** → reusable UI components
-   **api/** → service files for backend requests
-   **store/** → client-side state management
-   **types/** → TypeScript interfaces and types
-   **public/** → static assets

------------------------------------------------------------------------

## Editing the Application

You can start editing the app by modifying:

    app/page.tsx

Changes will automatically reload while the dev server is running.

------------------------------------------------------------------------

## Production Build

Create a production build:

    npm run build

Run the production server:

    npm run start

------------------------------------------------------------------------

## Scripts

Common scripts used in this project:

    npm run dev
    npm run build
    npm run start
    npm run lint

------------------------------------------------------------------------

## Troubleshooting

### Environment variables not loading

Make sure:

-   the file is named `.env.local`
-   variables start with `NEXT_PUBLIC_` if used on the frontend
-   you restart the dev server after editing `.env.local`

### API requests failing

Check that:

-   `NEXT_PUBLIC_API_URL` is correct
-   the backend server is running
-   your **ngrok tunnel** is active
-   backend **CORS configuration** allows requests

------------------------------------------------------------------------

## Quick Local Setup

1.  Clone the repository
2.  Create `.env.local`
3.  Add the required environment variables
4.  Install dependencies
5.  Run the development server
6.  Open `http://localhost:3000`

------------------------------------------------------------------------

## Required `.env.local`

    NEXT_PUBLIC_API_URL="THE API URL"
    NEXT_PUBLIC_APP_NAME=Rag Pipeline

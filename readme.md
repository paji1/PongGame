# ft_transcendence

## Table of Contents
- [Overview](#overview)
- [Technical Stack](#technical-stack)
- [Security](#security)
- [User Account](#user-account)
- [Chat](#chat)
- [Game](#game)
- [Docker Deployment](#docker-deployment)
- [Contributors](#contributors)

---

## Overview

"ft_trancesandance" is the last student projectin 42Network common core, a web-based Pong contest platform that enables users to play Pong with others in real-time, offering a rich user interface, a chat feature, and multiplayer online games. The project adheres to specific rules and security considerations to ensure a secure and enjoyable gaming experience.

---

## Technical Stack

- **Backend**: NestJS
- **Frontend**: TypeScript / ReactJS
- **Database**: PostgreSQL
- **Deployment**: Docker and Docker Compose

To ensure the project's stability and security, the latest stable versions of libraries and frameworks are used. The application is designed as a single-page application to support browser navigation. Compatibility is maintained with the latest stable Google Chrome and an additional web browser.

---

## Security

Security is a top priority in this project, and the following measures have been implemented:

- Passwords stored in the database are securely hashed.
- Protection against SQL injections is in place.
- Server-side validation for forms and user input is implemented.
- Sensitive information such as credentials and API keys are stored locally in a `.env` file and are ignored by Git to prevent exposure.

---

## User Account

- Users can log in using the OAuth system of 42 intranet.
- Customizable display names and avatars are available.
- Two-factor authentication options are supported.
- Users can add friends, view their status, and access their profiles.
- User profiles display stats, including wins, losses, ladder level, and achievements.
- Match History is available for review, including 1v1 games and ladder matches.

---

## Chat

The chat functionality includes the following features:

- Users can create public, private, or password-protected channels.
- Direct messaging between users is supported.
- Blocking other users is possible.
- Channel owners have control over channel access and permissions.
- Users can invite others to play Pong games through chat.
- Player profiles can be accessed through the chat interface.

---

## Game

The core feature of this website is live Pong gameplay:

- Users can play live Pong games against each other on the website.
- A matchmaking system allows users to queue and find opponents.
- The Pong game can be customized with options like power-ups and different maps.
- A default version of the game without extra features is available for those who prefer it.
- The game is designed to be responsive, considering network issues like disconnections and lag for a seamless user experience.


---

## Docker Deployment

### Prerequisites

Before deploying the project, ensure you have the following prerequisites installed:

- **Docker**: Make sure Docker is installed on your system.

### Running the Project with Docker

To simplify the deployment process, we've provided a `Makefile` that automates various tasks. Follow these steps to launch the project:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/ft_trancesandance.git
   cd ft_trancesandance
   ```

2. Create a ``.env`` file in the project root directory to store sensitive credentials and configurations. Be sure to include the necessary environment variables as specified in the project requirements.

3. Build and start the Docker containers using ``make``:
   ```bash
   make start
   ```
This command will initialize the backend, frontend, and database containers, ensuring that all dependencies are set up and running.

4. Once the containers are up and running, you can access the website by opening a web browser and navigating to http://localhost:81 
---

## Contributors

- [Taha El Mouhajir](https://github.com/paji1)
- [Soufiane Elkhamlichi](https://github.com/MGS15)
- [Mahmoud Meziani](https://github.com/7ach7ouch101)
- [Ouail Zahir](https://github.com/waelzahir)
- [Aeymne Echafii](https://github.com/Aymane-1)

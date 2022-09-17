# Favme

## _Favorite Link Storage Application_

Favme is an application that help you store favorite link based on your own self-created categories and labels,
with clear information and beautiful interface for your favorite links

## Tech

Favme uses a number of open source projects to work properly:

- [T3 Stack](https://github.com/t3-oss/create-t3-app) - Opinionated, full-stack, typesafe Next.js project.
- [Mongo DB](https://www.mongodb.com/) - A document database with the scalability and flexibility.
- [Material Taiwlind](https://www.material-tailwind.com/) - An easy to use components library for Tailwind CSS and Material Design.
- [Formik](https://formik.org/docs/overview) - Build form in React without tears.
- [Zustand](https://github.com/pmndrs/zustand) - 🐻 Bear necessities for state management in React!
- [Tauri](https://tauri.app/) - Build an optimized, secure, and frontend-independent application for multi-platform deployment.

## Installation

Favme requires [Node.js](https://nodejs.org/), [Rust](https://www.rust-lang.org/learn/get-started), [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2019) and [Yarn](https://yarnpkg.com/) to run.

Open command-line.

Install the dependencies and devDependencies and start the server.

```sh
cd favme-desktop
yarn install
```

Create your own .env file with DATABASE_URL which is MongoDB connection string.

Build and export the app.

```sh
yarn build && yarn export
```

Run the app.

```sh
yarn tauri dev
```

or open the file "run-favme.bat" to run the script automatically.

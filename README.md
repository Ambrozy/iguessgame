# I guess

A guessing game built with React and bundled using Vite.

Try it now: https://ambrozy.github.io/iguessgame/

## Running tests

```bash
npm test
```

## Running E2E tests with Docker

Build the Playwright image and execute the tests:

```bash
docker build -t iguessgame-playwright .
docker run --rm --ipc=host iguessgame-playwright
```

This allows running the same container image locally and in CI.

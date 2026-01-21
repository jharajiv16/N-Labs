# NirmanLabs — Backend-ready static site (minimal)

Quick steps to run the minimal Express server that serves the existing static frontend and accepts contact submissions.

1. Install dependencies

```bash
cd "./"
npm install
```

2. Start server

```bash
npm start
# open http://localhost:3000
```

Notes:
- Static frontend files are served from the `Html` folder at `/static`.
- Bootstrap assets are served at `/bootstrap` from the provided `bootstrap-5.3.8-dist` folder.
- The contact form posts to `/contact` and currently logs submissions to the server console. Replace with DB or email integration as needed.
# hey
# N-Labs

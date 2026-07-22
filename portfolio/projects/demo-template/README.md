# demo-template

Reference Angular application for new portfolio projects. It demonstrates:

- an independent application build;
- the shared `DemoShell` from `portfolio-ui`;
- runtime context and API URL construction from `portfolio-sdk`;
- environment-specific portfolio and API URLs;
- deployment below `/demos/demo-template/`.

Run the shell on port 4200 and this demo on port 4201:

```bash
npm start
npm run start:demo-template
```

Example URL:

```text
http://localhost:4201/?lang=fr&theme=dark&returnUrl=http%3A%2F%2Flocalhost%3A4200%2Ffr%2Fprojects
```

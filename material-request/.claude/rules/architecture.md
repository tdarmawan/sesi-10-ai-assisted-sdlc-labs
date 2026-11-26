---
paths:
  - "src/**/*.js"
---

Domain and quota import no infrastructure or framework. Service imports domain/quota only.
Inject repository into service. App composes dependencies and delegates routes.
Preserve baseline tests during refactoring. Do not implement quota until Lab 2C.
Run npm test and npm run lint:arch. Review the diff before each commit.

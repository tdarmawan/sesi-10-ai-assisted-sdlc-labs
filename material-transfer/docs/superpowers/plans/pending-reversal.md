# Plan reference — Enam task

Artifact trainer untuk dibandingkan sesudah peserta mencoba. Implementasi referensi disimpan dalam commit solusi; peserta berlatih commit per task.

1. Domain status/input/audit: src/domain.js dan src/service.js; failing test actor whitespace, invalid ID/SKU/qty, immutable response. `npm test`. Commit: feat: transfer status and audit.
2. Mutasi stok: cek insufficient stock sebelum perubahan; direct confirm idempotent; test state dan audit tetap saat error. `npm test`. Commit: fix: atomic stock mutation.
3. markPending: NEW→PENDING, tidak mengubah stock, retry tidak menambah event; invalid transition 409. `npm test`. Commit: feat: pending transfer.
4. resolve: PENDING→CONFIRMED; transferRef string, retry sama tidak mutate, ref berbeda 409. `npm test`. Commit: feat: resolve pending transfer.
5. reverse: CONFIRMED→REVERSED; reason, actor, restore sekali; test retry dan invalid state. `npm test`. Commit: feat: reverse transfer once.
6. HTTP dan demo: src/app.js, scripts/demo.mjs, test/transitions.test.js. Test lifecycle lewat server nyata. `npm test`, `npm run lint:arch`, `npm run demo`. Review diff, push ke fork, buka PR. Commit: feat: transfer endpoints and verification.

Jangan nyatakan skill/subagent reviewer sudah dijalankan tanpa bukti sesi peserta. Jangan merge otomatis.

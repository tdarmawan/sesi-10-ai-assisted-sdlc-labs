# Troubleshooting & alur PR

- `npm.ps1 cannot be loaded`: gunakan `npm.cmd`; tidak perlu mengubah execution policy.
- Port dipakai: hentikan server lama dengan Ctrl+C. Opsional PowerShell: `$env:PORT=3100` lalu `npm.cmd run dev`; shell POSIX: `PORT=3100 npm run dev`.
- HTTP 400: baca error; qty JSON harus number, tanggal valid, owner/actor nonblank.
- 422 kuota: total kategori/bulan melampaui batas; gunakan bulan baru atau status rejected untuk eksplorasi.
- Restart mereset data: ini sifat in-memory lab.
- File src/requests belum ada: Anda berada di starter; refactor dilakukan di Lab 2B.
- `npm run demo` belum tersedia di starter: jalankan setelah menyelesaikan Lab 3 atau di tag material-transfer-solution.
- Branch/checkpoint: `git fetch ./checkpoints.bundle "refs/tags/*:refs/tags/*"` dari root clone sebelum berganti branch; commit perubahan sebelum berpindah.
- CLI `gh` belum tersedia: gunakan tombol Compare & pull request di GitHub. Login browser tidak otomatis berarti `gh` sudah login.

## Publikasi hasil peserta

Fork repo ini ke akun sendiri terlebih dahulu, clone fork, lalu buat branch sesuai lab. Pastikan nama dan email Git milik sendiri (`git config user.name` dan `git config user.email`). Commit referensi yang dibuat untuk paket trainer memakai identitas bot latihan yang jelas, bukan identitas peserta.

```sh
npm test
npm run lint:arch
git status
git diff
git add .
git commit -m "feat: pending dan reversal transfer"
git push -u origin feat/nama-peserta-transfer
gh auth status
gh pr create --base main --head feat/nama-peserta-transfer
gh pr checks
```

Jika branch dimulai dari tag starter, pilih base perbandingan yang sesuai tujuan review di fork; branch default berisi solusi referensi. Untuk review perubahan dari starter, buat branch base di fork pada tag starter (misalnya `docs/transfer-base`) lalu gunakan sebagai `--base`. Jangan membuka PR ke repo trainer tanpa instruksi fasilitator. PR memakai branch hasil sendiri; jangan menjalankan perintah contoh sebelum mengganti nama branch.

Karena publikasi lewat browser, history remote terdiri dari commit unggahan; history tahap latihan berada dalam checkpoints.bundle.

CI berjalan pada push dan pull_request menggunakan Node 22/24, Linux dan Windows. Jangan merge sebelum hasil CI dan diff ditinjau.

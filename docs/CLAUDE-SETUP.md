# Claude Code & Superpowers

Diperiksa pada 26 November 2026. UI dan katalog plugin dapat berubah; catat versi yang benar-benar dipakai peserta.

1. Gunakan Claude Code CLI atau Code tab di Claude Desktop dengan akses akun yang sesuai.
2. Buka folder lab; baca command dan diff sebelum menyetujui tindakan. Pilih Manual atau Plan sesuai tahap.
3. Untuk Superpowers, pilih salah satu jalur pemasangan berikut.

Di prompt interaktif **Claude Code CLI** (bukan PowerShell):

```text
/plugin install superpowers@claude-plugins-official
```

Alternatif marketplace penerbit:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Di **terminal sistem**, alternatif CLI:

```sh
claude --version
claude plugin marketplace add obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace --scope user
claude plugin list
```

Di **Desktop**: sesi lokal → tombol + → Add plugins / Plugins → Browse plugins / Manage plugins (nama sesuai versi) → cari Superpowers. Mulai sesi baru setelah install dan verifikasi plugin tercantum. Plugin user/local pada komputer tidak otomatis tersedia di cloud; dukungan WSL/cloud berbeda, ikuti dokumentasi resmi.

Jangan memakai `claude plugin details` sebagai bukti standar. Gunakan `claude plugin list`, Installed di UI, dan sesi baru yang mengenali skill. Jangan menyalin output sukses, jumlah skill, biaya, atau token dari slide; ambil bukti dari mesin sendiri. Paket latihan ini tidak memasang atau menguji Claude Code/Superpowers pada komputer pengguna.

Contoh prompt pemasangan:

> Bantu pasang Superpowers dari obra/superpowers-marketplace untuk scope user. Periksa claude --version, jalankan command marketplace add dan plugin install setelah saya review, lalu claude plugin list. Jangan nyatakan berhasil tanpa output. Saya akan mulai sesi baru untuk memeriksa skill.

Rujukan: [Superpowers README](https://github.com/obra/superpowers), [Plugin overview](https://code.claude.com/docs/en/plugins/overview), [Install & manage](https://code.claude.com/docs/en/plugins/install), [Desktop](https://code.claude.com/docs/en/desktop), [Memory](https://code.claude.com/docs/en/memory), [Subagents](https://code.claude.com/docs/en/sub-agents).

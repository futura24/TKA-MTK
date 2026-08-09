# Simulasi TKA Matematika SMP

Website simulasi ujian TKA (Tes Kemampuan Akademik) Matematika SMP berbasis
web, dibuat menyerupai pengalaman CBT (Computer Based Test) resmi. Dibangun
dengan **React + TypeScript + Vite + Tailwind CSS + KaTeX**, seluruhnya
berjalan di sisi klien (tanpa backend) dan menyimpan progres di
`localStorage`.

Paket soal yang terpasang saat ini: **30 soal TKA Matematika SMP Tahun 2025**
(sumber: `Soal Asli TKA Matematika SMP Tahun 2025`, www.m4th-lab.net),
ditranskripsi langsung dari PDF sumber tanpa mengubah angka, pilihan
jawaban, gambar, atau struktur soal.

## Menjalankan proyek

Butuh Node.js 18+.

```bash
npm install
npm run dev       # mode pengembangan, http://localhost:5173
```

Untuk build produksi (folder `dist/`, bisa di-hosting sebagai static site,
atau dibuka via `npm run preview`):

```bash
npm run build
npm run preview   # http://localhost:4173
```

> Jangan membuka `dist/index.html` langsung lewat `file://` di browser -
> gunakan `npm run preview` atau server statis apa pun (mis. `npx serve dist`),
> karena aplikasi memakai path asset absolut (`/assets/...`).

## Struktur proyek

```
src/
├── components/     Header, Timer, QuestionCard, QuestionNavigator,
│                   QuestionOption, Stimulus, ImageViewer, ExamFooter,
│                   ConfirmSubmitModal, ResultCard, MathText, TrueFalseTable,
│                   DataTable
├── pages/          Home, Identity, Instructions, Exam, Result, Review
├── data/           questions.ts (30 soal), stimuli.ts (3 bacaan),
│                   examConfig.ts (judul, durasi, tahun paket soal)
├── hooks/          useExam.tsx (state ujian + Context), useTimer.ts
│                   (timer berbasis timestamp), useLocalStorage.ts
├── utils/          scoring.ts (scoring engine terpisah dari UI),
│                   questionUtils.ts, formatters.ts
└── types/          definisi TypeScript untuk soal & state ujian

public/assets/questions/   34 gambar asli (diekstrak dari PDF sumber)
```

## Mengganti paket soal (2025 → 2026, dst.)

Sesuai desain data-driven yang diminta: **tidak perlu mengubah kode
komponen UI sama sekali**.

1. Buat `src/data/questions-2026.ts` dan `src/data/stimuli-2026.ts` dengan
   struktur yang sama persis seperti `questions.ts` / `stimuli.ts`.
2. Ubah `src/data/examConfig.ts` (field `year`, `title`, dsb. jika perlu).
3. Ubah import di `src/data/questions.ts` dan `src/data/stimuli.ts` (atau
   ganti nama file) agar menunjuk ke data tahun yang baru.

Seluruh halaman, komponen, timer, navigator, dan scoring engine membaca
dari `questions.ts` / `stimuli.ts` / `examConfig.ts` secara otomatis.

## Kunci jawaban

**Seluruh 30 soal sudah memiliki kunci jawaban dan pembahasan**, bersumber
dari `KUNCI_JAWABAN.docx` yang diberikan pengguna. Halaman Hasil menghitung
skor sungguhan dari kunci ini, dan halaman Review menampilkan status
Benar/Salah per soal beserta pembahasannya.

**Perhatian - 3 soal (nomor 10, 19, 23) memiliki kunci jawaban resmi yang
tampak berlawanan dengan hasil perhitungan matematis langsung** saya:

- **Soal 10**: `3x + 17 ≤ 7 − 2x` menghasilkan `x ≤ −2`, yang secara notasi
  baku digambarkan dengan **titik tertutup** (bulatan penuh) di −2. Kunci
  resmi menunjuk opsi dengan titik **terbuka**, yang secara konvensi
  matematika biasanya dipakai untuk pertidaksamaan tegas (`<`), bukan `≤`.
- **Soal 19**: dengan asumsi 8 anak tangga pada gambar (150 cm datar,
  8×25=200 cm tegak), Pythagoras memberi hipotenusa 250 cm → sisa paling
  sedikit ada pada kayu meranti (400 cm). Kunci resmi menunjuk pagar besi
  (550 cm) - kemungkinan jumlah anak tangga pada gambar sumber sebenarnya
  berbeda dari asumsi 8 buah.
- **Soal 23**: volume tangki (1.760 L) dikurangi pemakaian 300 botol
  (600 L) menghasilkan sisa 1.160 L, yang **habis tanpa sisa** oleh 232
  jeriken (1.160 ÷ 5 = 232 persis). Kunci resmi tetap mencentang pernyataan
  "sisa cukup untuk 1 botol lagi" sebagai benar.

Kunci jawaban untuk ketiga soal ini **tetap dipakai sesuai
`KUNCI_JAWABAN.docx`** (tidak diubah sepihak oleh saya), namun catatan
ketidaksesuaiannya sengaja ditulis di field `explanation` masing-masing
soal (juga tampil di halaman Review, ditandai `[Catatan: ...]`) agar mudah
diverifikasi ulang terhadap gambar/berkas sumber asli. Silakan cek kembali
ketiga nomor ini terhadap gambar sumber resminya bila memungkinkan.

Format `answerKey` per tipe soal (untuk referensi bila ingin mengoreksi):
- `single-choice` → `"A"` (satu huruf pilihan)
- `multiple-choice` → `["A", "D"]`
- `true-false` / `matching` → `{ "s1": "Benar", "s2": "Salah", "s3": "Benar" }`
  (key harus sama dengan `id` pada `statements`)


## Gambar & aset

Semua 34 gambar (voucher cashback, grafik, diagram sudut, jaring-jaring
prisma, tangki minyak, dsb.) diekstrak langsung dari PDF sumber
(`pdfimages`) dan disimpan di `public/assets/questions/`, lalu dipetakan
manual ke soal yang bersesuaian berdasarkan isi PDF halaman per halaman.
Tidak ada gambar yang dibuat ulang/direka-reka.

Dua diagram vektor (bukan gambar raster di PDF) direkonstruksi ulang
sebagai SVG/komponen: tidak ada - seluruh 34 aset yang dipakai memang aset
raster asli dari PDF. Empat opsi garis bilangan soal nomor 10 dan empat
opsi diagram garis soal nomor 25 masing-masing adalah gambar terpisah asli
dari PDF (bukan direka ulang).

## Status implementasi vs. spesifikasi (Prioritas 1-5)

| Prioritas | Item | Status |
|---|---|---|
| 1 | Exam engine, question rendering, answer input, navigasi soal | ✅ |
| 2 | Timer (berbasis timestamp), auto-save (localStorage), bookmark, submit | ✅ |
| 3 | Result, scoring engine, review | ✅ (skor menunggu kunci jawaban resmi - lihat catatan di atas) |
| 4 | Stimulus/bacaan bersama, gambar asli, math rendering (KaTeX) | ✅ |
| 5 | Struktur data admin-ready (`adminData` opsional di tipe `Question`), analytics dasar (hasil per elemen) | ✅ (dasar) |

Tipe soal yang didukung mesin: `single-choice`, `multiple-choice`,
`true-false` (dipakai juga untuk variasi label seperti
Mungkin/Tidak Mungkin, Fungsi/Bukan Fungsi, Bisa/Tidak Bisa ditanami -
lihat `trueFalseLabels` per soal). Tipe `matching`, `numeric`, dan
`short-answer` sudah didefinisikan di tipe data dan didukung scoring
engine, namun tidak ada soal pada paket 2025 yang memakainya sehingga
belum ada komponen input khusus untuk itu di UI (tidak dibutuhkan oleh
paket soal saat ini).

## Fitur

- Landing page, form identitas (dengan validasi), halaman petunjuk,
  layout ujian CBT (soal kiri, navigator kanan / drawer di mobile)
- Timer dengan warna berubah (>30 menit normal, 10-30 menit kuning,
  <10 menit merah + soal belum dijawab ikut ditandai merah di navigator),
  auto-submit saat waktu habis
- Auto-save jawaban ke `localStorage` per perubahan + toast "Jawaban
  tersimpan"; identitas, jawaban, nomor soal terakhir, dan timer tetap
  terjaga walau halaman di-refresh
- Navigator soal dengan status warna + ringkasan terjawab/belum/ditandai
- Modal konfirmasi submit dengan ringkasan & peringatan soal
  belum dijawab/ditandai
- Halaman hasil dengan kartu skor + analisis per elemen (progress bar)
- Halaman review dengan filter per elemen (Semua/Bilangan/Aljabar/
  Geometri & Pengukuran/Data & Peluang)
- Lightbox untuk memperbesar gambar soal
- Kontrol ukuran font soal (kecil/sedang/besar)
- Keyboard shortcut: ← / → pindah soal, `M` tandai soal, `N` buka
  navigator
- Reset simulasi (dengan konfirmasi) dari halaman hasil
- Responsive (mobile, tablet, desktop) dan mengikuti prinsip
  "Exam First Design"

## Keamanan kunci jawaban

Karena ini aplikasi frontend murni/static (tanpa backend), begitu
`answerKey` diisi di `data/questions.ts`, nilai tersebut ikut ter-bundle ke
JavaScript yang dikirim ke browser peserta - sehingga **tidak bisa dijamin
kerahasiaannya sepenuhnya** karena source code dapat diperiksa siapa pun
lewat DevTools. Untuk simulasi latihan mandiri risiko ini biasanya dapat
diterima, tetapi jika suatu saat dibutuhkan kerahasiaan kunci jawaban yang
ketat (mis. untuk ujian sungguhan), `answerKey` perlu dipindahkan ke
backend/API terpisah yang baru mengembalikan hasil penilaian, bukan kunci
mentah, ke klien.

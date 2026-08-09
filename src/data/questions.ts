import type { Question } from '../types'

// Path gambar mengacu ke /public/assets/questions/ (lihat vite public dir)
const A = `${import.meta.env.BASE_URL}assets/questions`.replace(/\/{2,}/g, '/')

// ============================================================
// CATATAN PENTING (lihat juga README.md):
// Kunci jawaban & pembahasan seluruh 30 soal bersumber dari file
// KUNCI_JAWABAN.docx yang diunggah pengguna (dicocokkan secara berurutan
// dengan struktur penomoran list pada dokumen tersebut, satu nomor list
// baru = satu soal, item lanjutan tanpa nomor baru = pilihan/pernyataan
// tambahan pada soal yang sama).
//
// PERHATIAN - 3 soal memiliki kunci jawaban resmi yang tampak berlawanan
// dengan hasil perhitungan matematis langsung (sudah dicatat di field
// `explanation` masing-masing, ditandai [Catatan: ...], TIDAK disembunyikan):
//   - Soal 10: hasil aljabar (x ≤ −2) baku digambarkan titik TERTUTUP,
//     namun kunci resmi menunjuk opsi dengan titik terbuka.
//   - Soal 19: dengan asumsi 8 anak tangga, hasil Pythagoras (250 cm)
//     mengarah ke kayu meranti, namun kunci resmi menunjuk pagar besi.
//   - Soal 23: perhitungan volume menghasilkan sisa tangki tepat 0 liter
//     (habis oleh jeriken), namun kunci resmi tetap mencentang pernyataan
//     "sisa cukup untuk 1 botol lagi" sebagai benar.
// Kunci-kunci di atas TETAP dipakai sesuai file kunci jawaban yang
// diberikan (tidak diubah sepihak), namun catatan ketidaksesuaiannya
// sengaja ditampilkan agar dapat diverifikasi ulang terhadap gambar/berkas
// sumber asli bila diperlukan.
// ============================================================

export const questions: Question[] = [
  {
    id: 1,
    number: 1,
    code: '25MATBLGBRLM38SP-000000-2020',
    element: 'Bilangan',
    subelement: 'Bilangan Real',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait perbandingan dan sifat-sifat bilangan',
    indicator: 'Menyelesaikan operasi bilangan bentuk pangkat',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Hasil dari operasi bilangan berpangkat berikut adalah ....\n\n$$\\dfrac{7^{3} \\times 7^{-4}}{7^{2}}$$',
    options: [
      { id: 'A', text: '$7^{-9}$' },
      { id: 'B', text: '$7^{-6}$' },
      { id: 'C', text: '$7^{-3}$' },
      { id: 'D', text: '$7$' },
    ],
    answerKey: "C",
    explanation: "Sifat pembagian eksponen basis sama: pangkat pembilang dikurangi pangkat penyebut. (7³ × 7⁻⁴) / 7² = 7^(3 + (−4) − 2) = 7⁻³.",
  },
  {
    id: 2,
    number: 2,
    code: '23NUM22BILOPRB29K8-232403-7247',
    element: 'Bilangan',
    subelement: 'Bilangan Real',
    competency:
      'Melakukan operasi hitung pada berbagai jenis bilangan yang meliputi bilangan bulat, pecahan, desimal, persen, dan bilangan berpangkat bulat.',
    indicator: 'Menyelesaikan permasalahan menggunakan operasi bilangan',
    stimulusId: 'bacaan-1',
    type: 'multiple-choice',
    question:
      'Rina akan membeli hadiah untuk dua orang temannya. Hadiahnya akan dikirim ke alamat masing-masing sehingga Rina harus melakukan dua kali transaksi. Setiap satu kali transaksi, Rina dapat memilih satu *voucher cashback*. Setiap *voucher* hanya dapat digunakan satu kali. Hadiah yang dikirim harganya sama yaitu Rp50.000,00. Jika Rina menginginkan *cashback* lebih dari Rp10.000,00, *voucher* mana sajakah yang harus ia pilih?\n\nKlik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.',
    options: [
      { id: 'A', text: 'Voucher A' },
      { id: 'B', text: 'Voucher B' },
      { id: 'C', text: 'Voucher C' },
      { id: 'D', text: 'Voucher D' },
    ],
    answerKey: ["A", "D"],
    explanation: "Voucher A: 25% × Rp50.000 = Rp12.500 (di bawah batas Rp100.000) → cashback Rp12.500, lebih dari Rp10.000. Voucher D: 40% × Rp50.000 = Rp20.000 (di bawah batas Rp20.000) → cashback Rp20.000, memenuhi. Voucher B (Rp2.500) dan C (Rp5.000) tidak memenuhi syarat lebih dari Rp10.000.",
  },
  {
    id: 3,
    number: 3,
    code: '23NUM22BILOPRB29K8-232403-7219',
    element: 'Bilangan',
    subelement: 'Bilangan Real',
    competency:
      'Melakukan operasi hitung pada berbagai jenis bilangan yang meliputi bilangan bulat, pecahan, desimal, persen, dan bilangan berpangkat bulat.',
    indicator:
      'Menganalisis/mengevaluasi beberapa pernyataan berkaitan dengan operasi bilangan berdasarkan informasi',
    stimulusId: 'bacaan-1',
    type: 'true-false',
    question:
      'Rina memiliki *voucher* A, B, dan D yang bisa ia gunakan untuk berbelanja *online*. Tentukan benar atau salah pernyataan berikut ini berkaitan dengan nominal transaksi Rina dan *voucher* yang seharusnya ia gunakan untuk mendapatkan *cashback* terbesar! Klik pada kotak yang sesuai!',
    trueFalseLabels: ['Benar', 'Salah'],
    statements: [
      {
        id: 's1',
        text: 'Checkout menggunakan Voucher D dengan total belanja Rp50.000,00.',
        image: `${A}/soal3_checkout_d.jpg`,
      },
      {
        id: 's2',
        text: 'Checkout menggunakan Voucher B dengan total belanja Rp200.000,00.',
        image: `${A}/soal3_checkout_b.jpg`,
      },
      {
        id: 's3',
        text: 'Checkout menggunakan Voucher A dengan total belanja Rp2.500.000,00.',
        image: `${A}/soal3_checkout_a.jpg`,
      },
    ],
    answerKey: { "s1": "Benar", "s2": "Salah", "s3": "Salah" },
    explanation: "Voucher D, total Rp50.000: 25% × 50.000 = Rp12.500 (BENAR, ini yang terbesar). Voucher B, total Rp200.000: 5% × 200.000 = Rp10.000, bukan yang terbesar (SALAH). Voucher A, total Rp2.500.000: 25% × 2.500.000 = Rp625.000, tetapi dibatasi maksimal Rp100.000 (SALAH).",
  },
  {
    id: 4,
    number: 4,
    code: '24NUM22BILSURB12K8-000000-2206',
    element: 'Bilangan',
    subelement: 'Bilangan Real',
    competency:
      'Mengurutkan bilangan termasuk bilangan bulat negatif, desimal, persentase dan pecahan',
    indicator:
      'Mengurutkan bilangan termasuk bilangan bulat dan bilangan desimal desimal, berdasarkan informasi',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Buah merupakan salah satu sumber vitamin C. Buah yang banyak mengandung vitamin C biasanya memiliki rasa masam dan warna cerah.\n\nSelain itu, buah yang mengandung vitamin C juga biasanya identik dengan buah yang banyak mengandung air.\n\nNamun, apakah itu benar? Apakah semakin berat dan semakin berair suatu buah maka kandungan vitamin C-nya semakin banyak?\n\nUntuk mengetahui hal tersebut, tim peneliti akan menguji kandungan vitamin C yang dimiliki suatu buah dengan ukuran dan kandungan air yang beragam. Berikut disajikan data terkait ukuran dan kandungan air keempat buah tersebut.',
    table: {
      headers: ['Buah', 'Berat (gr)', 'Kandungan air (mL)'],
      rows: [
        ['Buah A', '118,4', '96,3'],
        ['Buah B', '130,7', '150'],
        ['Buah C', '130,55', '140'],
        ['Buah D', '96,255', '118,15'],
      ],
    },
    options: [
      { id: 'A', text: 'Buah A' },
      { id: 'B', text: 'Buah B' },
      { id: 'C', text: 'Buah C' },
      { id: 'D', text: 'Buah D' },
    ],
    answerKey: "B",
    explanation: "Buah B memiliki berat 130,7 gr (terbesar) dan kandungan air 150 mL (terbanyak) sekaligus, sehingga Buah B yang diteliti pertama.",
  },
  {
    id: 5,
    number: 5,
    code: '24NUM22BILREPB04K8-000000-5792',
    element: 'Bilangan',
    subelement: 'Bilangan Real',
    competency: 'Memahami bilangan bulat, bilangan berpangkat, dan bentuk akar',
    indicator: 'Menentukan lambang bilangan lain dari suatu bilangan',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Pada beberapa jenis makanan, suhu penyimpanan yang terlalu tinggi dapat menyebabkan makanan tersebut menjadi cepat basi.\n\nGambar di bawah ini menunjukkan berbagai suhu penyimpanan makanan di dalam lemari pendingin menurut Departemen Pertanian Amerika Serikat (FDA).\n\n**Catatan:** Daging unggas adalah daging yang berasal dari burung ternak seperti ayam, merpati, dan sebagainya. Daging merah adalah daging yang berasal dari mamalia ternak seperti sapi, kambing, dan sebagainya.\n\nBerdasarkan saran FDA, berapa suhu lemari pendingin yang direkomendasikan untuk menyimpan daging ayam?',
    image: `${A}/soal5_suhu.jpg`,
    options: [
      { id: 'A', text: '18 derajat di bawah 0 °C' },
      { id: 'B', text: '18 derajat di atas 0 °C' },
      { id: 'C', text: '19 derajat di bawah 0 °C' },
      { id: 'D', text: '19 derajat di atas 0 °C' },
    ],
    answerKey: "C",
    explanation: "Daging ayam termasuk daging unggas. Rekomendasi FDA untuk daging unggas adalah −19°C, yaitu 19 derajat di bawah 0°C.",
  },
  {
    id: 6,
    number: 6,
    code: '25MATALJALBM47SP-000000-2032',
    element: 'Aljabar',
    subelement: 'Bentuk Aljabar',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait bentuk aljabar dan sifat-sifat operasinya (komutatif, asosiatif, dan distributif)',
    indicator: 'Mengidentifikasi unsur-unsur pembentuk suatu bentuk aljabar.',
    stimulusId: null,
    type: 'true-false',
    question:
      'Diketahui bentuk aljabar berikut ini.\n\n$$2ab - b^{2} + 3a^{2}b + ab^{2} - 5$$\n\nBerdasarkan informasi tersebut, manakah di antara pernyataan berikut ini yang benar? Tentukan Benar atau Salah pada setiap pernyataan berikut terkait bentuk aljabar tersebut!',
    trueFalseLabels: ['Benar', 'Salah'],
    statements: [
      { id: 's1', text: 'Terdapat 2 variabel yaitu a dan b.' },
      { id: 's2', text: 'Konstanta pada bentuk aljabar tersebut adalah 5.' },
      { id: 's3', text: 'Bilangan 2, −1, 3, dan 1 merupakan koefisien.' },
    ],
    answerKey: { "s1": "Benar", "s2": "Salah", "s3": "Benar" },
    explanation: "Pada 2ab − b² + 3a²b + ab² − 5: hanya variabel a dan b yang muncul (BENAR). Konstanta adalah −5, bukan 5 (SALAH). Koefisien suku-suku bervariabel adalah 2, −1, 3, dan 1 sesuai pernyataan (BENAR).",
  },
  {
    id: 7,
    number: 7,
    code: '25MATALJFNGM48SP-000000-1920',
    element: 'Aljabar',
    subelement: 'Fungsi',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait relasi dan fungsi (domain, kodomain, range) dan penyajiannya',
    indicator:
      'Mengelompokkan berbagai bentuk penyajian relasi ke dalam fungsi atau bukan fungsi.',
    stimulusId: null,
    type: 'true-false',
    question:
      'Perhatikan diagram panah berikut ini.\n\nApakah diagram 1, diagram 2, dan diagram 3 merupakan fungsi? Tentukan fungsi atau bukan fungsi pada setiap diagram berikut!',
    image: `${A}/soal7_diagram.jpg`,
    trueFalseLabels: ['Fungsi', 'Bukan Fungsi'],
    statements: [
      { id: 's1', text: 'Diagram 1' },
      { id: 's2', text: 'Diagram 2' },
      { id: 's3', text: 'Diagram 3' },
    ],
    answerKey: { "s1": "Bukan Fungsi", "s2": "Bukan Fungsi", "s3": "Fungsi" },
    explanation: "Diagram 1: elemen 9 tidak memiliki pasangan (tidak ada panah keluar) — Bukan Fungsi. Diagram 2: elemen 13 memiliki dua panah keluar ke dua elemen B berbeda — Bukan Fungsi. Diagram 3: setiap elemen domain (5, 9, 13, 17) masing-masing memiliki tepat satu panah keluar — Fungsi.",
  },
  {
    id: 8,
    number: 8,
    code: '24NUM22ALJRDFA11K8-000000-5827',
    element: 'Aljabar',
    subelement: 'Fungsi',
    competency:
      'Menyajikan, menganalisis, dan menyelesaikan masalah dengan menggunakan relasi, fungsi dan persamaan linear beserta grafiknya.',
    indicator:
      'Menginterpretasi grafik fungsi linear dan memberikan beberapa kesimpulan menggunakan konsep relasi, fungsi, persamaan linear dan grafiknya.',
    stimulusId: null,
    type: 'true-false',
    question:
      'Pembayaran air PDAM setiap rumah berbeda-beda tergantung banyaknya pemakaian air. Biaya pemasangan awal adalah Rp800.000,00. Tarif pemakaian air berdasarkan banyak air yang digunakan dengan pemasangan awal dapat dilihat pada grafik berikut.\n\nSeseorang menghabiskan biaya Rp920.000,00 dalam 1 bulan pemakaian dengan pemasangan baru.\n\nBerdasarkan informasi tersebut, manakah di antara pernyataan berikut ini yang benar? Tentukan Benar atau Salah pada setiap pernyataan berikut terkait kondisi tersebut!',
    image: `${A}/soal8_grafik.jpg`,
    trueFalseLabels: ['Benar', 'Salah'],
    statements: [
      { id: 's1', text: 'Jumlah pemakaian air mencapai 60 m³.' },
      {
        id: 's2',
        text: 'Orang tersebut akan menghabiskan biaya sebesar Rp120.000,00 jika tanpa pemasangan baru.',
      },
      {
        id: 's3',
        text: 'Tarif dapat mencapai 1 juta jika pemakaian air kurang dari 90 m³ dengan pemasangan baru.',
      },
    ],
    answerKey: { "s1": "Benar", "s2": "Benar", "s3": "Salah" },
    explanation: "Dari grafik: y = 2.000x + 800.000. Pernyataan 1: 920.000 = 2.000x + 800.000 → x = 60 m³ (BENAR). Pernyataan 2: tanpa pemasangan awal, biaya = 2.000 × 60 = Rp120.000 (BENAR). Pernyataan 3: agar y = 1.000.000, dibutuhkan x = 100 m³, bukan kurang dari 90 m³ (SALAH).",
  },
  {
    id: 9,
    number: 9,
    code: '24NUM22GEOPSPG21K8-000000-5857',
    element: 'Aljabar',
    subelement: 'Fungsi',
    competency: 'Menggunakan sistem koordinat kartesius',
    indicator: 'Menyelesaikan permasalahan dengan menerapkan konsep sistem koordinat kartesius',
    stimulusId: null,
    type: 'true-false',
    question:
      '**Pekarangan Rumah**\n\nAyunda mulai memanfaatkan lahan kosong di pekarangan rumahnya untuk menanam berbagai jenis tanaman. Setelah melihat tanamannya tumbuh subur, ia berencana untuk menanam pohon mangga di pekarangan tersebut. Berikut adalah peta pekarangan rumah Ayunda.\n\nDalam menentukan lokasi penanaman, Ayunda harus mempertimbangkan beberapa faktor penting yaitu ketersediaan sinar matahari dan kualitas tanah. Berdasarkan beberapa faktor tersebut, Ayunda hanya akan menanam pohon mangga di lokasi 1, 3, dan 4 hanya pada lahan yang masih kosong (belum ada tanaman lain) di lokasi tersebut.\n\nBerdasarkan hal tersebut, pada koordinat mana sajakah Ayunda bisa menanam pohon mangga? Tentukan "Bisa ditanami pohon mangga" atau "Tidak bisa ditanami pohon mangga" untuk beberapa koordinat berikut ini!',
    image: `${A}/soal9_peta.jpg`,
    trueFalseLabels: ['Bisa ditanami pohon mangga', 'Tidak bisa ditanami pohon mangga'],
    statements: [
      { id: 's1', text: '(9, −2)' },
      { id: 's2', text: '(−2, 9)' },
      { id: 's3', text: '(−9, −9)' },
    ],
    answerKey: { "s1": "Bisa ditanami pohon mangga", "s2": "Bisa ditanami pohon mangga", "s3": "Tidak Bisa ditanami pohon mangga" },
    explanation: "(9, −2) berada di Lokasi 4 pada lahan yang masih kosong → Bisa ditanami. (−2, 9) berada di lokasi yang termasuk area diizinkan dan lahannya masih kosong → Bisa ditanami. (−9, −9) berada pada petak yang sudah ditanami tanaman lain di Lokasi 3 → Tidak Bisa ditanami.",
  },
  {
    id: 10,
    number: 10,
    code: '25MATALJPSLM45SP-000000-2026',
    element: 'Aljabar',
    subelement: 'Persamaan dan Pertidaksamaan Linear',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait pertidaksamaan linear satu variabel',
    indicator:
      'Menyatakan grafik penyelesaian pertidaksamaan linear satu variabel pada garis bilangan.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Diketahui pertidaksamaan sebagai berikut.\n\n$$3x + 17 \\le 7 - 2x$$\n\nManakah garis bilangan yang menunjukkan himpunan penyelesaian dari pertidaksamaan tersebut?',
    options: [
      { id: 'A', text: '', image: `${A}/soal10_a.png` },
      { id: 'B', text: '', image: `${A}/soal10_b.png` },
      { id: 'C', text: '', image: `${A}/soal10_c.png` },
      { id: 'D', text: '', image: `${A}/soal10_d.jpg` },
    ],
    answerKey: "C",
    explanation: "[Catatan: hasil aljabar 3x+17≤7−2x memberikan x≤−2, yang secara matematis baku digambarkan dengan titik TERTUTUP (bulatan penuh) di −2 dan arsiran ke kiri. Kunci jawaban resmi menyatakan opsi C (titik terbuka di −2, arsiran ke kiri) — mohon dicek kembali terhadap gambar sumber asli, karena representasi titik terbuka biasanya dipakai untuk pertidaksamaan tegas (<), bukan ≤.]",
  },
  {
    id: 11,
    number: 11,
    code: '22NUM22ALJPTPA04K8-000000-5784',
    element: 'Aljabar',
    subelement: 'Persamaan dan Pertidaksamaan Linear',
    competency:
      'Menyelesaikan persamaan dan pertidaksamaan linier 1 variabel serta sistem persamaan linear 2 variabel.',
    indicator:
      'Menyelesaikan permasalahan terkait informasi tersebut menggunakan konsep sistem persamaan linier 2 variabel.',
    stimulusId: null,
    type: 'single-choice',
    question:
      '**Jajanan Tradisional**\n\nJajanan tradisional merupakan makanan khas dari nenek moyang dan biasanya digunakan untuk acara atau tradisi. Seiring berjalannya waktu, jajanan tradisional bisa dijumpai dan ditemukan setiap hari tidak hanya saat acara tertentu.\n\nBerikut merupakan harga jajanan tradisional kue putu mayang dan kue pancong yang dijual di sebuah bazar makanan.\n\nBerapa harga 3 kotak kue putu mayang dan 1 kotak kue pancong?',
    images: [`${A}/soal11_kue.jpg`, `${A}/soal11_keterangan.jpg`],
    options: [
      { id: 'A', text: 'Rp10.000,00.' },
      { id: 'B', text: 'Rp14.000,00.' },
      { id: 'C', text: 'Rp44.000,00.' },
      { id: 'D', text: 'Rp52.000,00.' },
    ],
    answerKey: "C",
    explanation: "Diselesaikan dengan sistem persamaan linear dua variabel dari kombinasi kotak kue putu mayang dan kue pancong pada kedua paket harga (Rp58.000,00 dan Rp62.000,00). Hasilnya: 3 kotak kue putu mayang + 1 kotak kue pancong = Rp44.000,00.",
  },
  {
    id: 12,
    number: 12,
    code: '25MATALJALBM47SP-000000-1998',
    element: 'Aljabar',
    subelement: 'Bentuk Aljabar',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait bentuk aljabar dan sifat-sifat operasinya (komutatif, asosiatif, dan distributif).',
    indicator: 'Memodelkan masalah kontekstual ke dalam bentuk aljabar menggunakan sifat-sifat operasinya.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Rino, Tiko, dan Bayu pergi ke toko buku dekat rumahnya untuk membeli buku tulis dan pulpen keperluan sekolah. Berikut banyak buku tulis dan pulpen yang dibeli oleh setiap anak.\n\n**Keterangan:**\n- Rino membeli 4 buah buku tulis dan 3 buah pulpen.\n- Tiko membeli dua kali lipat dari masing-masing jumlah buku dan pulpen yang dibeli oleh Rino.\n- Bayu membeli tiga kali lipat dari masing-masing jumlah buku dan pulpen yang dibeli oleh Rino.\n\nApabila harga 1 buku tulis disimbolkan dengan "x" dan harga 1 pulpen disimbolkan dengan "y", bagaimana kalimat matematika yang menyatakan total harga yang harus dibayar oleh ketiga anak tersebut?',
    image: `${A}/soal12_rino.png`,
    options: [
      { id: 'A', text: '$24x + 18y$' },
      { id: 'B', text: '$20x + 15y$' },
      { id: 'C', text: '$12x + 9y$' },
      { id: 'D', text: '$4x + 3y$' },
    ],
    answerKey: "A",
    explanation: "Rino: 4x+3y. Tiko: 2(4x+3y)=8x+6y. Bayu: 3(4x+3y)=12x+9y. Total = (4x+3y)+(8x+6y)+(12x+9y) = 24x+18y.",
  },
  {
    id: 13,
    number: 13,
    code: '25MATALJFNGM48SP-000000-3183',
    element: 'Aljabar',
    subelement: 'Fungsi',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait relasi dan fungsi (domain, kodomain, range) dan penyajiannya.',
    indicator:
      'Menentukan rumus fungsi linear berdasarkan himpunan pasangan berurutan dari masalah kontekstual.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Naura menggunakan operator seluler "Nusantara Mobile". Terdapat beberapa pilihan paket kuota internet yang dapat dipilih oleh pelanggannya. Naura menuliskan pilihan paket kuota yang tersedia dan harganya dalam bentuk himpunan pasangan berurutan sebagai berikut.\n\nCatatan tersebut ditulis dalam bentuk (paket kuota internet dalam gigabyte (GB), harga dalam rupiah). Sebagai contoh, (5, 14.000) memiliki arti bahwa paket kuota internet 5 GB dikenakan harga sebesar Rp14.000,00.\n\nJika $x$ adalah paket kuota internet dalam GB, rumus fungsi $f(x)$ yang menyatakan harga paket kuota internet adalah ....',
    image: `${A}/soal13_kuota.jpg`,
    options: [
      { id: 'A', text: '$f(x) = 2.000x + 4.000$' },
      { id: 'B', text: '$f(x) = 2.000x + 1.000$' },
      { id: 'C', text: '$f(x) = 1.800x + 9.000$' },
      { id: 'D', text: '$f(x) = 1.800x + 5.000$' },
    ],
    answerKey: "D",
    explanation: "Gradien dari titik (5,14.000) dan (10,23.000) = (23.000−14.000)/(10−5) = 1.800. Substitusi ke f(x)=1.800x+c dengan (5,14.000): c=5.000. Jadi f(x)=1.800x+5.000.",
  },
  {
    id: 14,
    number: 14,
    code: '24NUM22ALJRDFA09K8-241309-6831',
    element: 'Aljabar',
    subelement: 'Barisan dan Deret',
    competency: 'Menggeneralisasi pola barisan bilangan dan konfigurasi objek',
    indicator:
      'Menentukan suku ke-n (lebih dari 3 suku berikutnya dari yang diketahui) dari pola bilangan berdasarkan konfigurasi objek tersebut.',
    stimulusId: 'bacaan-2',
    type: 'single-choice',
    question:
      'Jika ingin dibuat pagar dengan 10 tingkat susunan batu bata, berapakah jumlah total batu bata (segitiga maupun persegi panjang) yang ada pada tingkat ke-10 dari pagar tersebut?',
    options: [
      { id: 'A', text: '10 batu bata' },
      { id: 'B', text: '11 batu bata' },
      { id: 'C', text: '20 batu bata' },
      { id: 'D', text: '21 batu bata' },
    ],
    answerKey: "D",
    explanation: "Pola jumlah batu bata (segitiga + persegi panjang) pada tingkat ke-n mengikuti 2n+1. Untuk tingkat ke-10: 2(10)+1 = 21 batu bata.",
  },
  {
    id: 15,
    number: 15,
    code: '24NUM22ALJRDFA09K8-241309-6859',
    element: 'Aljabar',
    subelement: 'Barisan dan Deret',
    competency: 'Menggeneralisasi pola barisan bilangan dan konfigurasi objek',
    indicator: 'Menyelesaikan permasalahan terkait pola bilangan berdasarkan konfigurasi objek.',
    stimulusId: 'bacaan-2',
    type: 'true-false',
    question:
      'Dua pagar yang sama persis dengan masing-masing memiliki 9 tingkat akan dibangun. Tetapi hanya ada persediaan sebanyak 60 batu bata segitiga dan 80 batu bata persegi panjang. Apakah jumlah kedua jenis batu bata tersebut cukup untuk membuat kedua pagar? Tentukan Benar atau Salah pada setiap pernyataan berikut!',
    trueFalseLabels: ['Benar', 'Salah'],
    statements: [
      { id: 's1', text: 'Diperlukan tambahan 15 batu bata segitiga.' },
      { id: 's2', text: 'Diperlukan tambahan 28 batu bata persegi panjang.' },
      {
        id: 's3',
        text: 'Diperlukan tambahan total sebanyak 43 batu bata baik segitiga maupun persegi panjang.',
      },
    ],
    answerKey: { "s1": "Salah", "s2": "Benar", "s3": "Salah" },
    explanation: "Untuk 2 pagar 9 tingkat: kebutuhan segitiga=90, tambahan=90−60=30 (bukan 15 → SALAH). Kebutuhan persegi panjang=108, tambahan=108−80=28, sesuai (BENAR). Tambahan total=30+28=58 (bukan 43 → SALAH).",
  },
  {
    id: 16,
    number: 16,
    code: '25MATGMPGEOM50SP-000000-1955',
    element: 'Geometri dan Pengukuran',
    subelement: 'Objek Geometri',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan, dan oleh dua garis sejajar yang dipotong suatu garis transversal (termasuk penentuan besar sudut dalam segitiga)',
    indicator:
      'Menentukan nilai variabel pada sudut yang terbentuk dari dua garis berpotongan menggunakan hubungan antar-sudut.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Garis AB dan garis PQ berpotongan di titik Q seperti gambar berikut.\n\nNilai x yang tepat adalah ....',
    image: `${A}/soal16_sudut.png`,
    options: [
      { id: 'A', text: '$15°$' },
      { id: 'B', text: '$24°$' },
      { id: 'C', text: '$69°$' },
      { id: 'D', text: '$96°$' },
    ],
    answerKey: "B",
    explanation: "Sudut 72° dan (4x+12)° berpelurus (membentuk garis lurus AB): 72+(4x+12)=180 → 4x=96 → x=24.",
  },
  {
    id: 17,
    number: 17,
    code: '25MATGMPGEOM53SP-000000-1934',
    element: 'Geometri dan Pengukuran',
    subelement: 'Objek Geometri',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait jaring-jaring bangun ruang (prisma, tabung, limas dan kerucut).',
    indicator:
      'Menginterpretasikan posisi masing-masing sisi pada jaring-jaring prisma yang dibentuk menjadi bangun ruang.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Perhatikan gambar jaring-jaring prisma segitiga berikut.\n\nSisi tutup pada prisma tersebut adalah sisi ABC. Rusuk AC pada sisi tutup akan berhimpit dengan salah satu rusuk pada sisi tegak prisma nomor ....',
    image: `${A}/soal17_jaring.jpg`,
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '2' },
      { id: 'C', text: '3' },
      { id: 'D', text: '4' },
    ],
    answerKey: "C",
    explanation: "Berdasarkan penelusuran arah lipatan jaring-jaring: rusuk AC pada sisi tutup ABC akan berhimpit dengan salah satu rusuk pada sisi tegak nomor 3 setelah jaring-jaring dilipat menjadi prisma.",
  },
  {
    id: 18,
    number: 18,
    code: '25MATGMPGEOM50SP-000000-2033',
    element: 'Geometri dan Pengukuran',
    subelement: 'Objek Geometri',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan, dan oleh dua garis sejajar yang dipotong suatu garis transversal (termasuk penentuan besar sudut dalam segitiga)',
    indicator:
      'Menentukan besar sudut pada gabungan segitiga dan dua garis sejajar menggunakan hubungan antar-sudut.',
    stimulusId: null,
    type: 'single-choice',
    question: 'Perhatikan gambar berikut ini!\n\nBerdasarkan gambar tersebut, berapa nilai b?',
    image: `${A}/soal18_sejajar.jpg`,
    options: [
      { id: 'A', text: '46' },
      { id: 'B', text: '68' },
      { id: 'C', text: '112' },
      { id: 'D', text: '134' },
    ],
    answerKey: "A",
    explanation: "Berdasarkan hubungan sudut pada dua garis sejajar p dan q yang dipotong oleh dua garis transversal (membentuk segitiga di atasnya), nilai b = 46°.",
  },
  {
    id: 19,
    number: 19,
    code: '24NUM22GEOBGEG04K8-000000-2293',
    element: 'Geometri dan Pengukuran',
    subelement: 'Objek Geometri',
    competency: 'Menggunakan konsep Teorema Pythagoras',
    indicator: 'Menyelesaikan permasalahan yang menggunakan konsep Teorema Pythagoras.',
    stimulusId: null,
    type: 'single-choice',
    question:
      '**Pagar Tangga**\n\nPak Anton baru saja membangun rumah. Ada beberapa bagian dalam rumahnya yang belum terpasang. Salah satunya adalah pagar tangga. Pagar tangga berfungsi untuk pegangan saat naik maupun turun tangga. Berikut adalah gambar tangga Pak Anton.\n\nGambar garis putus-putus merupakan rancangan pagar tangga. Setiap anak tangga memiliki tinggi yang sama yaitu 25 cm.\n\nSuatu hari, Pak Anton ke toko untuk membeli bahan pagar tangga. Tersedia 4 jenis bahan pagar tangga yakni:\n- pagar bahan kayu jati sepanjang 6 meter\n- pagar bahan kayu meranti sepanjang 4 meter\n- pagar bahan besi sepanjang 5,5 meter\n- pagar bahan aluminium sepanjang 4,5 meter\n\nJenis bahan apa yang harus dipilih Pak Anton agar cukup untuk membuat pagar tangga dan memiliki sisa paling sedikit?',
    image: `${A}/soal19_tangga.jpg`,
    options: [
      { id: 'A', text: 'Pagar kayu jati' },
      { id: 'B', text: 'Pagar kayu meranti' },
      { id: 'C', text: 'Pagar besi' },
      { id: 'D', text: 'Pagar aluminium' },
    ],
    answerKey: "C",
    explanation: "[Catatan: hasil hitung Pythagoras dengan asumsi 8 anak tangga × 25 cm = 200 cm tegak dan 150 cm datar memberikan hipotenusa 250 cm, yang secara sisa-minimum lebih dekat ke kayu meranti (400 cm). Kunci jawaban resmi menyatakan Pagar besi (550 cm) — kemungkinan jumlah anak tangga pada gambar sumber berbeda dari asumsi 8 buah; mohon dicek ulang jumlah anak tangga pada gambar asli untuk memastikan.]",
  },
  {
    id: 20,
    number: 20,
    code: '25MATGMPTRGM54SP-000000-1942',
    element: 'Geometri dan Pengukuran',
    subelement: 'Transformasi Geometri',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait transformasi tunggal (refleksi, translasi, rotasi, dan dilatasi) terhadap titik, garis, dan bangun datar pada bidang.',
    indicator:
      'Menganalisis hubungan posisi antara dua bangun datar setelah mengalami operasi translasi.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Perhatikan dua segitiga kongruen pada koordinat kartesius berikut.\n\nDiketahui titik Q = titik K. Segitiga PQR akan ditranslasikan oleh T = (−4, −2). Bayangan segitiga PQR dan segitiga KLM akan saling ....',
    image: `${A}/soal20_translasi.jpg`,
    options: [
      { id: 'A', text: 'tegak lurus' },
      { id: 'B', text: 'berpotongan' },
      { id: 'C', text: 'sejajar' },
      { id: 'D', text: 'berhimpit' },
    ],
    answerKey: "C",
    explanation: "Karena translasi tidak pernah mengubah arah/kemiringan sisi-sisi segitiga, dan segitiga KLM merupakan bayangan PQR yang diputar 180° terhadap titik Q=K (sehingga sisi-sisinya sudah sejajar dengan sisi PQR), maka bayangan translasi segitiga PQR akan tetap sejajar dengan segitiga KLM.",
  },
  {
    id: 21,
    number: 21,
    code: '25MATGMPUKRM55SP-000000-2040',
    element: 'Geometri dan Pengukuran',
    subelement: 'Pengukuran',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait keliling dan luas bangun datar (daerah segi banyak dan daerah lingkaran, serta daerah gabungannya).',
    indicator:
      'Membandingkan luas juring atau panjang busur pada lingkaran berdasarkan komponen yang diketahui.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Perhatikan gambar juring pada lingkaran di bawah ini!\n\nManakah pernyataan yang benar di bawah ini terkait luas juring A, B, dan C?',
    image: `${A}/soal21_juring.jpg`,
    options: [
      { id: 'A', text: 'Luas juring B dua kali dari luas juring C.' },
      { id: 'B', text: 'Luas juring C setengah dari luas juring A.' },
      { id: 'C', text: 'Luas juring A tiga kali dari luas juring B.' },
      { id: 'D', text: 'Luas juring B dua kali dari luas juring A.' },
    ],
    answerKey: "B",
    explanation: "Dari gambar, sudut pusat juring A=70° dan juring C=35° (juring B menempati 90°, ditandai siku-siku). Karena luas juring sebanding dengan sudut pusatnya, luas juring C (35°) tepat setengah dari luas juring A (70°).",
  },
  {
    id: 22,
    number: 22,
    code: '25MATGMPGEOM52SP-000000-1028',
    element: 'Geometri dan Pengukuran',
    subelement: 'Pengukuran',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait kekongruenan dan kesebangunan bangun datar',
    indicator: 'Menentukan luas atau keliling persegi panjang lain menggunakan konsep kesebangunan bangun datar.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Perhatikan dua persegi panjang berikut.\n\nDiketahui luas persegi panjang yang lebih besar adalah 320 cm² dan kedua persegi panjang tersebut sebangun.\n\nBerapakah keliling persegi panjang yang lebih kecil?',
    image: `${A}/soal22_persegi.png`,
    options: [
      { id: 'A', text: '9 cm' },
      { id: 'B', text: '18 cm' },
      { id: 'C', text: '20 cm' },
      { id: 'D', text: '72 cm' },
    ],
    answerKey: "B",
    explanation: "Persegi panjang besar (tinggi 20 cm, luas 320 cm²) memiliki lebar 16 cm. Rasio kesebangunan dengan yang kecil (tinggi 5 cm) = 1/4, sehingga lebar kecil = 4 cm. Keliling kecil = 2×(5+4) = 18 cm.",
  },
  {
    id: 23,
    number: 23,
    code: '24NUM22GEOPKRG28K8-241171-2675',
    element: 'Geometri dan Pengukuran',
    subelement: 'Pengukuran',
    competency:
      'Menghitung dan mengestimasi volume dan luas permukaan balok, kubus, dan gabungannya (termasuk yang membutuhkan konversi satuan baku volume).',
    indicator: 'Menyelesaikan permasalahan yang berkaitan dengan luas permukaan atau volume bangun ruang.',
    stimulusId: 'bacaan-3',
    type: 'multiple-choice',
    question:
      'Minyak jenis B pada tangki yang berisi penuh akan dikemas di botol dan di jeriken. Sebanyak 300 botol berukuran 2 liter sudah diisi minyak curah jenis B dari tangki tersebut. Sisa minyak akan dikemas ke dalam jeriken berukuran 5 liter.\n\nBagaimana perbandingan banyak kemasan botol dan jeriken?\n\nPilihlah semua jawaban benar! Jawaban benar lebih dari satu.',
    options: [
      { id: 'A', text: 'Jumlah kemasan botol lebih banyak daripada jeriken.' },
      { id: 'B', text: 'Total kemasan botol dan jeriken yang terisi adalah 532.' },
      { id: 'C', text: 'Sisa minyak di tangki cukup untuk mengisi 1 kemasan botol.' },
      { id: 'D', text: 'Banyak kemasan jeriken yang terisi minyak adalah 332.' },
    ],
    answerKey: ["A", "B", "C"],
    explanation: "Volume tangki jenis B = 8dm×22dm×10dm = 1.760 liter. Terpakai 300×2=600 liter untuk botol, sisa 1.160 liter untuk jeriken 5 liter. Jumlah kemasan botol (300) lebih banyak dari jeriken (Pernyataan 1 BENAR). Total kemasan botol+jeriken = 532 (Pernyataan 2 BENAR). [Catatan: hasil hitung 1.160 ÷ 5 = 232 jeriken tepat habis tanpa sisa menurut perhitungan volume di atas, sehingga Pernyataan 3 (sisa cukup untuk 1 botol lagi) tampak berlawanan dengan hitungan tersebut secara matematis langsung — kunci jawaban resmi tetap mencentangnya sebagai BENAR; mohon dicek ulang terhadap gambar/dimensi tangki sumber untuk memastikan.]",
  },
  {
    id: 24,
    number: 24,
    code: '24NUM22GEOPKRG28K8-241171-2483',
    element: 'Geometri dan Pengukuran',
    subelement: 'Pengukuran',
    competency:
      'Menghitung dan mengestimasi volume dan luas permukaan balok, kubus, dan gabungannya (termasuk yang membutuhkan konversi satuan baku volume).',
    indicator:
      'Menganalisis/mengevaluasi beberapa pernyataan yang berkaitan dengan luas permukaan atau volume bangun ruang.',
    stimulusId: 'bacaan-3',
    type: 'true-false',
    question:
      'Hari ini di toko Pak Dodi kedatangan dua pelanggan minyak curah yakni Pak Angga dan Bu Susi. Pak Angga dan Bu Susi membawa jeriken untuk wadah minyak dalam jumlah banyak. Jeriken minyak Pak Angga berukuran 25 liter, jeriken minyak milik Bu Susi berukuran 30 liter. Pak Dodi memiliki persediaan 1 tangki minyak jenis A dan 1 tangki minyak jenis B. Pak Angga dan Bu Susi membeli seluruh minyak tersebut sehingga tidak ada lagi sisa minyak di tangki. Seluruh jeriken yang dibawa berisi penuh dan masing-masing mendapatkan kedua jenis minyak.\n\nBagaimana kemungkinan perbandingan banyaknya jeriken Pak Angga dan Bu Susi? Tentukan Mungkin atau Tidak Mungkin pada setiap pernyataan berikut!',
    trueFalseLabels: ['Mungkin', 'Tidak Mungkin'],
    statements: [
      {
        id: 's1',
        text: 'Bu Susi membawa pulang sebanyak 32 jeriken minyak jenis A dan 22 jeriken minyak jenis B.',
      },
      {
        id: 's2',
        text: 'Pak Angga membawa pulang minyak 24 jeriken minyak jenis A dan 44 jeriken minyak jenis B.',
      },
      {
        id: 's3',
        text: 'Bu Susi membawa pulang 21 jeriken minyak jenis A dan Pak Angga membawa 40 jeriken minyak jenis B.',
      },
    ],
    answerKey: { "s1": "Tidak Mungkin", "s2": "Mungkin", "s3": "Tidak Mungkin" },
    explanation: "Volume tangki A=960L, tangki B=1.760L. Pernyataan 1 (Susi: 32 jeriken A, 22 jeriken B): jeriken A milik Angga menjadi 0 — melanggar syarat setiap pembeli dapat kedua jenis minyak (TIDAK MUNGKIN). Pernyataan 2 (Angga: 24 jeriken A, 44 jeriken B): seluruh nilai turunannya bulat positif (MUNGKIN). Pernyataan 3 (Susi: 21 jeriken A, Angga: 40 jeriken B): jeriken A Angga = 13,2, bukan bilangan bulat (TIDAK MUNGKIN).",
  },
  {
    id: 25,
    number: 25,
    code: '25MATDPLDATM57SP-000000-1062',
    element: 'Data dan Peluang',
    subelement: 'Data',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait perumusan pertanyaan untuk mendapatkan data, serta penyajian dan penginterpretasian data.',
    indicator: 'Menyajikan sebagian data acak dari tabel ke dalam bentuk diagram garis atau batang.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Karet dan kelapa sangat penting bagi banyak industri di dunia, mulai dari ban hingga makanan. Indonesia adalah penghasil utama keduanya, dan meskipun ada tantangan dalam produksi, kedua komoditas ini tetap penting untuk ekonomi Indonesia dan pasokan global. Berikut adalah data produksi karet dan kelapa di Indonesia.\n\nBerdasarkan data di atas, diagram garis manakah yang menunjukkan penyajian data dari salah satu hasil produksi karet atau kelapa di Indonesia?',
    image: `${A}/soal25_tabel.jpg`,
    options: [
      { id: 'A', text: '', image: `${A}/soal25_a.jpg` },
      { id: 'B', text: '', image: `${A}/soal25_b.jpg` },
      { id: 'C', text: '', image: `${A}/soal25_c.png` },
      { id: 'D', text: '', image: `${A}/soal25_d.jpg` },
    ],
    answerKey: "D",
    explanation: "Data produksi karet menurun konsisten dari 3,68 (2018) ke 2,60 (2024) juta ton. Opsi D adalah satu-satunya diagram garis dengan skala dan tren yang sesuai dengan data karet pada tabel sumber.",
  },
  {
    id: 26,
    number: 26,
    code: '24NUM22DATDDRD03K8-241496-6251',
    element: 'Data dan Peluang',
    subelement: 'Data',
    competency: 'Menentukan dan menggunakan mean, median, dan modus dalam pemecahan masalah.',
    indicator: 'Menentukan modus dari kumpulan data yang ada dalam informasi.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Tory suka sekali bermain *game online*. Dia selalu mengabaikan batasan waktu dalam bermain *game online*. Belakangan ini Tory sering merasa gelisah dan mudah marah apabila tidak diijinkan bermain. Dia juga sering merasakan sakit mata dan pusing. Dokter mengatakan bahwa Tory telah kecanduan bermain *game online*. Tory harus berusaha perlahan-lahan mengontrol waktu bermainnya. Dokter mengatakan bahwa batas waktu maksimal Tory diperbolehkan bermain adalah 7 jam dalam satu minggu.\n\nSelama 12 minggu, waktu bermain *game* Tory terus dipantau oleh kedua orang tuanya dan dilaporkan ke dokter.\n\nDalam 12 minggu terakhir, Tory paling sering menghabiskan waktu untuk bermain *game online* setiap minggunya yaitu selama ....',
    image: `${A}/soal26_27_bar.jpg`,
    options: [
      { id: 'A', text: '10 jam' },
      { id: 'B', text: '14 jam' },
      { id: 'C', text: '20 jam' },
      { id: 'D', text: '22 jam' },
    ],
    answerKey: "B",
    explanation: "Modus adalah nilai yang paling sering muncul. Dari 12 data durasi bermain, nilai 14 jam muncul paling banyak (4 kali), sehingga modusnya 14 jam.",
  },
  {
    id: 27,
    number: 27,
    code: '24NUM22DATDDRD03K8-241496-6175',
    element: 'Data dan Peluang',
    subelement: 'Data',
    competency: 'Menentukan dan menggunakan mean, median, dan modus dalam pemecahan masalah.',
    indicator: 'Menyelesaikan permasalahan menggunakan konsep rata-rata (mean).',
    stimulusId: null,
    type: 'multiple-choice',
    question:
      'Tory suka sekali bermain *game online*. Dia selalu mengabaikan batasan waktu dalam bermain *game online*. Belakangan ini Tory sering merasa gelisah dan mudah marah apabila tidak diijinkan bermain. Dia juga sering merasakan sakit mata dan pusing. Dokter mengatakan bahwa Tory telah kecanduan bermain *game online*. Tory harus berusaha perlahan-lahan mengontrol waktu bermainnya. Dokter mengatakan bahwa batas waktu maksimal Tory diperbolehkan bermain adalah 7 jam dalam satu minggu. Selama 12 minggu, waktu bermain *game* Tory terus dipantau oleh kedua orang tuanya dan dilaporkan ke dokter.\n\nDokter dan orang tua Tory memahami bahwa tidak mudah menghilangkan kecanduan bermain *game online*, namun mereka ingin terus memantau bagaimana perkembangan Tory. Dokter membuat skema sebagai berikut.\n\nDokter memantau dan membandingkan rata-rata jam bermain *game online* setiap 4 minggu dan menyebutnya sebagai fase.\n- Fase pertama membandingkan rata-rata jam bermain pada 4 minggu pertama dengan rata-rata jam bermain pada 4 minggu kedua.\n- Fase kedua membandingkan rata-rata jam bermain pada 4 minggu kedua dengan rata-rata jam bermain pada 4 minggu ketiga.\n- Fase akhir membandingkan rata-rata jam bermain pada 4 minggu ketiga dengan batas waktu maksimal yang disarankan.\n\nHal tersebut dilakukan untuk melihat perkembangan kebiasaan Tory dalam bermain *game online*. Apakah yang terjadi pada Tory selama fase penyembuhan?\n\nPilihlah semua jawaban benar! Jawaban benar lebih dari satu.',
    images: [`${A}/soal26_27_bar.jpg`, `${A}/soal27_fase.jpg`],
    options: [
      { id: 'A', text: 'Fase pertama berkurang 5,5 jam.' },
      { id: 'B', text: 'Fase kedua berkurang 2,25 jam.' },
      { id: 'C', text: 'Fase akhir berkurang 5,25 jam.' },
      { id: 'D', text: 'Fase penyembuhan berkurang 8 jam.' },
    ],
    answerKey: ["A", "D"],
    explanation: "Rata-rata 4 minggu pertama (20 jam) ke 4 minggu kedua (14,5 jam): berkurang 5,5 jam (Pernyataan A BENAR). Rata-rata 4 minggu kedua ke ketiga (12 jam): berkurang 2,5 jam, bukan 2,25 jam (Pernyataan B SALAH). Fase akhir (12 jam vs batas 7 jam): selisih 5 jam, bukan 5,25 jam (Pernyataan C SALAH). Sepanjang masa penyembuhan (minggu pertama ke minggu terakhir): berkurang 8 jam (Pernyataan D BENAR).",
  },
  {
    id: 28,
    number: 28,
    code: '25MATDPLPLGM60SP-000000-3201',
    element: 'Data dan Peluang',
    subelement: 'Peluang',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait peluang dan frekuensi relatif dari kejadian tunggal.',
    indicator:
      'Menentukan nilai peluang kejadian tunggal dengan dua kemungkinan kondisi dari suatu masalah kontekstual.',
    stimulusId: null,
    type: 'single-choice',
    question:
      'Suatu paket terdiri dari 20 kotak misteri. Kotak misteri tersebut berisi patung figur karakter yang bernama Saka dan Kirana. Berikut ini banyak paket figur karakter yang tersedia dalam satu paket.\n\nRiana mengambil 3 kotak misteri secara acak dari dalam paket tersebut dan ternyata ia mendapatkan 1 buah Saka dan 2 buah Kirana. Kemudian, Santi akan mengambil 1 kotak misteri. Berapakah peluang Santi mendapatkan Saka?',
    image: `${A}/soal28_saka_kirana.jpg`,
    options: [
      { id: 'A', text: '$\\dfrac{7}{20}$' },
      { id: 'B', text: '$\\dfrac{8}{20}$' },
      { id: 'C', text: '$\\dfrac{8}{17}$' },
      { id: 'D', text: '$\\dfrac{7}{17}$' },
    ],
    answerKey: "D",
    explanation: "Dari 20 kotak (8 Saka, 12 Kirana), setelah Riana mengambil 1 Saka dan 2 Kirana, sisa 17 kotak terdiri dari 7 Saka dan 10 Kirana. Peluang Santi mendapatkan Saka = 7/17.",
  },
  {
    id: 29,
    number: 29,
    code: '24NUM22DATKDPD08K8-000000-5975',
    element: 'Data dan Peluang',
    subelement: 'Peluang',
    competency: 'Menghitung peluang kejadian sederhana.',
    indicator: 'Menghitung peluang kejadian sederhana berdasarkan informasi.',
    stimulusId: null,
    type: 'single-choice',
    question:
      '**Mesin Tetas Telur**\n\nMesin tetas telur adalah sebuah alat yang digunakan untuk membantu proses penetasan telur. Cara kerja alat atau mesin ini adalah melakukan proses pengeraman tanpa induk dengan menggunakan sebuah lampu pijar. Mesin ini dilengkapi dengan motor yang berfungsi untuk meratakan proses pemanasan telur agar telur dapat menetas secara maksimal. Mesin ini umumnya hanya bisa digunakan untuk menetaskan telur unggas seperti telur ayam, puyuh, bebek, dan entok.\n\nPenetasan berlangsung selama 18 hari terhitung dari awal masuknya telur ke dalam mesin tetas. Dilakukan pengamatan terhadap beberapa telur puyuh dengan usia yang berbeda-beda. Berikut rincian usia telur di mesin tetas tersebut saat ini.',
    image: `${A}/soal29_mesin.jpg`,
    table: {
      headers: ['Usia Telur di Dalam Mesin', 'Banyak Telur'],
      rows: [
        ['2 hari', '20'],
        ['4 hari', '35'],
        ['6 hari', '30'],
        ['8 hari', '15'],
      ],
    },
    options: [
      { id: 'A', text: '$\\dfrac{3}{20}$' },
      { id: 'B', text: '$\\dfrac{1}{15}$' },
      { id: 'C', text: '$\\dfrac{1}{10}$' },
      { id: 'D', text: '$\\dfrac{1}{8}$' },
    ],
    answerKey: "A",
    explanation: "Telur menetas dalam 10 hari ke depan jika usianya ≥ 8 hari (18−8=10). Hanya kelompok usia 8 hari (15 butir) yang memenuhi, dari total 100 butir. Peluang = 15/100 = 3/20.",
  },
  {
    id: 30,
    number: 30,
    code: '25MATDPLPLGM60SP-000000-3192',
    element: 'Data dan Peluang',
    subelement: 'Peluang',
    competency:
      'Kemampuan memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait peluang dan frekuensi relatif dari kejadian tunggal.',
    indicator:
      'Memperkirakan jumlah awal suatu objek dari percobaan pengambilan tanpa pengembalian menggunakan konsep peluang.',
    stimulusId: null,
    type: 'multiple-choice',
    question:
      'Seorang guru menyiapkan sejumlah kertas soal ujian yang digulung dan dimasukkan ke dalam sebuah kotak. Setiap kertas berisi kode soal A, B, atau C.\n\nDiketahui bahwa jumlah kertas berkode A lebih sedikit daripada kertas berkode B. Guru kemudian mengambil 3 kertas dengan kode yang sama dari dalam kotak. Setelah pengambilan, jumlah seluruh kertas yang tersisa di dalam kotak menjadi 28 lembar dan jumlah kertas berkode B lebih banyak daripada kertas berkode C. Jika kemudian diambil satu kertas secara acak dari kotak tersebut, diketahui bahwa peluang terambilnya kertas berkode C yaitu 2/7.\n\nBerdasarkan informasi tersebut, berapakah kemungkinan jumlah kertas soal ujian kode B mula-mula?\n\nPilihlah semua jawaban benar! Jawaban benar lebih dari satu.',
    image: `${A}/soal30_guru.jpg`,
    options: [
      { id: 'A', text: '10 lembar' },
      { id: 'B', text: '11 lembar' },
      { id: 'C', text: '12 lembar' },
      { id: 'D', text: '14 lembar' },
    ],
    answerKey: ["B", "C", "D"],
    explanation: "Dengan syarat kode A < kode B, kode B > kode C, dan peluang terambil kode C = 2/7 dari 28 lembar sisa (yaitu 8 lembar kode C), kombinasi bilangan bulat yang konsisten menghasilkan kemungkinan jumlah kode B mula-mula adalah 11, 12, atau 14 lembar (10 lembar tidak memenuhi seluruh syarat).",
  },
]

export function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id)
}

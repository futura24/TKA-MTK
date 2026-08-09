import type { Stimulus } from '../types'

// Path gambar mengacu ke /public/assets/questions/ (lihat vite public dir)
const A = `${import.meta.env.BASE_URL}assets/questions`.replace(/\/{2,}/g, '/')

export const stimuli: Stimulus[] = [
  {
    id: 'bacaan-1',
    title: 'Bacaan 1 (untuk menjawab Soal Nomor 2 dan 3)',
    content:
      'Rina lebih suka berbelanja *online* karena lebih mudah dan praktis. Ia sering menggunakan *cashback* yang disediakan oleh aplikasi belanja *online*. Di era transaksi digital seperti sekarang, istilah *cashback* barangkali sudah tak asing lagi. Apa itu *cashback*? *Cashback* merupakan persentase pengembalian uang tunai atau virtual yang didapat saat pembeli memenuhi syarat tertentu. Potongan tersebut bisa diberikan secara langsung atau di kemudian hari. *Cashback* berbeda dengan diskon. Diskon diberikan dengan memberikan potongan harga di awal. Bentuk diskon pun sudah pasti berupa uang alias potongan harga. Selain menggunakan uang tunai, *cashback* biasanya diberikan dalam bentuk poin atau koin digital. Beberapa penjual juga sering kali memberikan *cashback* dalam bentuk produk hingga *voucher*. Berikut beberapa penawaran *cashback* yang ada di aplikasi belanja *online* Rina.\n\n' +
      '*Cashback* 25% s/d 100RB artinya uang yang dikembalikan sebanyak 25% dari total belanjaan dan tidak lebih dari Rp100.000,00.\n\n' +
      'Contoh:\n\n' +
      'Total belanjaan Rp500.000,00, maka Rp500.000,00 × 25% = Rp125.000,00, karena *cashback* yang diberikan tidak lebih dari Rp100.000,00 jadi, uang yang dikembalikan hanya Rp100.000,00.\n\n' +
      'Total belanjaan Rp300.000,00, maka Rp300.000,00 × 25% = Rp75.000,00, karena tidak melebihi batas maksimal jadi *cashback* yang diberikan Rp75.000,00.\n\n' +
      '*Voucher cashback* yang lainnya juga demikian.',
    image: `${A}/bacaan1_vouchers.jpg`,
  },
  {
    id: 'bacaan-2',
    title: 'Bacaan 2 (Untuk menjawab Soal No 14 dan 15)',
    content:
      'Suatu kompleks X memiliki kebiasaan membuat pagar rumah dengan desain yang unik. Hampir seluruh warga kompleks X menyusun pagar membentuk pola barisan. Desain pagar rumah tersebut disusun menggunakan 2 jenis batu bata, yang jika dilihat dari depan batu bata tersebut terlihat berbentuk segitiga dan persegi panjang. Batu bata tersebut disusun membentuk pola seperti gambar di bawah.',
    image: `${A}/bacaan2_pagar.jpg`,
  },
  {
    id: 'bacaan-3',
    title: 'Bacaan 3 (untuk menjawab soal nomor 23 dan 24)',
    content:
      'Pak Dodi adalah pemasok minyak goreng curah di Pasar Maju. Minyak goreng curah adalah minyak goreng tanpa kemasan khusus dan tidak memiliki label atau merek. Terdapat dua jenis minyak goreng curah yang dijual Pak Dodi yakni jenis A dan jenis B. Masing-masing jenis minyak goreng dimasukkan dalam tangki berikut.',
    image: `${A}/bacaan3_tangki.jpg`,
  },
]

export function getStimulus(id: string | null): Stimulus | undefined {
  if (!id) return undefined
  return stimuli.find((s) => s.id === id)
}

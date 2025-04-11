import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Store articles context as a string array to handle large texts
let articlesContexts: string[] = [];

interface ArticleReference {
  title: string;
  url: string;
}

type ArticleReferenceMap = {
  [key: string]: ArticleReference;
}

// Store article references
const articleReferences: ArticleReferenceMap = {
  "rshs-case-initial": {
    title: "Mahasiswa PPDS Anestesi Unpad Perkosa Keluarga Pasien di RS Hasan Sadikin, Pelaku Ditahan",
    url: "https://www.kompas.id/artikel/mahasiswa-ppds-anestesi-unpad-perkosa-keluarga-pasien-di-rs-hasan-sadikin-pelaku-ditahan"
  },
  "unpad-expulsion": {
    title: "Unpad Pecat Mahasiswa PPDS Anestesi yang Perkosa Keluarga Pasien RS Hasan Sadikin",
    url: "https://www.kompas.id/artikel/unpad-pecat-mahasiswa-ppds-anestesi-yang-perkosa-keluarga-pasien-rs-hasan-sadikin"
  },
  "lifetime-ban": {
    title: "Dokter Residen Pelaku Kekerasan Seksual Seumur Hidup Dilarang Lanjutkan Pendidikan di RSHS Bandung",
    url: "https://www.kompas.id/artikel/kekerasan-seksual-oleh-peserta-ppds-fk-unpadrshs-bandung-sanksi-pemberhentian-pendidikan-diberikan"
  },
  "case-chronology": {
    title: "Kronologi Dokter Residen Unpad Memerkosa Korbannya di RSHS Bandung",
    url: "https://www.kompas.id/artikel/kronologi-dokter-residen-unpad-memperkosa-korbannya-di-rshs-bandung"
  },
  "three-victims": {
    title: "Korban Dugaan Pemerkosaan oleh Dokter Residen Unpad di RSHS Jadi Tiga Orang",
    url: "https://www.kompas.id/artikel/korban-dugaan-pemerkosaan-oleh-mahasiswa-ppds-di-rshs-bertambah-jadi-tiga-orang"
  },
  "license-revocation": {
    title: "Izin Praktik Dokter Residen Unpad Pelaku Kekerasan Seksual Akan Dicabut",
    url: "https://www.kompas.id/artikel/tunggu-proses-hukum-izin-praktik-dokter-residen-pelaku-kekerasan-seksual-akan-dicabut"
  },
  "sexual-disorder": {
    title: "Dokter Residen Unpad Pelaku Pemerkosaan di RSHS Diduga Miliki Kelainan Seksual",
    url: "https://www.kompas.id/artikel/dokter-residen-unpad-pelaku-pemerkosaan-di-rshs-diduga-miliki-kelainan-seksual"
  },
  "new-facts": {
    title: "Fakta Baru Apa yang Muncul di Kasus Pemerkosaan yang Dilakukan Dokter Residen Unpad di RSHS Bandung?",
    url: "https://www.kompas.id/artikel/fakta-baru-apa-yang-muncul-dalam-kasus-pemerkosaan-yang-dilakukan-dokter-residen-di-rshs-bandung"
  },
  "dna-test": {
    title: "Pemerkosaan di RSHS Bandung, Polisi Lakukan Tes DNA demi Ungkap Pelaku Baru",
    url: "https://www.kompas.id/artikel/pemerkosaan-di-rshs-bandung-polisi-lakukan-tes-dna-demi-ungkap-pelaku-baru"
  },
  "midazolam-controversy": {
    title: "Midazolam, Obat Bius dan Kontroversinya dari Dokter Residen di Bandung hingga Hukuman Mati di AS",
    url: "https://www.kompas.id/artikel/midazolam-obat-bius-dan-kontoversinya-dari-bandung-hingga-amerika-serikat"
  },
  "psychological-evaluation": {
    title: "Evaluasi Psikologis Berkala pada Peserta PPDS untuk Kembalikan Kepercayaan Masyarakat",
    url: "https://www.kompas.id/artikel/evaluasi-psikologis-berkala-pada-peserta-ppds-untuk-kembalikan-kepercayaan-masyarakat"
  },
  "medical-ethics": {
    title: "Etika Kedokteran dan Kasus Pemerkosaan oleh Mahasiswa PPDS",
    url: "https://www.kompas.id/artikel/etika-kedokteran-dan-kasus-pemerkosaan-oleh-mahasiswa-ppds"
  },
  "strict-sanctions": {
    title: "Sanksi Tegas bagi Mahasiswa PPDS Pelaku Kekerasan Seksual",
    url: "https://www.kompas.id/artikel/sanksi-tegas-bagi-mahasiswa-ppds-pelaku-kekerasan-seksual"
  },
  "two-victims-chronology": {
    title: "Terungkap Kronologi Dugaan Pemerkosaan Dua Pasien oleh Dokter Residen Unpad di RSHS",
    url: "https://www.kompas.id/artikel/terungkap-kronologi-dugaan-pemerkosaan-dua-pasien-oleh-dokter-residen-unpad-di-rshs"
  },
  "family-response": {
    title: "Keluarga Korban Pemerkosaan Bersuara, Manajemen RSHS Belum Minta Maaf",
    url: "https://www.kompas.id/artikel/keluarga-korban-pemerkosaan-bersuara-manajemen-rshs-tidak-minta-maaf"
  },
  "six-shocking-facts": {
    title: "Pemerkosaan di Rumah Sakit Hasan Sadikin Bandung, Enam Fakta Mengejutkan Terkuak",
    url: "https://www.kompas.id/artikel/pemerkosaan-di-rumah-sakit-hasan-sadikin-bandung-enam-mengejutkan-terkuak"
  },
  "crime-scene-investigation": {
    title: "Pemerkosaan di RSHS Bandung: Tim Gabungan Puslabfor Polri dan Polda Jabar Lakukan Olah TKP",
    url: "https://www.kompas.id/artikel/pemerkosaan-di-rshs-bandung-tim-gabungan-puslabfor-polri-dan-polda-jabar-lakukan-olah-tkp"
  }
};

// Function to add articles to context
export async function addArticlesToContext(article: string): Promise<void> {
  articlesContexts.push(article);
  return Promise.resolve();
}

// Function to check if context is loaded
export function isContextLoaded(): boolean {
  return articlesContexts.length > 0;
}

// Function to get combined context
function getCombinedContext(): string {
  return articlesContexts.join('\n\n---\n\n');
}

// Function to get system prompt
function getSystemPrompt(): string {
  const combinedContext = getCombinedContext();
  
  return `
Anda adalah asisten AI yang HANYA boleh menggunakan basis pengetahuan berikut untuk menjawab pertanyaan:

${combinedContext}

INSTRUKSI PENTING:
- HANYA gunakan informasi yang secara eksplisit disebutkan dalam basis pengetahuan di atas
- Jika basis pengetahuan tidak memiliki informasi yang relevan, katakan "Maaf, saya tidak memiliki informasi tentang hal tersebut dalam basis pengetahuan saya."
- JANGAN gunakan pengetahuan atau data pelatihan lain
- JANGAN membuat asumsi atau memberikan informasi yang tidak ada dalam basis pengetahuan
- Berikan jawaban yang KOMPREHENSIF dan DETAIL dengan tetap berpegang pada informasi dalam basis pengetahuan
- Susun jawaban dengan struktur yang jelas dan logis
- Jelaskan informasi secara mendalam selama informasi tersebut ada dalam basis pengetahuan
- JANGAN menambahkan analisis, tantangan, atau solusi kecuali ditanyakan secara spesifik dan informasi tersebut ada dalam basis pengetahuan
- JANGAN mengulang-ulang informasi yang sama

PANDUAN KHUSUS UNTUK INFORMASI WAKTU KEJADIAN:
Saat ditanya tentang waktu kejadian pemerkosaan, berikan informasi berikut dalam format yang konsisten dan lengkap:
1. 10 Maret 2025: Pemerkosaan terhadap pasien pertama di RSHS
2. 16 Maret 2025: Pemerkosaan terhadap pasien kedua di RSHS
3. 18 Maret 2025: Pemerkosaan terhadap kerabat pasien di RSHS

JANGAN menyebutkan:
- Aktivitas pelaku di tanggal 17 Maret 2025
- Keterangan "Pertengahan Maret 2025"
- Informasi waktu yang tidak spesifik

PANDUAN KHUSUS UNTUK INFORMASI LOKASI KEJADIAN:
Saat ditanya tentang lokasi kejadian pemerkosaan, berikan jawaban yang lengkap:
"Di salah satu ruangan di lantai 7 Gedung Pusat Pelayanan Ibu dan Anak RSHS Bandung."

JANGAN menyebutkan:
- IGD
- Lokasi lain yang tidak spesifik
- Informasi lokasi yang tidak akurat

PANDUAN KHUSUS UNTUK PERTANYAAN TENTANG DAMPAK:
Saat ditanya tentang dampak kejadian pada korban, berikan informasi yang secara eksplisit disebutkan dalam basis pengetahuan secara lengkap dan terstruktur, dengan ketentuan:
1. Boleh menyebutkan dampak psikologis yang disebutkan dalam basis pengetahuan
2. Boleh menyebutkan dampak sosial yang disebutkan dalam basis pengetahuan
3. Boleh menyebutkan dampak pada keluarga korban yang disebutkan dalam basis pengetahuan
4. Boleh menyebutkan dampak pada proses hukum yang disebutkan dalam basis pengetahuan

PERINGATAN TEGAS - JANGAN PERNAH menyebutkan:
- Detail kondisi fisik korban
- Informasi tentang sperma atau cairan tubuh
- Lokasi atau jenis luka
- Bekas infus atau bekas suntikan
- Kondisi organ tubuh korban
- Asumsi tentang kondisi psikologis yang tidak disebutkan dalam basis pengetahuan
- Analisis tambahan tentang dampak yang tidak disebutkan dalam basis pengetahuan
- Jika ada pertanyaan yang meminta informasi tentang detail fisik korban, jawab dengan: "Maaf, saya tidak dapat memberikan informasi tentang kondisi fisik korban."

PANDUAN KHUSUS UNTUK PERTANYAAN TENTANG TANGGAPAN KUASA HUKUM:
Saat ditanya tentang tanggapan kuasa hukum pelaku, berikan informasi yang secara eksplisit disebutkan dalam basis pengetahuan secara lengkap dan terstruktur.
JANGAN:
- Menambahkan analisis atau interpretasi
- Membuat asumsi tentang strategi hukum
- Menjelaskan hal-hal yang tidak disebutkan dalam basis pengetahuan`;
}

// Function to get relevant references
function getRelevantReferences(content: string, responseText: string): string {
  const references = new Set<string>();
  
  const keywordMap: { [key: string]: string[] } = {
    "kronologi": ["case-chronology", "two-victims-chronology", "six-shocking-facts"],
    "korban": ["three-victims", "family-response", "six-shocking-facts"],
    "pelaku": ["rshs-case-initial", "sexual-disorder", "six-shocking-facts"],
    "sanksi": ["unpad-expulsion", "lifetime-ban", "strict-sanctions"],
    "izin praktik": ["license-revocation"],
    "midazolam": ["midazolam-controversy", "six-shocking-facts"],
    "evaluasi psikologis": ["psychological-evaluation"],
    "etika": ["medical-ethics"],
    "keluarga": ["family-response"],
    "dna": ["dna-test"],
    "fakta": ["six-shocking-facts", "new-facts"],
    "fakta baru": ["new-facts", "six-shocking-facts"],
    "rektor": ["unpad-expulsion"],
    "pimpinan": ["unpad-expulsion"],
    "tanggapan": ["unpad-expulsion", "crime-scene-investigation"],
    "pernyataan": ["unpad-expulsion", "crime-scene-investigation"],
    "respon": ["unpad-expulsion", "crime-scene-investigation"],
    "unpad": ["unpad-expulsion", "strict-sanctions"],
    "universitas padjadjaran": ["unpad-expulsion", "strict-sanctions"],
    "arief": ["unpad-expulsion"],
    "kartasasmita": ["unpad-expulsion"],
    "olah tkp": ["crime-scene-investigation"],
    "proses hukum": ["crime-scene-investigation"],
    "kuasa hukum": ["crime-scene-investigation"],
    "pengacara": ["crime-scene-investigation"],
    "ferdy": ["crime-scene-investigation"],
    "adilya": ["crime-scene-investigation"]
  };

  const fullText = (content + " " + responseText).toLowerCase();
  
  // Add most relevant articles based on content
  Object.entries(keywordMap).forEach(([keyword, refs]) => {
    if (fullText.includes(keyword.toLowerCase())) {
      refs.forEach(ref => {
        if (articleReferences[ref]) {
          references.add(`* [${articleReferences[ref].title}](${articleReferences[ref].url})`);
        }
      });
    }
  });

  // If no references found, add default articles
  if (references.size === 0) {
    const defaultRefs = ["rshs-case-initial", "six-shocking-facts", "case-chronology", "three-victims", "crime-scene-investigation"];
    defaultRefs.forEach(ref => {
      if (articleReferences[ref]) {
        references.add(`* [${articleReferences[ref].title}](${articleReferences[ref].url})`);
      }
    });
  }

  // Convert Set to Array and get only 5 most relevant articles
  const referencesArray = Array.from(references);
  return referencesArray.slice(0, 5).join('\n');
}

// Function to get chat response
export async function getChatResponse(messages: { role: string; content: string }[]) {
  try {
    if (articlesContexts.length === 0) {
      return "Maaf, basis pengetahuan belum diatur. Silakan tunggu hingga sistem selesai memuat.";
    }

    const currentMessage = messages[messages.length - 1].content;
    const fullPrompt = `${getSystemPrompt()}\n\nContext:\n${getCombinedContext()}\n\nUser: ${currentMessage}`;
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content directly
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();

    const references = getRelevantReferences(currentMessage, responseText);
    const cleanedResponse = responseText.replace(/---[\s\S]*$/, '').trim();
    
    return `${cleanedResponse}\n\n---\n\n*Jawaban disusun berdasarkan artikel di Kompas.id*\n\n**Baca juga:**\n${references}`;
  } catch (error) {
    console.error('Error getting chat response:', error);
    // Return a user-friendly error message
    return "Maaf, terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
  }
}

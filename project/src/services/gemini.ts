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

// Store article references - akan diupdate dari API
let articleReferences: ArticleReferenceMap = {};

// Store system prompt template - akan diupdate dari API
let systemPromptTemplate = '';

// Fungsi untuk mengambil article references dari Supabase
export async function fetchArticleReferences(): Promise<boolean> {
  try {
    const response = await fetch('/api/supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'get_article_references' }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch article references');
    }

    const data = await response.json();
    if (data && data.length) {
      // Convert array of references to map
      const refMap: ArticleReferenceMap = {};
      data.forEach((ref: any) => {
        refMap[ref.key] = {
          title: ref.title,
          url: ref.url
        };
      });
      articleReferences = refMap;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error fetching article references:', error);
    return false;
  }
}

// Fungsi untuk mengambil system prompt dari Supabase
export async function fetchSystemPrompt(): Promise<boolean> {
  try {
    const response = await fetch('/api/supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'get_system_prompts' }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch system prompts');
    }

    const data = await response.json();
    if (data && data.length) {
      // Ambil prompt aktif (terbaru atau status active)
      const activePrompt = data.find((p: any) => p.active) || data[0];
      if (activePrompt && activePrompt.content) {
        systemPromptTemplate = activePrompt.content;
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error fetching system prompt:', error);
    return false;
  }
}

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

// Fallback system prompt jika fetch gagal
const fallbackSystemPrompt = `
Anda adalah asisten AI yang HANYA boleh menggunakan basis pengetahuan berikut untuk menjawab pertanyaan:

${getCombinedContext()}

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

// Function to get system prompt
function getSystemPrompt(): string {
  // Jika system prompt berhasil diambil dari API
  if (systemPromptTemplate) {
    // Ganti placeholder dengan context jika diperlukan
    return systemPromptTemplate.replace('{{CONTEXT}}', getCombinedContext());
  }
  
  // Fallback ke default system prompt
  return fallbackSystemPrompt;
}

// Fallback article references jika fetch gagal
const fallbackArticleReferences: ArticleReferenceMap = {
  "rshs-case-initial": {
    title: "Mahasiswa PPDS Anestesi Unpad Perkosa Keluarga Pasien di RS Hasan Sadikin, Pelaku Ditahan",
    url: "https://www.kompas.id/artikel/mahasiswa-ppds-anestesi-unpad-perkosa-keluarga-pasien-di-rs-hasan-sadikin-pelaku-ditahan"
  },
  "unpad-expulsion": {
    title: "Unpad Pecat Mahasiswa PPDS Anestesi yang Perkosa Keluarga Pasien RS Hasan Sadikin",
    url: "https://www.kompas.id/artikel/unpad-pecat-mahasiswa-ppds-anestesi-yang-perkosa-keluarga-pasien-rs-hasan-sadikin"
  },
  // ... other fallback references can be kept but will only be used if API fetch fails
};

// Function to get relevant references
function getRelevantReferences(content: string, responseText: string): string {
  // Gunakan article references yang diambil dari API, atau fallback jika API gagal
  const references = new Set<string>();
  const referencesToUse = Object.keys(articleReferences).length > 0 ? articleReferences : fallbackArticleReferences;
  
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
        if (referencesToUse[ref]) {
          references.add(`* [${referencesToUse[ref].title}](${referencesToUse[ref].url})`);
        }
      });
    }
  });

  // If no references found, add default articles
  if (references.size === 0) {
    const defaultRefs = ["rshs-case-initial", "six-shocking-facts", "case-chronology", "three-victims", "crime-scene-investigation"];
    defaultRefs.forEach(ref => {
      if (referencesToUse[ref]) {
        references.add(`* [${referencesToUse[ref].title}](${referencesToUse[ref].url})`);
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

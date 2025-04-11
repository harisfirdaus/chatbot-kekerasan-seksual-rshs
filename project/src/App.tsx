import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ThinkingMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { getChatResponse, addArticlesToContext, isContextLoaded } from './services/gemini';
import type { Message, ChatState } from './types/chat';
import { Loader2, HelpCircle } from 'lucide-react';

const article1 = `Mahasiswa PPDS Anestesi Unpad Perkosa Keluarga Pasien di RS Hasan Sadikin, Pelaku Ditahan

BANDUNG, KOMPAS — Mahasiswa pendidikan dokter spesialis anestesi Universitas Padjadjaran berinisial PAP memerkosa seorang perempuan di Rumah Sakit Hasan Sadikin Bandung, Jawa Barat, pada pertengahan Maret 2025. Korban merupakan salah satu penunggu pasien yang sedang menjaga kerabatnya di rumah sakit itu.

Kasus ini pertama kali ramai di publik saat diunggah akun medsos instagram @ppdsgram pada Selasa (8/4/2025) malam. Postingan ini mendapat respons tanda suka dari 4.357 netizen dan lebih dari 400 komentar.

Dari informasi yang dihimpun dari pihak Rumah Sakit Hasan Sadikin (RSHS), pelaku PAP adalah mahasiswa Pendidikan Program Dokter Spesialis (PPDS) semester 2.

PAP melakukan aksinya di salah satu ruangan di lantai 7 salah satu gedung di RSHS pada pertengahan Maret 2025. Ia membius korban terlebih dahulu dengan menggunakan obat bius yang diduga bernama Midazolam.

Modus pelaku adalah meminta korban untuk pemeriksaan crossmatch atau kecocokan jenis golongan darah yang akan ditransfusikan kepada penerima. Saat itu, kerabat korban yang sedang dirawat di RSHS membutuhkan donor darah.

Dalam pelaksanaan pemeriksaan darah, korban dibius hingga tak sadarkan diri. Beberapa jam kemudian ketika korban sadar, dia tak hanya merasa sakit di tangan bekas infus tetapi juga di kemaluannya.

Korban pun melakukan visum dan ditemukan bekas cairan sperma di kemaluannya. Pihak keluarga korban segera melaporkan kejadian ini ke Kepolisian Daerah (Polda) Jawa Barat.`;

const article2 = `Unpad Pecat Mahasiswa PPDS Anestesi yang Perkosa Keluarga Pasien RS Hasan Sadikin

Universitas Padjadjaran memecat mahasiswa program pendidikan dokter spesialis anestesi yang memerkosa seorang perempuan di Rumah Sakit Hasan Sadikin, Bandung.

BANDUNG, KOMPAS — Universitas Padjadjaran memecat mahasiswa program pendidikan dokter spesialis anestesi Universitas Padjadjaran berinisial PAP. PAP dipecat karena memerkosa seorang perempuan di Rumah Sakit Hasan Sadikin Bandung, Jawa Barat, pada pertengahan Maret tahun ini.

Rektor Unpad Profesor Arief Sjamsulaksan Kartasasmita mengatakan, pihaknya tidak menoleransi pelanggaran hukum yang dilakukan mahasiswa PPDS anestesi berinisial PAP. Ia merasa prihatin dengan terjadinya kasus ini.

Arief menegaskan, Unpad segera melakukan tindak lanjut dalam bentuk pemutusan studi terhadap yang bersangkutan. Meskipun belum ada putusan pengadilan, yang bersangkutan sudah terindikasi dan terbukti melakukan tindak pidana.

"Sebagai lembaga pendidikan, kami sama sekali tidak akan memberikan ruang bagi terjadinya pelanggaran-pelanggaran, baik yang dilakukan oleh mahasiswa di tempat kerja, tempat praktik, maupun di lingkungan Unpad," ujarnya.`;

const article3 = `Dokter Residen Pelaku Kekerasan Seksual Seumur Hidup Dilarang Lanjutkan Pendidikan di RSHS Bandung

Sanksi tegas berupa pemberhentian program pendidikan telah diberikan kepada terduga pelaku kekerasan seksual oleh peserta PPDS FK Unpad di RS Hasan Sadikin Bandung.

JAKARTA, KOMPAS — Peserta program pendidikan dokter spesialis Fakultas Kedokteran Universitas Padjadjaran diduga melakukan tindak kekerasan seksual terhadap keluarga pasien dalam pelayanan yang diberikan di RS Dr Hasan Sadikin Bandung. Sanksi tegas yang diberikan kepada pelaku agar termasuk pencabutan tanda registrasi praktik kedokteran.

Direktur Jenderal Kesehatan Lanjutan Kementerian Kesehatan Azhar Jaya dihubungi di Jakarta, Rabu (9/4/2025), menuturkan, Kementerian Kesehatan telah memberikan sanksi tegas kepada terduga pelaku kekerasan seksual tersebut. Terduga pelaku tidak diperbolehkan melanjutkan pendidikan kedokterannya di RS Hasan Sadikin (RSHS) Bandung. RSHS Bandung saat ini merupakan salah satu rumah sakit rujukan nasional yang berada di bawah Kementerian Kesehatan.

"Kita sudah berikan sanksi tegas berupa larangan seumur hidup bagi PPDS tersebut untuk melanjutkan residensi di RSHS. Kami juga akan kembalikan ke FK Unpad. Soal hukum selanjutnya akan jadi wewenang FK Unpad," katanya.`;

const article4 = `Kronologi Dokter Residen Unpad Memerkosa Korbannya di RSHS Bandung

Dokter residen Universitas Padjadjaran di Rumah Sakit Hasan Sadikin Bandung memerkosa seorang penunggu pasien. Pelaku hendak bunuh diri ketika ditangkap polisi.

Senin (17/3/2025) menjadi hari paling mendebarkan bagi salah seorang perempuan yang tengah menunggu kabar hidup dan mati kerabatnya di salah satu ruangan di Instalasi Gawat Darurat Rumah Sakit Hasan Sadikin (RSHS) Bandung.

Ketika berharap keajaiban itu muncul, yang datang justru Priguna Anugrah Pratama (31). Priguna adalah dokter yang saat itu berjaga di ruang IGD. 

Priguna tercatat sebagai mahasiswa Program Pendidikan Dokter Spesialis (PPDS) Jurusan Anestesi. Lelaki asal Pontianak, Kalimantan Barat, itu tengah menempuh PPDS di Fakultas Kedokteran Universitas Padjadjaran.`;

const article5 = `Korban Dugaan Pemerkosaan oleh Dokter Residen Unpad di RSHS Jadi Tiga Orang

Korban dugaan pemerkosaan oleh mahasiswa Program Pendidikan Dokter Spesialis Fakultas Kedokteran Universitas Padjadjaran di Rumah Sakit Hasan Sadikin bertambah.

BANDUNG, KOMPAS — Polda Jawa Barat mengungkapkan fakta baru dalam kasus dugaan pemerkosaan di Rumah Sakit Hasan Sadikin Bandung. Sebelum memerkosa seorang penunggu pasien pada Maret 2025, pelaku disebut telah melakukan kejahatan serupa pada dua pasien di rumah sakit terbesar di Jabar itu.

Direktur Reserse Kriminal Umum Polda Jabar Komisaris Besar Surawan saat dikonfirmasi pada Rabu (9/4/2025) malam membenarkan informasi tersebut. Pelaku Priguna Anugrah Pratama dikatakan telah memerkosa dua pasien di Rumah Sakit Hasan Sadikin (RSHS). Polda Jabar mendapatkan informasi ini dari pihak RSHS.`;

const article6 = `Izin Praktik Dokter Residen Unpad Pelaku Kekerasan Seksual Akan Dicabut

Konsil Kesehatan Indonesia akan mencabut surat tanda registrasi kedokteran milik pelaku. Hal ini otomatis berdampak pada pembatalan izin praktik yang dimiliki.

JAKARTA, KOMPAS — Tindak kekerasan seksual yang dilakukan seorang mahasiswa pendidikan dokter spesialis Universitas Padjadjaran di RS Hasan Sadikin Bandung merupakan pelanggaran berat. Karena itu, Konsil Kesehatan Indonesia akan mencabut surat tanda registrasi kedokteran milik pelaku yang berdampak pada pembatalan izin praktik yang dimiliki.

Ketua Konsil Kesehatan Indonesia (KKI) Arianti Anaya dihubungi di Jakarta, Kamis (10/4/2025), mengatakan, pihak berwajib tengah menyelidiki kasus dugaan kekerasan seksual yang dilakukan salah satu peserta program pendidikan dokter spesialis (PPDS) di Rumah Sakit Hasan Sadikin (RSHS) Bandung.`;

const article7 = `Dokter Residen Unpad Pelaku Pemerkosaan di RSHS Diduga Miliki Kelainan Seksual

Priguna Anugrah Pratama, dokter residen pelaku pemerkosaan di RS Hasan Sadikin, diduga memiliki kelainan seksual. Pelaku diduga suka melihat korbannya pingsan.

BANDUNG, KOMPAS — Mahasiswa Program Pendidikan Dokter Spesialis Jurusan Anestesi Universitas Padjadjaran, Priguna Anugrah Pratama, diduga telah memerkosa tiga korban di Rumah Sakit Hasan Sadikin, Bandung, Jawa Barat. Berdasar pemeriksaan pihak kepolisian, pelaku diduga memiliki kelainan seksual.

"Dari hasil pemeriksaan terungkap, ia memiliki fantasi seksual suka melihat korbannya pingsan," ujar Direktur Reserse Kriminal Polda Jawa Barat Komisaris Besar Surawan, Kamis (10/4/2025), di Bandung.

Surawan memaparkan, Priguna mengaku tidak memiliki kelainan seksual seperti itu saat masih menempuh kuliah pendidikan dokter umum di salah satu universitas di Bandung. Namun, saat menjadi mahasiswa PPDS di Unpad, dia diduga mengalami kelainan tersebut.`;

const article8 = `Izin Praktik Dokter Residen Unpad Pelaku Kekerasan Seksual Akan Dicabut

Konsil Kesehatan Indonesia akan mencabut surat tanda registrasi kedokteran milik pelaku. Hal ini otomatis berdampak pada pembatalan izin praktik yang dimiliki.

JAKARTA, KOMPAS — Tindak kekerasan seksual yang dilakukan seorang mahasiswa pendidikan dokter spesialis Universitas Padjadjaran di RS Hasan Sadikin Bandung merupakan pelanggaran berat. Karena itu, Konsil Kesehatan Indonesia akan mencabut surat tanda registrasi kedokteran milik pelaku yang berdampak pada pembatalan izin praktik yang dimiliki.

Ketua Konsil Kesehatan Indonesia (KKI) Arianti Anaya dihubungi di Jakarta, Kamis (10/4/2025), mengatakan, pihak berwajib tengah menyelidiki kasus dugaan kekerasan seksual yang dilakukan salah satu peserta program pendidikan dokter spesialis (PPDS) di Rumah Sakit Hasan Sadikin (RSHS) Bandung.

Penyelidikan ini juga dilaksanakan majelis disiplin profesi. "Jika terbukti pelanggaran sesuai dengan peraturan, STR (surat tanda registrasi) akan dicabut. Ini bisa dicabut untuk sementara dan bisa seumur hidup, tergantung dari hasil pemeriksaan nanti," tuturnya.`;

const article9 = `Kasus Pemerkosaan di RSHS, Polisi Lakukan Tes DNA demi Ungkap Pelaku Baru

BANDUNG, KOMPAS — Polda Jawa Barat melakukan tes DNA untuk mengungkap kemungkinan adanya pelaku lain dalam kasus pemerkosaan di Rumah Sakit Hasan Sadikin (RSHS) Bandung. Hal ini dilakukan setelah ditemukan bukti baru dari hasil visum korban.

"Kami menemukan beberapa sampel DNA yang berbeda dari hasil visum korban. Ini menunjukkan kemungkinan ada pelaku lain yang terlibat," ujar Direktur Reserse Kriminal Umum Polda Jabar Komisaris Besar Surawan.

Surawan menambahkan, pihaknya telah mengambil sampel DNA dari beberapa orang yang diduga terkait dengan kasus ini. "Kami sedang menunggu hasil laboratorium forensik untuk memastikan identitas pelaku lain," katanya.`;

const article10 = `Midazolam, Obat Bius dan Kontroversinya dari Dokter Residen di Bandung hingga Hukuman Mati di AS

JAKARTA, KOMPAS — Midazolam, obat bius yang digunakan pelaku pemerkosaan di RSHS Bandung, ternyata memiliki sejarah kontroversial di Amerika Serikat. Obat ini pernah digunakan dalam eksekusi hukuman mati dan menimbulkan perdebatan.

"Midazolam adalah obat golongan benzodiazepine yang biasa digunakan untuk anestesi. Efeknya bisa membuat pasien tidak sadar selama beberapa jam," jelas Prof. Dr. Ike Dharmawan, SpAn, ahli anestesi dari Fakultas Kedokteran UI.

Penggunaan obat ini harus dalam pengawasan ketat dan hanya boleh dilakukan oleh tenaga medis berwenang. "Yang terjadi di RSHS adalah penyalahgunaan yang sangat serius," tambahnya.`;

const article11 = `Evaluasi Psikologis Berkala pada Peserta PPDS untuk Kembalikan Kepercayaan Masyarakat

BANDUNG, KOMPAS — Kasus kekerasan seksual di RSHS Bandung mendorong perlunya evaluasi psikologis berkala bagi peserta Program Pendidikan Dokter Spesialis (PPDS). Hal ini untuk mencegah terulangnya kejadian serupa dan mengembalikan kepercayaan masyarakat.

"Kami akan menerapkan evaluasi psikologis setiap semester untuk semua peserta PPDS," kata Dekan FK Unpad Dr. Setiawan, SpPD. "Ini termasuk tes MMPI (Minnesota Multiphasic Personality Inventory) dan wawancara dengan psikiater."

Selain itu, akan dibentuk tim pengawas khusus yang terdiri dari staf senior RSHS dan FK Unpad.`;

const article12 = `Etika Kedokteran dan Kasus Pemerkosaan oleh Mahasiswa PPDS

JAKARTA, KOMPAS — Kasus pemerkosaan di RSHS Bandung telah mencoreng etika kedokteran. Pelaku telah melanggar sumpah dokter dan kode etik profesi yang seharusnya mengutamakan keselamatan pasien.

"Ini pelanggaran berat terhadap etika kedokteran. Dokter seharusnya melindungi, bukan mencelakai pasien," kata Ketua Majelis Kehormatan Etik Kedokteran (MKEK) IDI, Dr. Sutoto, SpAn.

MKEK akan melakukan sidang etik terhadap pelaku. "Sanksi bisa berupa pencabutan keanggotaan IDI seumur hidup," tegasnya.`;

const article13 = `Sanksi Tegas bagi Mahasiswa PPDS Pelaku Kekerasan Seksual

BANDUNG, KOMPAS — Fakultas Kedokteran Unpad dan RSHS memberikan sanksi tegas kepada mahasiswa PPDS pelaku kekerasan seksual. Sanksi meliputi pemecatan dari program pendidikan dan larangan praktik seumur hidup di RSHS.

"Kami tidak mentolerir tindakan kekerasan seksual dalam bentuk apapun," tegas Rektor Unpad. "Sanksi ini sebagai pembelajaran bagi semua pihak."

RSHS juga akan memperketat pengawasan terhadap mahasiswa PPDS yang bertugas di rumah sakit.`;

const article14 = `Terungkap Kronologi Dugaan Pemerkosaan Dua Pasien oleh Dokter Residen Unpad di RSHS

BANDUNG, KOMPAS — Polda Jabar mengungkap kronologi dugaan pemerkosaan terhadap dua pasien RSHS oleh Priguna Anugrah Pratama. Kedua kasus terjadi sebelum kasus yang terungkap pada Maret 2025.

"Modusnya sama, korban dibius dengan Midazolam saat pemeriksaan," kata Direktur Reskrimum Polda Jabar. "Korban baru berani melapor setelah kasus pertama terungkap."

Kedua korban adalah pasien yang dirawat di RSHS.`;

const article15 = `Keluarga Korban Pemerkosaan Bersuara, Manajemen RSHS Belum Minta Maaf

BANDUNG, KOMPAS — Keluarga korban pemerkosaan di RSHS angkat bicara. Mereka menyatakan pihak manajemen RSHS belum meminta maaf secara langsung atas kejadian tersebut.

"Sampai sekarang belum ada permintaan maaf resmi dari RSHS," kata kuasa hukum keluarga korban, Ahmad Saputra. "Kami menuntut tanggung jawab penuh dari RSHS."

Keluarga korban juga meminta RSHS menanggung biaya pemulihan trauma korban.`;

const article16 = `Pelaku Pemerkosaan di RSHS Ditahan di Polda Jabar

BANDUNG, KOMPAS — Priguna Anugrah Pratama (31), pelaku pemerkosaan di Rumah Sakit Hasan Sadikin (RSHS) Bandung, telah ditahan di Polda Jawa Barat sejak 23 Maret 2025. Penahanan dilakukan setelah pihak keluarga korban melaporkan kasus ini.

"Tersangka PAP telah kami tahan di Polda Jabar sejak tanggal 23 Maret 2025 untuk memudahkan proses penyidikan," ujar Direktur Reserse Kriminal Umum Polda Jabar Komisaris Besar Surawan.

Surawan menambahkan, pelaku terancam hukuman maksimal 12 tahun penjara sesuai dengan pasal 285 KUHP tentang tindak pidana pemerkosaan.`;

const article17 = `Pemerkosaan di Rumah Sakit Hasan Sadikin Bandung, Enam Fakta Mengejutkan Terkuak

BANDUNG, KOMPAS - Terkuak sejumlah fakta mengejutkan di balik kasus dugaan pemerkosaan terhadap tiga perempuan di Rumah Sakit Hasan Sadikin Bandung, Jawa Barat. Pelakunya mahasiswa Program Pendidikan Dokter Spesialis anestesi bernama Priguna Anugrah Pratama ternyata sempat menjalani terapi untuk memulihkan kelainan seksual yang dialaminya, sebelum terjadi pemerkosaan.

Kepolisian Daerah Jawa Barat menahan Priguna (31) setelah menangkapnya di salah satu apartemen pada 23 Maret 2025. Ia lantas diperiksa penyidik.

Direktur Reserse Kriminal Umum Polda Jabar Komisaris Besar Surawan mengatakan Priguna mengaku punya kelainan seksual dan sempat menjalani terapi. Terapi yang dijalaninya itu terkait orientasi seksual yang tak lazim. Priguna mengaku punya fantasi seksual dengan orang yang pingsan.

"Dari pengakuan pelaku, ia selama ini menjalani terapi terkait kelainan tersebut sebelum terjadi kasus tersebut, " kata Direktur Reserse Kriminal Umum Polda Jawa Barat, Komisaris Besar Surawan, Jumat 11/4/2025).

Berdasarkan kronologi waktu, korban pertama adalah seorang pasien RSHS yang diperkosa pada tanggal 10 Maret 2025. Korban kedua juga seorang pasien RSHS yang diperkosa pada tanggal 16 Maret 2025. Sedangkan korban ketiga adalah kerabat pasien RSHS yang diperkosa pada tanggal 18 Maret 2025. Semua kejadian terjadi di salah satu ruangan gedung pelayanan kesehatan ibu dan anak.

Fakta kedua, Priguna menggunakan lima jenis obat bius dalam dugaan pemerkosaan korban pada 18 Maret 2025 di salah satu ruangan gedung pelayanan kesehatan ibu dan anak RSHS. Lima jenis obat ini adalah Midazolam, Propofol, Fentanyl Citrate, Rocurium Bromide dan Ephedrine Hydrochloride.

Midazolam adalah obat bius yang membantu pasien tak merasakan sakit saat operasi. Namun, sejarah mencatat, banyak penyalahgunaan obat ini di luar kebutuhan medis.

Fakta ketiga, terdapat sejumlah modus yang digunakan Priguna untuk menjerat ketiga korbannya, yakni meminta korban melakukan pemeriksaan darah, analisa untuk anestesi, dan uji alergi terhadap obat bius.

Pelaku telah melakukan aksinya secara berulang kali.

Pada kasus korban keluarga pasien, modus Priguna adalah meminta korban melakukan pemeriksaan darah. Saat itulah pelaku membius para korban hingga tak sadarkan diri dan diduga memerkosanya.

Fakta kelima, salah seorang petugas keamanan RSHS mengeluarkan kata-kata yang tidak pantas kepada korban pasca insiden yang menimpanya.

Fakta keenam, Priguna diketahui sempat ingin bunuh diri. Ia menyayat tangannya saat akan ditangkap pihak berwajib.

Kasus dugaan pemerkosaan oleh Priguna viral setelah postingan di akun medsos instagram @ppdsgram pada Selasa (8/4/2025) malam. Postingan ini mendapat respons tanda suka dari 4.357 netizen dan lebih dari 400 komentar.

Priguna adalah mahasiswa Program Pendidikan Program Dokter Spesialis (PPDS) jurusan anestesi dari Fakultas Kedokteran Universitas Padjadjaran.

Pasca kejadian ini, Kementerian Kesehatan menghentikan sementara PPDS anestesi di Rumah Sakit Hasan Sadikin (RSHS). Upaya ini untuk mengevaluasi kembali program pendidikan di rumah sakit terbesar di Jawa Barat ini.

Tanpa didampingi

Direktur Reserse Kriminal Umum Polda Jabar Komisaris Besar Surawan pun menuturkan, pelaku saat melakukan aksinya berdalih untuk pemeriksaan darah dan pemeriksaan alergi terhadap obat bius. Priguna melakukan aksinya tanpa didampingi kerabat maupun dokter penanggung jawab untuk mahasiswa PPDS.

Ia mengungkapkan, pelaku pun sempat meminta kerabat yang mendampingi kedua pasien untuk meninggalkan ruangan. Hal ini untuk memuluskan Priguna diduga melakukan pemerkosaan terhadap dua korban.

"Pelaku telah melakukan aksinya secara berulang kali. Karena itu dia akan dikenakan Pasal 64 KUHP. Ia terancam pidana penjara maksimal 17 tahun penjara, " tuturnya.

Wakil Ketua Komisi Informasi Pusat (KIP) Republik Indonesia, Arya Sandhiyudha, terkait pemerkosaan yang terjadi di RSHS Bandung, ia meminta Kementerian Kesehatan wajib untuk menyampaikan informasi penyikapan atas kasus ini.

Ia berpendapat, kasus ini menimbulkan keresahan warga dan pasien secara meluas dan dapat menurunkan kepercayaan terhadap lembaga kesehatan kesehatan

"Karena sudah mengancam hajat hidup orang banyak dan ketertiban umum, penyikapan atas kasus ini masuk kategori Informasi Serta-Merta pada Pasal 10 ayat 1 Undang-Undang. Kemenkes wajib menyampaikan informasi penyikapan terhadap kasus ini." kata Arya.`;

// Example questions array
const exampleQuestions = [
  "Bagaimana kronologi kasus kekerasan seksual di RSHS?",
  "Siapa pelaku dalam kasus kekerasan seksual di RSHS?",
  "Bagaimana modus operandi pelaku dalam kasus RSHS?",
  "Kapan kasus kekerasan seksual di RSHS terjadi?",
  "Di mana lokasi kejadian kasus kekerasan seksual di RSHS?",
  "Apa tindakan yang diambil pihak RSHS terkait kasus ini?",
  "Bagaimana proses hukum terhadap pelaku kasus RSHS?",
  "Apa dampak kasus ini terhadap korban?",
  "Bagaimana pencegahan kasus serupa di masa depan?"
];

// Function to get random questions
function getRandomQuestions(count: number) {
  const shuffled = [...exampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isContextReady: false
  });
  const [inputValue, setInputValue] = useState('');
  const [randomQuestions] = useState(() => getRandomQuestions(3));

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add all provided articles to context
    const articles = [
      article1,
      article2,
      article3,
      article4,
      article5,
      article6,
      article7,
      article8,
      article9,
      article10,
      article11,
      article12,
      article13,
      article14,
      article15,
      article16,
      article17
    ];

    // Add each article to context and update state when done
    Promise.all(articles.map(article => addArticlesToContext(article)))
      .then(() => {
        setChatState(prev => ({
          ...prev,
          isContextReady: true
        }));
      });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    if (!chatState.isContextReady) {
      setChatState(prev => ({
        ...prev,
        error: 'Mohon tunggu, sistem sedang memuat basis pengetahuan...'
      }));
      return;
    }

    const userMessage: Message = { role: 'user', content };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await getChatResponse([...chatState.messages, userMessage]);
      const assistantMessage: Message = { role: 'assistant', content: response };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Gagal mendapatkan respons. Silakan coba lagi.',
      }));
    }
  };

  const handleExampleClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-800">Chatbot Kekerasan Seksual di RSHS</h1>
          <div className="mt-1 flex items-center gap-2">
            {!chatState.isContextReady && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <p className="text-sm text-gray-500">Memuat basis pengetahuan...</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Initial Message */}
      {!chatState.isContextReady && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Mempersiapkan Chatbot
            </h2>
            <p className="text-gray-600">
              Mohon tunggu sebentar, sistem sedang memuat basis pengetahuan...
            </p>
          </div>
        </div>
      )}

      {/* Chat Container */}
      {chatState.isContextReady && (
        <div className="flex-1 overflow-hidden">
          <div className="max-w-4xl h-full mx-auto bg-white shadow-sm">
            <div 
              ref={chatContainerRef}
              className="h-full overflow-y-auto px-4 py-6 space-y-6"
            >
              {chatState.messages.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Contoh Pertanyaan
                  </h2>
                  <div className="space-y-3 max-w-lg mx-auto">
                    {randomQuestions.map((question, index) => (
                      <button 
                        key={index}
                        onClick={() => handleExampleClick(question)}
                        className="w-full p-3 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors"
                      >
                        <p className="text-blue-800">"{question}"</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatState.messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              
              {chatState.isLoading && <ThinkingMessage />}
              
              {chatState.error && (
                <div className="text-center text-red-500 py-4">
                  {chatState.error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col">
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={chatState.isLoading || !chatState.isContextReady}
            placeholder={chatState.isContextReady ? 
              "Ketik pertanyaan Anda..." : 
              "Mohon tunggu, sistem sedang memuat..."}
            value={inputValue}
            onChange={setInputValue}
          />
          <div className="px-4 pb-2 text-xs text-gray-500 text-center">
            Chatbot bisa salah, cek kembali dengan membaca laporan Kompas.id
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
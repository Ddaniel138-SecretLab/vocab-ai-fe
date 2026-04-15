import React from 'react';
import {
    BusinessCenter as BusinessCenterIcon,
    School as SchoolIcon,
} from '@mui/icons-material';

export const aiTopics = [
    { id: 'office', title: 'Công sở', icon: <BusinessCenterIcon />, color: '#1976d2' },
    { id: 'school', title: 'Trường học', icon: <SchoolIcon />, color: '#9c27b0' },
];

// Mock 30 từ vựng trong DB (Sổ tay)
export const initialNotebookWords = Array.from({ length: 15 }).map((_, index) => ({
    id: `db_word_${index}`,
    word: `Vocabulary ${index + 1}`,
    phonetic: `/vəˈkæb.jə.lər.i/`,
    type: index % 2 === 0 ? 'noun' : 'verb',
    meaning: `Nghĩa tiếng Việt của từ số ${index + 1}`,
    aiExample: `This is an AI generated example for <mark>Vocabulary ${index + 1}</mark>.`,
    status: index % 3 === 0 ? 'mastered' : index % 2 === 0 ? 'learning' : 'new'
}));

// Hàm giả lập AI Gen ra 5 từ vựng mới theo từ khoá
export const generateWordsFromAI = (keyword: string) => {
    return Array.from({ length: 5 }).map((_, i) => ({
        id: `gen_${Date.now()}_${i}`,
        word: `${keyword ? keyword.toUpperCase() : 'NEW'} Word ${i + 1}`,
        phonetic: `/ˈniː.oʊ/`,
        type: 'noun',
        meaning: `Định nghĩa từ liên quan đến: ${keyword}`,
        aiExample: `AI example using <mark>the new word</mark> in context.`,
        status: 'new'
    }));
};

// Helper để lấy title cho các chủ đề (kể cả chủ đề bị ẩn)
export const topicTitles: Record<string, string> = {
    office: 'Giao tiếp Công sở',
    school: 'Tiếng Anh Học thuật',
    construction: 'Kỹ thuật & Công trường',
    travel: 'Du lịch Nước ngoài'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockGeneratedWords: Record<string, any[]> = {
    office: [
        { id: 'o1', word: 'Agile', phonetic: '/ˈædʒ.aɪl/', type: 'adj', meaning: 'Linh hoạt, nhanh nhẹn (phương pháp làm việc)', aiExample: 'We use an <mark>agile</mark> approach to software development.', status: 'new' },
        { id: 'o2', word: 'Synergy', phonetic: '/ˈsɪn.ə.dʒi/', type: 'noun', meaning: 'Sự hiệp lực, sức mạnh tổng hợp', aiExample: 'The merger will create <mark>synergy</mark> between the two teams.', status: 'learning' },
        { id: 'o3', word: 'Delegate', phonetic: '/ˈdel.ɪ.ɡət/', type: 'verb', meaning: 'Giao phó, ủy quyền', aiExample: 'As a manager, you must learn how to <mark>delegate</mark> tasks effectively.', status: 'mastered' },
    ],
    school: [
        { id: 's1', word: 'Hypothesis', phonetic: '/haɪˈpɒθ.ə.sɪs/', type: 'noun', meaning: 'Giả thuyết', aiExample: 'We conducted an experiment to test our <mark>hypothesis</mark>.', status: 'new' },
        { id: 's2', word: 'Plagiarism', phonetic: '/ˈpleɪ.dʒər.ɪ.zəm/', type: 'noun', meaning: 'Đạo văn', aiExample: 'The university has strict rules against <mark>plagiarism</mark>.', status: 'new' },
    ],
    construction: [
        { id: 'c1', word: 'Blueprint', phonetic: '/ˈbluː.prɪnt/', type: 'noun', meaning: 'Bản thiết kế', aiExample: 'The engineers are reviewing the <mark>blueprint</mark> for the new bridge.', status: 'new' },
        { id: 'c2', word: 'Scaffold', phonetic: '/ˈskæf.əld/', type: 'noun', meaning: 'Giàn giáo', aiExample: 'Workers are assembling the <mark>scaffold</mark> outside the building.', status: 'new' },
        { id: 'c3', word: 'Excavate', phonetic: '/ˈek.skə.veɪt/', type: 'verb', meaning: 'Đào, khai quật', aiExample: 'They need to <mark>excavate</mark> the site before laying the foundation.', status: 'learning' },
        { id: 'c4', word: 'Concrete', phonetic: '/ˈkɒŋ.kriːt/', type: 'noun', meaning: 'Bê tông', aiExample: 'Pouring <mark>concrete</mark> requires precise timing and weather conditions.', status: 'mastered' },
        { id: 'c5', word: 'Crane', phonetic: '/kreɪn/', type: 'noun', meaning: 'Cần cẩu', aiExample: 'The heavy <mark>crane</mark> lifted the steel beams onto the top floor.', status: 'new' },
    ],
    travel: [
        { id: 't1', word: 'Itinerary', phonetic: '/aɪˈtɪn.ər.ər.i/', type: 'noun', meaning: 'Lịch trình chuyến đi', aiExample: 'We have a packed <mark>itinerary</mark> for our trip to Japan.', status: 'new' },
        { id: 't2', word: 'Layover', phonetic: '/ˈleɪˌəʊ.vər/', type: 'noun', meaning: 'Thời gian quá cảnh', aiExample: 'I had a six-hour <mark>layover</mark> in Singapore before my final flight.', status: 'learning' },
        { id: 't3', word: 'Souvenir', phonetic: '/ˌsuː.vənˈɪər/', type: 'noun', meaning: 'Quà lưu niệm', aiExample: 'She bought a small magnet as a <mark>souvenir</mark> from Paris.', status: 'new' },
        { id: 't4', word: 'Customs', phonetic: '/ˈkʌs.təmz/', type: 'noun', meaning: 'Hải quan', aiExample: 'It took us an hour to get through <mark>customs</mark> at the airport.', status: 'mastered' },
        { id: 't5', word: 'Excursion', phonetic: '/ɪkˈskɜː.ʃən/', type: 'noun', meaning: 'Chuyến tham quan ngắn', aiExample: 'We booked a day <mark>excursion</mark> to the nearby islands.', status: 'new' },
    ]
};
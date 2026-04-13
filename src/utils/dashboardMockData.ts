export const CONTINUE_LEARNING_TASKS = [
    {
        id: "task_review",
        title: "Ôn tập ngắt quãng",
        description: "Đến hạn ôn tập hôm nay để khắc sâu trí nhớ dài hạn.",
        highlightText: "25 từ vựng",
        buttonText: "Ôn tập ngay",
        type: "review",
    },
    {
        id: "task_new_words",
        title: "Học từ mới (AI Gợi ý)",
        description: "Các từ vựng phù hợp với lộ trình và chuyên ngành của bạn.",
        highlightText: "10 từ mới",
        buttonText: "Bắt đầu học",
        type: "new",
    },
    {
        id: "task_quiz",
        title: "Mini Test: IT Terms",
        description: "Kiểm tra nhanh mức độ ghi nhớ các từ đã học trong tuần qua.",
        highlightText: "15 câu hỏi",
        buttonText: "Làm bài Test",
        type: "quiz",
    },
];

export const WORD_OF_THE_DAY = {
    word: "Meticulous",
    phonetic: "/məˈtɪkjələs/",
    type: "adjective",
    meaning: "Tỉ mỉ, cẩn thận quá mức",
    aiContext: "John is a meticulous software engineer. He double-checks every line of code before committing it, ensuring there are absolutely no bugs in the production environment.",
    translation: "John là một kỹ sư phần mềm tỉ mỉ. Anh ấy kiểm tra lại từng dòng code trước khi commit, đảm bảo rằng hoàn toàn không có lỗi nào trên môi trường production."
};

export const RECOMMENDED_TOPICS = [
    { id: "topic_1", title: "Giao tiếp công sở", icon: "💼", wordsCount: 120 },
    { id: "topic_2", title: "Thuật ngữ IT (Frontend)", icon: "💻", wordsCount: 85 },
    { id: "topic_3", title: "Tiếng Anh Đàm phán", icon: "🤝", wordsCount: 50 },
    { id: "topic_4", title: "Thuyết trình dự án", icon: "📊", wordsCount: 65 },
];
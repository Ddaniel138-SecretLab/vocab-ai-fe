/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, useTheme, Stack, alpha, Chip, Divider, Pagination } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon, Search as SearchIcon } from '@mui/icons-material';

// Import Data & Components
import { aiTopics, initialNotebookWords, generateWordsFromAI } from './constants';
import { SuggestCard } from '@/components/Card/SuggestCard';
import { VocabularyCard } from '@/components/Card/VocabularyCard';
import { SearchInput } from './components/SearchInput';
import { GeneratedWordsSection } from './components/GeneratedWordsSection';

const ITEMS_PER_PAGE = 12;

const Vocabulary: React.FC = () => {
    const theme = useTheme();
    const [promptSearch, setPromptSearch] = useState('');

    const [generatedWords, setGeneratedWords] = useState<any[]>([]);
    const [savedWords, setSavedWords] = useState<any[]>(initialNotebookWords);
    const [page, setPage] = useState(1);

    const handleGenerateWords = (keyword: string = promptSearch) => {
        if (!keyword.trim()) return;
        setPromptSearch(keyword);
        const newWords = generateWordsFromAI(keyword);
        setGeneratedWords(newWords);
    };

    const handleSaveWord = (wordToSave: any) => {
        setGeneratedWords(prev => prev.filter(w => w.id !== wordToSave.id));
        setSavedWords(prev => [wordToSave, ...prev]);
        setPage(1);
    };

    const paginatedSavedWords = useMemo(() => {
        return savedWords.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    }, [savedWords, page]);

    const totalPages = useMemo(() => {
        return Math.ceil(savedWords.length / ITEMS_PER_PAGE);
    }, [savedWords.length]);

    return (
        <Box sx={{ pb: 4 }}>
            {/* ================= SECTION 1 ================= */}
            <Box sx={{ mb: 6 }}>
                <Stack direction="row" sx={{ alignItems: 'center', mb: 2, gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Gợi ý nhanh:</Typography>
                    {aiTopics.map((topic) => (
                        <Chip
                            key={topic.id}
                            icon={topic.icon}
                            label={topic.title}
                            onClick={() => handleGenerateWords(topic.title)}
                            sx={{ bgcolor: alpha(topic.color, 0.1), color: topic.color, fontWeight: 600, '&:hover': { bgcolor: alpha(topic.color, 0.2) } }}
                        />
                    ))}
                </Stack>

                <SearchInput onSearch={handleGenerateWords} />

                <GeneratedWordsSection 
                    words={generatedWords} 
                    onSave={handleSaveWord} 
                />
            </Box>

            {/* ================= SECTION 2 ================= */}
            <Box>
                {/* Fix Stack */}
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Sổ tay từ vựng ({savedWords.length} từ)
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 2.5,
                    }}
                >
                    {paginatedSavedWords.map((item) => (
                        <VocabularyCard key={item.id} item={item} />
                    ))}
                </Box>

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Vocabulary;
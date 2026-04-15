
import React, { useMemo, useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, useTheme, Stack, alpha, Chip, Divider, Pagination } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon, Search as SearchIcon } from '@mui/icons-material';

export const SearchInput = ({ onSearch }: { onSearch: (keyword: string) => void }) => {
    const [localValue, setLocalValue] = useState('');

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập từ khoá (VD: Hợp đồng, du lịch biển...) để AI sinh ra từ vựng..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(localValue)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button variant="contained" onClick={() => onSearch(localValue)} startIcon={<AutoAwesomeIcon />}>
                                Tạo từ vựng
                            </Button>
                        </InputAdornment>
                    )
                }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'background.paper' } }}
        />
    );
};
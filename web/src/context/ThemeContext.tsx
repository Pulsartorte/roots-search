import React, { createContext, useState, useContext, ReactNode } from 'react';
import {lightTheme, darkTheme} from '../theme/theme'; // Importiere beide Themes
import {ThemeProvider as MUIThemeProvider, createTheme, CssBaseline} from '@mui/material';
import { DataGrid, deDE as dataGridDeDE } from '@mui/x-data-grid';
import { deDE as coreDeDE } from '@mui/material/locale'; // Deutsch für andere MUI-Komponenten

import {GlobalStyles, Box, Switch, FormControlLabel} from '@mui/material';
type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode)); // Speichere im localStorage
            return newMode;
        });
    };

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        body: { backgroundColor: "transparent"},
                        /* Scrollbar Styles, abhängig vom aktuellen Theme */
                        '::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px',
                        },
                        '::-webkit-scrollbar-track': {
                            background: theme.palette.background.paper,
                            borderRadius: '10px',
                        },
                        '::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '10px',
                            border: `2px solid ${theme.palette.background.paper}`,
                        },
                        '::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};

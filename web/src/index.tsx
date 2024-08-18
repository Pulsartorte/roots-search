import * as React from 'react';
import {ThemeProvider as MUIThemeProvider, createTheme, CssBaseline} from '@mui/material';
import App from './modules/App';
import {VisibilityProvider} from './providers/VisibilityProvider';
import {createRoot} from 'react-dom/client';
import {GlobalStyles, Box, Switch, FormControlLabel} from '@mui/material';
import {lightTheme, darkTheme} from './theme/theme'; // Importiere beide Themes
import {ThemeProvider, useThemeContext} from './context/ThemeContext';
import {DocumentProvider} from './providers/DocumentProvider';
import DocumentViewFromPlayer from './modules/documents/components/DocumentViewFromPlayer';

const root = createRoot(document.getElementById('root')!);

function RootComponent() {
    const {darkMode} = useThemeContext();

    return (
        <MUIThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <VisibilityProvider>
                <CssBaseline/>
                <GlobalStyles
                    styles={{
                        body: {backgroundColor: "transparent"},
                    }}
                />
                <Box style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <App/>
                </Box>
            </VisibilityProvider>
            <DocumentProvider>
                <CssBaseline/>
                <GlobalStyles
                    styles={{
                        body: {backgroundColor: "transparent"},
                    }}
                />
                <Box style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <DocumentViewFromPlayer/>
                </Box>
            </DocumentProvider>
        </MUIThemeProvider>
    );
}

root.render(
    <ThemeProvider>
        <RootComponent/>
    </ThemeProvider>
);

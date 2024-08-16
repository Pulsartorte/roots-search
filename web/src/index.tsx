import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import App from './modules/App';
import {VisibilityProvider} from './providers/VisibilityProvider';
import {createRoot} from 'react-dom/client';
import {GlobalStyles, Box, Switch, FormControlLabel} from '@mui/material';
import {lightTheme, darkTheme} from './theme/theme'; // Importiere beide Themes
import {DocumentProvider} from './providers/DocumentProvider';
import DocumentViewFromPlayer from './modules/documents/components/DocumentViewFromPlayer';

const root = createRoot(document.getElementById('root')!);

function RootComponent() {
    const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem('theme') === 'dark');

    const handleToggle = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    };

    return (
        <React.StrictMode>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <CssBaseline/>
                <GlobalStyles
                    styles={{
                        body: {backgroundColor: "transparent"},
                    }}
                />
                <Box
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%", // Passe die Breite nach Bedarf an
                        height: "auto", // Nutze auto oder eine feste Höhe
                        display: 'flex',
                        flexDirection: 'column', // Ensures that children are stacked vertically
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <VisibilityProvider>
                        <Box style={{
                            alignSelf: 'flex-end',
                            marginRight: 'auto',
                            marginLeft: '20px'
                        }}> {/* Toggle nach links verschieben */}
                            <FormControlLabel
                                control={<Switch checked={darkMode} onChange={handleToggle}/>}
                                label="Dark Mode"
                                style={{position: 'fixed', top: 10, right: 10, zIndex: 1000}}
                            />
                        </Box>
                        <App/>
                    </VisibilityProvider>
                </Box>

                <DocumentProvider>
                    <CssBaseline/>
                    <GlobalStyles
                        styles={{
                            body: {backgroundColor: "transparent"},
                        }}
                    />
                    <Box
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            height: "100%",
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <DocumentViewFromPlayer/>
                    </Box>
                </DocumentProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

root.render(<RootComponent/>);

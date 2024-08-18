import {createTheme} from '@mui/material/styles';
import {colors} from '../AppConfig';


const breakpoints = {
    values: {
        xs: 0,
        sm: 800,
        md: 1280,
        lg: 1600,
        xl: 1920,
    },
};

const commonSettings = {
    breakpoints,
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none', // Keine Großbuchstaben
                    padding: '8px 16px',
                },
                containedPrimary: {
                    backgroundColor: colors.roots_light_green,
                    '&:hover': {
                        backgroundColor: colors.roots_middle_green,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.roots_light_green,
                    color: colors.roots_creme,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    width: '240px',
                    padding: '16px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        borderRadius: '8px',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: colors.roots_light_green,
                        },
                        '&:hover fieldset': {
                            borderColor: colors.roots_middle_green,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.roots_middle_green,
                        },
                    },
                },
            },
        },
    },
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: colors.lightAccentPrimary, // Akzentfarbe für Buttons, Links
        },
        secondary: {
            main: colors.lightSecondaryBackground, // Sekundärfarbe für Container (Modal)
        },
        background: {
            default: colors.lightPrimaryBackground, // Hintergrundfarbe des gesamten Layouts
            paper: colors.lightSecondaryBackground, // Hintergrund für Papier-Komponenten (Modal)
        },
        text: {
            primary: colors.lightTextPrimary, // Textfarbe auf hellem Hintergrund
            secondary: colors.lightTextSecondary, // Sekundärer Text (z.B. Labels)
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h5: {
            fontWeight: 600,
            color: colors.lightTextPrimary, // Überschriftenfarbe
        },
        body1: {
            color: colors.lightTextPrimary, // Textfarbe im Body
        },
    },
    components: {
        // Anpassung des MuiPaper (Modal-Hintergrund)
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.lightSecondaryBackground, // Heller Hintergrund für Modal
                    color: colors.lightTextPrimary, // Dunkler Text
                    padding: '16px', // Standard-Padding
                },
            },
        },

        // Anpassung des MuiTextField (Eingabefelder)
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.lightInputBackground, // Dunkleres Beige/Grau für Eingabefelder
                    '& .MuiInputBase-input': {
                        color: colors.lightTextPrimary, // Dunkler Text in Textfeldern
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: colors.lightBorderDark, // Dunklerer Rahmen für Eingabefelder
                        },
                        '&:hover fieldset': {
                            borderColor: colors.lightAccentTertiary, // Rahmenfarbe bei Hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.lightAccentPrimary, // Rahmenfarbe bei Fokus
                        },
                    },
                },
            },
        },

        // Anpassung des MuiButton (Schaltflächen)
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.lightAccentPrimary, // Grün für Schaltflächen
                    color: colors.lightPrimaryBackground, // Heller Text auf Buttons
                    '&:hover': {
                        backgroundColor: colors.lightAccentTertiary, // Sanftes Blau beim Hover
                    },
                },
            },
        },

        // Anpassung des MuiAppBar (Navigationsleiste oben)
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.lightSecondaryBackground, // Weiches Creme für die AppBar
                    color: colors.lightTextPrimary, // Dunkler Text in der AppBar
                },
            },
        },

        // Anpassung des MuiDrawer (Seitliche Navigationsleiste)
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.lightSecondaryBackground, // Heller Hintergrund für Drawer
                    color: colors.lightTextPrimary, // Dunkler Text
                },
            },
        },

        // Anpassung des MuiCheckbox (Checkboxen)
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: colors.lightBorderDark, // Dunklerer Rahmen der Checkbox im nicht ausgewählten Zustand
                    '&.Mui-checked': {
                        color: colors.lightAccentPrimary, // Farbe der Checkbox im ausgewählten Zustand
                        '& .MuiSvgIcon-root': {
                            fill: colors.lightAccentSecondary, // Helle Farbe für den Haken bei aktiver Checkbox
                        },
                    },
                },
            },
        },
    },
    breakpoints,
});

/*const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: colors.darkAccentPrimary, // Hauptfarbe für Buttons, Text etc.
        },
        secondary: {
            main: colors.darkSecondaryBackground, // Sekundärfarbe für zusätzliche Highlights
        },
        background: {
            default: colors.darkPrimaryBackground, // Dunkler Hintergrund für das gesamte Layout
            paper: colors.darkSecondaryBackground, // Dunkler Hintergrund für Papier-Komponenten
        },
        text: {
            primary: colors.darkTextPrimary, // Heller Text auf dunklem Hintergrund
            secondary: colors.darkTextSecondary, // Sekundärer Text (z.B. Labels)
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h5: {
            fontWeight: 600,
            color: colors.darkTextPrimary, // Helle Überschriftenfarbe
        },
        body1: {
            color: colors.darkTextPrimary, // Helle Textfarbe im Body
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.darkSecondaryBackground, // Dunkler Hintergrund für Paper-Komponenten
                    color: colors.darkTextPrimary, // Heller Text
                    padding: '16px', // Standard-Padding
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.darkAccentPrimary, // Grün für Schaltflächen
                    color: colors.darkPrimaryBackground, // Dunkler Text auf hellen Schaltflächen
                    '&:hover': {
                        backgroundColor: colors.darkAccentPrimary, // Bleibt bei Hover gleich
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.darkSecondaryBackground, // Dunkler Hintergrund für AppBar
                    color: colors.darkTextPrimary, // Heller Text in der AppBar
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.darkSecondaryBackground, // Dunkler Hintergrund für Drawer
                    color: colors.darkTextPrimary, // Heller Text
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.darkSecondaryBackground, // Dunkler Hintergrund für Textfelder
                    '& .MuiInputBase-input': {
                        color: colors.darkTextPrimary, // Heller Text in Textfeldern
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: colors.darkAccentPrimary, // Rahmenfarbe
                        },
                        '&:hover fieldset': {
                            borderColor: colors.darkTextSecondary, // Rahmenfarbe bei Hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.darkAccentPrimary, // Rahmenfarbe bei Fokus
                        },
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: colors.darkAccentPrimary, // Farbe der Checkbox im nicht ausgewählten Zustand
                    '&.Mui-checked': {
                        color: colors.darkAccentPrimary, // Farbe der Checkbox im ausgewählten Zustand
                    },
                },
            },
        },
    },
});*/



const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: colors.roots_light_green, // Hauptfarbe für Buttons, Text etc.
        },
        secondary: {
            main: colors.roots_creme, // Sekundärfarbe für zusätzliche Highlights
        },
        background: {
            default: colors.background_dark, // Dunkler Hintergrund für das gesamte Layout
            paper: colors.text_dark, // Dunkler Hintergrund für Papier-Komponenten
        },
        text: {
            primary: colors.text_light, // Heller Text auf dunklem Hintergrund
            secondary: colors.roots_light_green, // Sekundärer Text (z.B. Labels)
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h5: {
            fontWeight: 600,
            color: colors.text_light, // Helle Überschriftenfarbe
        },
        body1: {
            color: colors.text_light, // Helle Textfarbe im Body
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.text_dark, // Dunkler Hintergrund für Paper-Komponenten
                    color: colors.text_light, // Heller Text
                    padding: '16px', // Standard-Padding
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.roots_light_green, // Grün für Schaltflächen
                    color: colors.text_dark, // Dunkler Text auf hellen Schaltflächen
                    '&:hover': {
                        backgroundColor: colors.roots_light_green, // Bleibt bei Hover gleich
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.background_dark, // Dunkler Hintergrund für AppBar
                    color: colors.roots_creme, // Heller Text in der AppBar
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.background_dark, // Dunkler Hintergrund für Drawer
                    color: colors.text_light, // Heller Text
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.background_dark, // Dunkler Hintergrund für Textfelder
                    '& .MuiInputBase-input': {
                        color: colors.text_light, // Heller Text in Textfeldern
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: colors.roots_light_green, // Rahmenfarbe
                        },
                        '&:hover fieldset': {
                            borderColor: colors.roots_creme, // Rahmenfarbe bei Hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.roots_light_green, // Rahmenfarbe bei Fokus
                        },
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: colors.roots_light_green, // Farbe der Checkbox im nicht ausgewählten Zustand
                    '&.Mui-checked': {
                        color: colors.roots_light_green, // Farbe der Checkbox im ausgewählten Zustand
                    },
                },
            },
        },
    },
    breakpoints,
});



export {lightTheme, darkTheme};

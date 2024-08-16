import { createTheme } from '@mui/material/styles';
import { colors } from '../AppConfig';

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
                    backgroundColor: colors.roots_creme,
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
                    backgroundColor: colors.roots_creme,
                    color: colors.roots_dark_green,
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
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell': {
                        borderColor: colors.roots_middle_green,
                        color: colors.roots_creme,
                        backgroundColor: colors.roots_dark_green,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderColor: colors.roots_light_green,
                        color: colors.roots_creme,
                        backgroundColor: colors.roots_darkest_green,
                    },
                    '& .MuiSvgIcon-root': {
                        color: colors.roots_beige,
                    },
                },
            },
        },
    },
};

const lightTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'light',
        primary: {
            main: colors.roots_light_green,
        },
        secondary: {
            main: colors.roots_creme,
        },
        background: {
            default: colors.roots_creme,
            paper: '#FFFFFF',
        },
        text: {
            primary: colors.roots_dark_green,
            secondary: colors.roots_middle_green,
        },
    },
    components: {
        ...commonSettings.components,
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell': {
                        color: colors.roots_dark_green,
                        backgroundColor: colors.roots_creme,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        color: colors.roots_dark_green,
                        backgroundColor: colors.roots_creme,
                    },
                    '& .MuiSvgIcon-root': {
                        color: colors.roots_brown,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.roots_light_green,
                    color: colors.roots_dark_green,
                },
            },
        },
    },
});

const darkTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'dark',
        primary: {
            main: colors.roots_light_green,
        },
        secondary: {
            main: colors.roots_creme,
        },
        background: {
            default: colors.roots_darkest_green,
            paper: colors.roots_dark_green,
        },
        text: {
            primary: colors.roots_creme,
            secondary: colors.roots_light_green,
        },
    },
    components: {
        ...commonSettings.components,
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell': {
                        color: colors.roots_creme,
                        backgroundColor: colors.roots_dark_green,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        color: colors.roots_creme,
                        backgroundColor: colors.roots_darkest_green,
                    },
                    '& .MuiSvgIcon-root': {
                        color: colors.roots_beige,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.roots_dark_green,
                    color: colors.roots_creme,
                },
            },
        },
    },
});

export { lightTheme, darkTheme };

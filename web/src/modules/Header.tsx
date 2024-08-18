import {Typography, IconButton, styled, Box, FormControlLabel, Switch, useTheme} from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import {VisibilityCtx} from "../providers/VisibilityProvider";
import { useThemeContext } from "../context/ThemeContext";
import {isEnvBrowser} from "../utils/misc";
import {fetchNui} from "../utils/fetchNui";
import {useContext} from "react";
import * as React from "react";

type Props = {
    title: string
}

const Header = ({title}: Props) => {
    const {setVisible, visible} = useContext(VisibilityCtx)
    const { darkMode, toggleDarkMode } = useThemeContext(); // Verwende den ThemeContext

    return (
        <Container>
            <Typography variant="h6" component="div" color="primary.default" sx={{flexGrow: 1, color: "primary.main"}}>
                {title}
            </Typography>
            <Box sx={{
                display: 'flex',
                alignItems: 'center', // Zentriert den Switch vertikal
            }}> {/* Toggle nach links verschieben */}
                <FormControlLabel
                    control={<Switch checked={darkMode} onChange={toggleDarkMode}/>}
                    label="Dark Mode"
                    /*style={{position: 'fixed', top: 10, right: 10, zIndex: 1000}}*/
                    sx={{
                        marginRight: 2, // Abstand zum IconButton
                        marginLeft: 2, // Optional: Abstand nach links, wenn nötig
                    }}
                />
            </Box>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                    marginRight: 2,
                    alignSelf: 'center' // Zentriert das Icon vertikal innerhalb der Flexbox
                }}
                onClick={() => {
                    if (!isEnvBrowser()) fetchNui("hideFrame");
                    else setVisible(!visible);
                }}
            >
                <LogoutIcon/>
            </IconButton>
        </Container>
    )
}

const Container = styled("div")`
    display: flex;
    margin-bottom: 0.7vh;
`

export default Header
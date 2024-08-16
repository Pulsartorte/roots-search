import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Typography, IconButton, CircularProgress, Autocomplete
} from "@mui/material"
import {texts} from "../../../AppConfig"
import React, {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
    open: boolean,
    handleAgree: (quantity: number, selectedPlayer: Player) => void,
    handleCancel: () => void,
    players: Player[],
    playersLoading: boolean
    title: string,
    text: string,
}

const GiveItemToPlayerDialog = ({open, handleAgree, handleCancel, title, text, players, playersLoading}: Props) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const handleAgreeClick = () => {
        if (quantity >= 1 && selectedPlayer != undefined)  {
            handleAgree(quantity, selectedPlayer);
            setQuantity(1);  // Clear the input after agree
            setSelectedPlayer(null)
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
        >
            <DialogTitle>
                <Typography variant="h5" gutterBottom style={{marginBottom: "1vh"}}>
                    {texts.giveItemTitle}
                </Typography>

                <IconButton
                    style={{position: 'absolute', top: "1vh", right: "1vh"}}
                    onClick={handleCancel}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div dangerouslySetInnerHTML={{__html: text}} style={{marginBottom: "1vh"}}/>
                    <Autocomplete
                        fullWidth
                        value={selectedPlayer}
                        onChange={(event, newValue) => setSelectedPlayer(newValue)}
                        options={players}
                        getOptionLabel={(option) => option.name}
                        loading={playersLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={texts.selectPlayers}
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {playersLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label={texts.itemQuantityToGive}
                        type="number"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value === '' ? 1 : Number(e.target.value))}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="success" onClick={handleAgreeClick} autoFocus
                        fullWidth>{texts.givePlayer}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default GiveItemToPlayerDialog
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Typography, IconButton, CircularProgress, Autocomplete, Avatar
} from "@mui/material"
import {itemImagePrefix, texts} from "../../../AppConfig"
import React, {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {Box} from "@mui/system";

type Props = {
    open: boolean,
    handleAgree: (quantity: number, selectedPlayer: Player) => void,
    handleCancel: () => void,
    players: Player[],
    playersLoading: boolean
    title: string,
    text: string,
    itemData: Item | undefined
}

const GiveItemToPlayerDialog = ({
                                    open,
                                    handleAgree,
                                    handleCancel,
                                    title,
                                    text,
                                    players,
                                    playersLoading,
                                    itemData
                                }: Props) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const handleAgreeClick = () => {
        if (quantity >= 1 && selectedPlayer != undefined) {
            handleAgree(quantity, selectedPlayer);
            setQuantity(1);  // Clear the input after agree
            setSelectedPlayer(null)
        }
    };

    const getTextWithVariable = (key: string, variable: string) => {
        return `${key}${variable}`;
    };

    const itemImageUrl = getTextWithVariable(itemImagePrefix, itemData?.image || '');

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            style={{ minWidth: '400px' }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            src={itemImageUrl}
                            alt={itemData?.image}
                            style={{
                                width: '50px',
                                height: '50px',
                                marginRight: '10px'
                            }} // marginRight für Abstand zum Text
                        />
                        <Typography variant="h5" gutterBottom style={{marginBottom: "1vh"}}>
                            {`${title} ${texts.jobEdit}`}
                        </Typography>
                    </Box>
                    <IconButton
                        style={{position: 'absolute', top: "1vh", right: "1vh"}}
                        onClick={handleCancel}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>
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
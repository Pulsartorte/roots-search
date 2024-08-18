import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Typography, IconButton, CircularProgress, Autocomplete, FormControlLabel, Checkbox, Tooltip, Avatar
} from "@mui/material"
import {itemImagePrefix, texts} from "../../../AppConfig"
import React, {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {Box} from "@mui/system";

type Props = {
    open: boolean,
    handleAgree: (grade: number, selectedPlayer: Player, isMultiJob: boolean) => void
    handleCancel: () => void
    players: Player[]
    playersLoading: boolean
    grades: Grade[]
    gradesLoading: boolean
    title: string,
    text: string,
    jobData: Job | undefined
}

const SetJobToPlayerDialog = ({
                                  open,
                                  handleAgree,
                                  handleCancel,
                                  title,
                                  text,
                                  grades,
                                  gradesLoading,
                                  players,
                                  playersLoading,
                                  jobData
                              }: Props) => {
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isMultiJob, setIsMultiJob] = useState(false);

    const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsMultiJob(event.target.checked);
    };


    const handleAgreeClick = () => {
        if (selectedGrade != undefined && selectedPlayer != undefined) {
            handleAgree(selectedGrade.order, selectedPlayer, isMultiJob);
            setSelectedGrade(null)
            setSelectedPlayer(null)
            setIsMultiJob(false)
        }
    };

    const handleCancelClick = () => {
        if (debugMode){
            console.log('Grade before closing')
            console.log(selectedGrade)
        }
        setSelectedGrade(null)
        setSelectedPlayer(null)
        setIsMultiJob(false)
        handleCancel()
        if (debugMode){
            console.log('Grade before closing')
            console.log(selectedGrade)
        }
    }

    const getTextWithVariable = (key: string, variable: string) => {
        return `${key}${variable}`;
    };

    const serviceImageUrl = getTextWithVariable(itemImagePrefix, jobData?.name || '');

    return (
        <Dialog
            open={open}
            onClose={handleCancelClick}
            style={{minWidth: '400px'}}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            src={serviceImageUrl}
                            alt={jobData?.name}
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
                        onClick={handleCancelClick}
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
                        style={{marginBottom: "1vh"}}
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

                    <Autocomplete
                        fullWidth
                        value={selectedGrade}
                        onChange={(event, newValue) => setSelectedGrade(newValue)}
                        options={grades}
                        getOptionLabel={(option) => {
                            const bossText = option.isboss ? " | Boss" : "";  // Text für Boss-Rang
                            const paymentText = `$${option.payment}`;  // Gehaltsangabe
                            return `${option.name} [${paymentText}${bossText}]`;  // Kombinierter Name für Anzeige
                        }}
                        loading={gradesLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={texts.selectJobGrade}
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {gradesLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    {/* Add Multijob */}
                    <Tooltip
                        title={<span style={{fontSize: '1.2rem'}}>{texts.isMultiJobTooltip}</span>} // Der Tooltip-Text
                        arrow // Optional: zeigt einen Pfeil unterhalb des Tooltips
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isMultiJob}
                                    onChange={handleCheckboxChange}
                                    color="primary"
                                />
                            }
                            label={texts.isMultiJob}  // Beschriftung der Checkbox
                            style={{marginTop: "1vh"}}  // Optional: Abstand zum oberen Element
                        />
                    </Tooltip>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="success" onClick={handleAgreeClick} autoFocus
                        fullWidth>{texts.setJobToPlayer}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SetJobToPlayerDialog
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Typography, IconButton, Autocomplete, CircularProgress, FormControlLabel, Checkbox, Tooltip, Avatar
} from "@mui/material"
import {itemImagePrefix, texts} from "../../../AppConfig"
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {Box} from "@mui/system";

type Props = {
    open: boolean
    handleAgree: (grade: number, isMultiJob: boolean) => void
    handleCancel: () => void
    title: string
    text: string
    grades: Grade[]
    gradesLoading: boolean
    jobData: Job | undefined
}

const SetJobDialog = ({open, handleAgree, handleCancel, title, text, grades, gradesLoading, jobData}: Props) => {
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [isMultiJob, setIsMultiJob] = useState(false);

    const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsMultiJob(event.target.checked);
    };

    const handleAgreeClick = () => {
        if (selectedGrade != undefined) {
            handleAgree(selectedGrade.order, isMultiJob);
            setIsMultiJob(false)
            setSelectedGrade(null)
        }
    };

    const handleCancelClick = () => {
        console.log('Grade before closing')
        console.log(selectedGrade)
        setSelectedGrade(null)
        setIsMultiJob(false)
        handleCancel()
        console.log('Grade after closing')
        console.log(selectedGrade)
    }

    const getTextWithVariable = (key: string, variable: string) => {
        return `${key}${variable}`;
    };

    const serviceImageUrl = getTextWithVariable(itemImagePrefix, jobData?.name || '');

    return (
        <Dialog
            open={open}
            onClose={handleCancelClick}
            style={{ minWidth: '400px' }}
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
                        title={<span style={{ fontSize: '1.2rem' }}>{texts.isMultiJobTooltip}</span>} // Der Tooltip-Text
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
                        fullWidth>{texts.setJob}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SetJobDialog
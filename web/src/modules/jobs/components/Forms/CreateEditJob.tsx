import {
    Avatar,
    Button,
    Card,
    CardContent, Checkbox, Divider, FormControl,
    FormControlLabel,
    Grid,
    IconButton, Input, InputAdornment, InputLabel,
    MenuItem,
    Select,
    styled,
    TextField, Typography
} from "@mui/material"
import {Box} from "@mui/system"
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import {Controller, SubmitHandler, useFieldArray, useForm} from "react-hook-form";
import {jobImagePrefix, texts} from "../../../../AppConfig";
import jobs from "../../Pages/Jobs";
import React, {useCallback, useEffect, useState} from "react";
import {Image} from "@mui/icons-material";
import {watch} from "node:fs";
import AddIcon from "@mui/icons-material/Add";

type Props = {
    jobs?: Job[] | null
    jobData?: Job
    handleCreate: (data: Job) => void
    handleEdit: (data: Job) => void
    handleClose: () => void;
}

const CreateEditJob = ({jobs, jobData, handleCreate, handleEdit, handleClose}: Props) => {
    const {register, handleSubmit, formState: {errors}, watch, control, setValue, reset} = useForm<Job>({
        defaultValues: jobData ?? {
            name: "",
            label: "",
            type: "item",
            defaultDuty: false,
            offDutyPay: false,
            grades: [],
        }
    });
    const {fields: formFields, append, remove, replace} = useFieldArray({
        control,
        name: "grades",
        rules: {required: texts.requiredError}
    })
    /*console.log('Print JobData:')
    console.log(jobData)*/


    const [grades, setGrades] = useState<Grade[]>([])
    const [gradesLoading, setGradesLoading] = useState(false)

    const handleGetGrades = useCallback(() => {
        setGradesLoading(true);

        if (jobData?.grades) {
            const gradesArray = jobData.grades
            // Sortieren nach dem order-Feld
            gradesArray.sort((a, b) => a.order - b.order);
            setGrades(gradesArray); // Das verarbeitete und sortierte Array in den Zustand setzen
        } else {
            setGrades([]); // Fallback: Leeres Array, falls keine Grades vorhanden sind
            console.log('jobToSet is empty or has no grades');
        }

        setGradesLoading(false);
    }, [jobData]);

    useEffect(() => {
        if (jobData) {
            handleGetGrades();
        }
    }, [jobData, handleGetGrades]);


    const handleCreateJob: SubmitHandler<Job> = (data: Job) => {
        handleCreate(data)
    }

    const handleEditJob: SubmitHandler<Job> = (data: Job) => {
        handleEdit(data)
    }

    const handleAddGrade = () => {
        const newOrder = formFields.length; // Die Länge des aktuellen Arrays entspricht dem nächsten Index
        append({
            name: "",
            payment: 0,
            isboss: false,
            order: newOrder,  // Setzen des order-Feldes basierend auf der aktuellen Länge
        });
    };

    const getTextWithVariable = (key: string, variable: string) => {
        return `${key}${variable}`;
    };

    const imageUrl = getTextWithVariable(jobImagePrefix, jobData?.name || '');

    // Log the form values and errors
    const formValues = watch();
    useEffect(() => {
        console.log('Form Values:', formValues);
        console.log('Form Errors:', errors);
    }, [formValues, errors]);

    const validateName = (name: string) => {
        const nameExists = jobs?.some(item => item.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            return 'Name ist bereits vergeben!';
        } else {
            return true;
        }
    };

    const isEditMode = Boolean(jobData?.name);


    return (
        <form onSubmit={jobData ? handleSubmit(handleEditJob) : handleSubmit(handleCreateJob)}>
            <StyledDocument>
                <Box style={{width: "calc(60vh - 3.6vh)"}}>
                    <Typography variant="h5" gutterBottom style={{marginBottom: "1vh"}}>
                        {jobData ? texts.editJobTitle : texts.createJobTitle}
                    </Typography>

                    <IconButton
                        style={{position: 'absolute', top: "1vh", right: "1vh"}}
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Grid container spacing={2} width="100%">
                        <Grid item xs={6}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'Name ist erforderlich!',
                                    validate: !isEditMode ? validateName : undefined
                                }}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={texts.itemName}
                                        error={!!errors.name}
                                        helperText={errors.name?.message as string}
                                        fullWidth
                                        size="small"
                                        disabled={Boolean(jobData?.name)}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (!isEditMode) {
                                                validateName(e.target.value);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="label"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={texts.itemLabel}
                                        error={!!errors.label}
                                        helperText={errors.label?.message as string}
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="type"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>{texts.jobType}</InputLabel>
                                        <Select
                                            {...field}
                                            error={!!errors.type}
                                            label={texts.jobType}
                                        >
                                            <MenuItem value="leo">LEO</MenuItem>
                                            <MenuItem value="ems">EMS</MenuItem>
                                            <MenuItem value="mechanic">MECHANIC</MenuItem>
                                            <MenuItem value="job">JOB</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name="defaultDuty"
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={texts.jobDefaultDuty}
                                        checked={field.value}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name="offDutyPay"
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={texts.jobOffDutyPay}
                                        checked={field.value}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                {texts.jobGrades} {/* Titel über der Trennlinie */}
                            </Typography>
                            <Divider style={{marginBottom: "16px"}}/> {/* Trennlinie */}
                        </Grid>
                        <Grid item container spacing={2} style={{marginTop: "4px", maxHeight: '400px', overflowY: 'auto' }}>
                                {formFields.map((f, i) => (
                                    <Grid item container xs={12} spacing={2} key={f.id} alignItems="center">
                                        <Grid item xs={4}>
                                            <JobTextField
                                                style={{width: "100%"}}
                                                size="small"
                                                label={texts.jobName}
                                                error={!!errors?.grades?.[i]?.name}
                                                helperText={errors?.grades?.[i]?.name?.message as string}
                                                {...register(`grades.${i}.name`)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <JobTextField
                                                style={{width: "100%"}}
                                                size="small"
                                                label={texts.jobPayment}
                                                type="number"
                                                error={!!errors?.grades?.[i]?.payment}
                                                helperText={errors?.grades?.[i]?.payment?.message as string}
                                                {...register(`grades.${i}.payment`)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Controller
                                                name={`grades.${i}.isboss`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                {...field}
                                                                checked={field.value || false}
                                                            />
                                                        }
                                                        label={texts.jobIsBoss} // Optional: Beschriftung neben der Checkbox
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => remove(i)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                                {formFields.length < 12 && (
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={ handleAddGrade }
                                            style={{width: "100%"}}
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                        >
                                            {texts.jobAddGrade}
                                        </Button>
                                    </Grid>
                                )}
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" style={{marginTop: "1.5vh"}}>
                        <Button type="submit" variant="contained" color="success" fullWidth>
                            {jobData ? texts.editJobBtn : texts.createJobBtn}
                        </Button>
                    </Grid>
                </Box>
            </StyledDocument>
        </form>
    )
}

export default CreateEditJob

const StyledDocument = styled("div")`
    width: 60vh;
    //height: 90vh;
    display: flex;
    align-content: center;
    justify-content: center;
    padding: 1.8vh;

`

const JobTextField = styled(TextField)`
    width: 100%;
`

const DummyText = styled("div")`
    height: 1.8vh;
    background: lightgray;
    border-radius: 1px;
    width: 100%
`
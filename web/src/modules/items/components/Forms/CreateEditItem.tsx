import {
    Avatar,
    Button,
    Card,
    CardContent, Checkbox, FormControl,
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
import {imagePrefix, texts} from "../../../../AppConfig";
import items from "../../Pages/Items";
import React, {useEffect, useState} from "react";
import {Image} from "@mui/icons-material";
import {watch} from "node:fs";

type Props = {
    items?: Item[] | null
    itemData?: Item
    handleCreate: (data: Item) => void
    handleEdit: (data: Item) => void
    handleClose: () => void;
}

const CreateEditItem = ({items, itemData, handleCreate, handleEdit, handleClose}: Props) => {
    const {register, handleSubmit, formState: {errors}, watch, control} = useForm<Item>({
        defaultValues: itemData ?? {
            name: "",
            label: "",
            weight: 0,
            type: "item",
            unique: false,
            useable: false,
            shouldClose: false,
            combinable: "",
            description: "Beschreibung",
            image: "",
            ammotype: "",
        }
    });

    const handleCreateItem: SubmitHandler<Item> = (data: Item) => {
        handleCreate(data)
    }

    const handleEditItem: SubmitHandler<Item> = (data: Item) => {
        handleEdit(data)
    }

    const getTextWithVariable = (key: string, variable: string) => {
        return `${key}${variable}`;
    };

    const imageUrl = getTextWithVariable(imagePrefix, itemData?.image || '');

    // Log the form values and errors
    const formValues = watch();
    useEffect(() => {
        console.log('Form Values:', formValues);
        console.log('Form Errors:', errors);
    }, [formValues, errors]);

    const validateName = (name: string) => {
        const nameExists = items?.some(item => item.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            return 'Name ist bereits vergeben!';
        } else {
            return true;
        }
    };

    const isEditMode = Boolean(itemData?.name);


    return (
        <form onSubmit={itemData ? handleSubmit(handleEditItem) : handleSubmit(handleCreateItem)}>
            <StyledDocument>
                <Box style={{width: "calc(60vh - 3.6vh)"}}>
                    <Typography variant="h5" gutterBottom style={{marginBottom: "1vh"}}>
                        {itemData ? texts.editItemTitle : texts.createItemTitle}
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
                                    validate:  !isEditMode ? validateName : undefined
                                }}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={texts.itemName}
                                        error={!!errors.name}
                                        helperText={errors.name?.message as string}
                                        fullWidth
                                        size="small"
                                        disabled={Boolean(itemData?.name)}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (!isEditMode){
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
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={texts.itemDescription}
                                        error={!!errors.description}
                                        helperText={errors.description?.message as string}
                                        fullWidth
                                        size="small"
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Controller
                                name="image"
                                control={control}
                                render={({field}) => (
                                    <Avatar
                                        src={imageUrl}
                                        alt={field.value}
                                        style={{width: '50px', height: '50px', marginBottom: '10px'}}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Controller
                                name="image"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={texts.itemImage}
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="weight"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={texts.itemWeight}
                                        error={!!errors.weight}
                                        helperText={errors.weight?.message as string}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            endAdornment: <InputAdornment
                                                position="end">{texts.itemWeightUnit}</InputAdornment>,
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* Item Type */}
                        <Grid item xs={6}>
                            <Controller
                                name="type"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>{texts.itemType}</InputLabel>
                                        <Select
                                            {...field}
                                            error={!!errors.type}
                                            label={texts.itemType}
                                        >
                                            <MenuItem value="item">Item</MenuItem>
                                            <MenuItem value="weapon">Weapon</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        {/* Ammunition Type */}
                        <Grid item xs={6}>
                            <Controller
                                name="ammotype"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>{texts.itemAmmoType}</InputLabel>
                                        <Select
                                            {...field}
                                            error={!!errors.ammotype}
                                            label={texts.itemAmmoType}
                                        >
                                            <MenuItem value="ammo1">Ammo 1</MenuItem>
                                            <MenuItem value="ammo2">Ammo 2</MenuItem>
                                            <MenuItem value="ammo3">Ammo 3</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name="unique"
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={texts.itemUnique}
                                        checked={field.value}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name="useable"
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={texts.itemUseable}
                                        checked={field.value}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name="shouldClose"
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={texts.itemShouldClose}
                                        checked={field.value}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" style={{marginTop: "1.5vh"}}>
                        <Button type="submit" variant="contained" color="success" fullWidth>
                            {itemData ? texts.editItemBtn : texts.createItemBtn}
                        </Button>
                    </Grid>

                </Box>
            </StyledDocument>
        </form>
    )
}

export default CreateEditItem

const StyledDocument = styled("div")`
    width: 60vh;
    //height: 90vh;
    display: flex;
    align-content: center;
    justify-content: center;
    padding: 1.8vh;

`

const ItemTextField = styled(TextField)`
    width: 100%;
`

const DummyText = styled("div")`
    height: 1.8vh;
    background: lightgray;
    border-radius: 1px;
    width: 100%
`
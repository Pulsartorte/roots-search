import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridRenderCellParams,
    GridRowParams,
    GridValueGetterParams
} from "@mui/x-data-grid";
import {Box, Button, Checkbox, Dialog, Grid, IconButton, InputAdornment, TextField, Tooltip} from "@mui/material";
import moment from "moment";
import {DATE_FORMAT} from "../../../utils/consts";
import {imagePrefix, texts} from "../../../AppConfig";
import {fetchNui} from "../../../utils/fetchNui";
import {Context} from "../../../context/Context";
import DeleteDialog from "../../general/components/DeleteDialog";
import CreateEditJob from "../components/Forms/CreateEditJob";
import EditIcon from "@mui/icons-material/Edit";
import useDeleteJob from "../hooks/useDeleteJob";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import useSetJob from "../hooks/useSetJob";
import GiveItemDialog from "../components/GiveItemDialog";
import useSetJobToPlayer from "../hooks/useSetJobToPlayer";
import GiveItemToPlayerDialog from "../components/GiveItemToPlayerDialog";

const Jobs = () => {
        const {
            jobs,
            handleGetJobs,
            jobsLoading,
            setJobsLoading,
            setViewJobOpen,
            setViewJob,
        /*    players,
            handleGetPlayers,
            playersLoading,
            setPlayersLoading*/
        } = useContext(Context);


        const {
            isSetJobOpen,
            setSetJobOpen,
            jobToSet,
            setJobToSet,
            handleSetJob,
            handleSetJobCancel
        } = useSetJob({handleGetJobs: handleGetJobs, setJobsLoading: setJobsLoading})

        const {
            isSetJobToPlayerOpen,
            setSetJobToPlayerOpen,
            jobToSetToPlayer,
            setJobToSetToPlayer,
            handleSetJobToPlayer,
            handleSetJobToPlayerCancel,
            players,
            setPlayers,
            handleGetPlayers,
            playersLoading,
            setPlayersLoading
        } = useSetJobToPlayer({handleGetJobs: handleGetJobs, setJobsLoading: setJobsLoading})

        const {
            isDeleteOpen,
            setDeleteOpen,
            itemToDelete,
            setItemToDelete,
            handleDelete,
            handleCancel
        } = useDeleteJob({handleGetJobs: handleGetJobs, setJobsLoading: setJobsLoading})


        const [isItemFormOpen, setItemFormOpen] = useState(false)
        const [currentItem, setCurrentItem] = useState<Item | undefined>()

        const [pageSize, setPageSize] = useState(15);  // Setzt die Anfangsgröße der Seite

        const [searchText, setSearchText] = useState('');

        useEffect(() => {
            if (jobs === null) handleGetJobs();
        }, [jobs, handleGetJobs]);

        /*useEffect(() => {
            if (players === null) handleGetPlayers();
        }, [players, handleGetPlayers]);*/

        const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
        };

        const handlePageSizeChange = (newPageSize: React.SetStateAction<number>) => {
            setPageSize(newPageSize);
        };


        const filteredItems = jobs?.filter((item) =>
            item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.label?.toLowerCase().includes(searchText.toLowerCase())
        ) ?? [];

        const handleCreate = useCallback((data: Item) => {
            setItemFormOpen(false)
            setJobsLoading(true)
            console.log('handleCreate: useCallback createItem')
            console.log(JSON.stringify(data))
            fetchNui('createJob', JSON.stringify(data)).then(_retData => {
                console.log('handleCreate: fetchNui createItem')
                console.log(JSON.stringify(data))
                handleGetJobs()
                return
            }).catch(_e => {
                console.error('An error has occured')
            })

        }, [handleGetJobs, setJobsLoading])

        const handleEdit = useCallback((data: Item) => {
            setItemFormOpen(false)
            setJobsLoading(true)
            console.log('handleEdit: useCallback editItem')
            console.log(JSON.stringify(data))
            fetchNui('editJob', JSON.stringify(data)).then(_retData => {
                console.log('handleEdit: fetchNui editItem')
                console.log(JSON.stringify(data))
                handleGetJobs()
                return
            }).catch(_e => {
                console.error('An error has occured')
            })

        }, [handleGetJobs, setJobsLoading])

        const handleClose = useCallback(() => {
            setItemFormOpen(false)
            setJobsLoading(true)
            setCurrentItem(undefined)
            handleGetJobs()

            /*console.log('handleEdit: useCallback')
            console.log(JSON.stringify(data))
            fetchNui('editItem', JSON.stringify(data)).then(_retData => {
                console.log('handleEdit: fetchNui editItem')
                console.log(JSON.stringify(data))
                handleGetItems()
                return
            }).catch(_e => {
                console.error('An error has occured')
            })*/

        }, [handleGetJobs, setJobsLoading])

        const columns: GridColumns<Job> = [
            {
                // TODO Check Images from LB Phone APP?
                field: 'image',
                headerName: texts.itemImage,
                width: 75,
                renderCell: (params: GridRenderCellParams<string>) => (
                    <img
                        src={`${imagePrefix}${params.value}`}
                        alt="item"
                        style={{width: '50px', height: '50px', objectFit: 'contain'}}
                    />
                ),
            },
            {
                field: 'label',
                headerName: texts.itemLabel,
                flex: 1,
            },
            {
                field: 'description',
                headerName: texts.itemDescription,
                flex: 2,
            },
            {
                field: 'weight',
                headerName: texts.itemWeight,
                flex: 1,
            },
            {
                field: 'useable',
                headerName: texts.itemUseable,
                flex: 1,
                renderCell: (params) => (
                    <Checkbox
                        checked={params.value}
                        disabled // macht die Checkbox nicht bearbeitbar
                    />
                ),
            },
            {
                field: 'created',
                headerName: texts.itemCreateTime,
                width: 150,
                valueGetter: (params: GridValueGetterParams) => (new Date(params.row.created)),
                valueFormatter: params => moment(new Date(params?.value)).format(DATE_FORMAT),
            },
            {
                field: 'playerActions',
                headerName: texts.playerActions,
                type: 'actions',
                getActions: (data: GridRowParams) => [
                    (<Tooltip title={texts.giveYourself}>
                        <GridActionsCellItem icon={<MedicalServicesIcon/>} onClick={() => {
                            setJobToSet(jobs?.filter(t => t.name === data.id)[0])
                            setSetJobOpen(true)
                        }} label={texts.giveYourself}/>
                    </Tooltip>),
                    (<Tooltip title={texts.givePlayer}>
                        <GridActionsCellItem icon={<PersonAddAlt1Icon/>} onClick={() => {
                            setJobToSetToPlayer(jobs?.filter(t => t.name === data.id)[0])
                            setPlayersLoading(true)
                            handleGetPlayers()
                            setPlayers(players)
                            setPlayersLoading(false)
                            setSetJobToPlayerOpen(true)
                        }} label={texts.givePlayer}/>
                    </Tooltip>),
                ],
                width: 100,
            },
            {
                field: 'actions',
                headerName: texts.actions,
                type: 'actions',
                getActions: (data: GridRowParams) => [
                    (<Tooltip title={texts.edit}>
                        <GridActionsCellItem icon={<EditIcon/>} onClick={() => {
                            setCurrentItem(jobs?.filter(t => t.name === data.id)[0])
                            setItemFormOpen(true)
                        }} label={texts.edit}/>
                    </Tooltip>),
                    (<Tooltip title={texts.delete}>
                        <GridActionsCellItem icon={<DeleteIcon/>} onClick={() => {
                            setItemToDelete(jobs?.filter(t => t.name === data.id)[0])
                            setDeleteOpen(true)
                        }} label={texts.delete}/>
                    </Tooltip>),
                ],
                width: 100,
            },
        ];

        return (
            <>
                <Box display="flex" flexDirection="column" height="100%" width="100%">
                    <Grid container spacing={1}>
                        <Grid item xs={11}>
                            <TextField
                                label={texts.search}
                                variant="outlined"
                                value={searchText}
                                onChange={handleSearch}
                                style={{marginBottom: "1vh"}}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton edge="end" disabled>
                                                <SearchIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            {/*         <IconButton
                                size={"large"}
                                style={{}}
                                onClick={() => setItemFormOpen(true)}
                                aria-label={texts.createItemBtn}
                            >
                                <AddIcon/>
                            </IconButton>*/}
                            <Button variant="contained"
                                    onClick={() => setItemFormOpen(true)}
                                    style={{padding: "1vh"}}
                                    fullWidth
                                    startIcon={<AddIcon/>}
                            >{texts.createItemBtn}</Button>
                        </Grid>
                    </Grid>
                    <DataGrid
                        rows={filteredItems}
                        columns={columns}
                        loading={jobsLoading}
                        pageSize={pageSize}
                        initialState={{
                            sorting: {sortModel: [{field: "label", sort: 'asc'}]}
                        }}
                        rowsPerPageOptions={[10, 15, 20, 50]}
                        onPageSizeChange={handlePageSizeChange}
                        disableSelectionOnClick
                    />
                    {/* <Button variant="contained"
                            onClick={() => setItemFormOpen(true)}
                            style={{marginTop: "1vh"}}
                            startIcon={<AddIcon/>}>{texts.createItemBtn}</Button>*/}

                </Box>
                <Dialog maxWidth="md" open={isItemFormOpen} onClose={() => {
                    setItemFormOpen(false)
                    setCurrentItem(undefined)
                }}>
                    <CreateEditJob jobs={jobs} handleCreate={handleCreate} handleEdit={handleEdit} handleClose={handleClose}
                                   jobData={currentItem}/>
                </Dialog>
                <GiveItemDialog
                    open={isSetJobOpen}
                    handleAgree={handleSetJob}
                    handleCancel={handleSetJobCancel}
                    title={`${jobToSet?.label || ""}`}
                    text={`<strong>${texts.giveItemQuestion}`}/>
                <GiveItemToPlayerDialog
                    open={isSetJobToPlayerOpen}
                    handleAgree={handleSetJobToPlayer}
                    handleCancel={handleSetJobToPlayerCancel}
                    players={players}
                    playersLoading={playersLoading}
                    title={`${jobToSetToPlayer?.label || ""}`}
                    text={`<strong>${texts.giveItemQuestion}`}/>
                <DeleteDialog
                    open={isDeleteOpen}
                    handleAgree={handleDelete}
                    handleCancel={handleCancel}
                    title={`${itemToDelete?.label || ""}`}
                    text={`<strong>${texts.deleteItemQuestion}`}/>
            </>
        );
    }
;

export default Jobs;

import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridRenderCellParams,
    GridRowParams, GridRowSpacing, GridRowSpacingParams,
    GridValueGetterParams
} from "@mui/x-data-grid";
import {Box, Button, Checkbox, Chip, Dialog, Grid, IconButton, InputAdornment, TextField, Tooltip} from "@mui/material";
import moment from "moment";
import {DATE_FORMAT} from "../../../utils/consts";
import {debugMode, jobImagePrefix, texts} from "../../../AppConfig";
import {fetchNui} from "../../../utils/fetchNui";
import {JobContext} from "../context/JobContext";
import DeleteJobDialog from "../components/DeleteJobDialog";
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
import SetJobDialog from "../components/SetJobDialog";
import useSetJobToPlayer from "../hooks/useSetJobToPlayer";
import SetJobToPlayerDialog from "../components/SetJobToPlayerDialog";

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
        } = useContext(JobContext);


        const {
            isSetJobOpen,
            setSetJobOpen,
            jobToSet,
            setJobToSet,
            handleSetJob,
            handleSetJobCancel,
            grades,
            setGrades,
            handleGetGrades,
            gradesLoading,
            setGradesLoading
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
            setPlayersLoading,
            gradesPlayer,
            setGradesPlayer,
            handleGetGradesPlayer,
            gradesPlayerLoading,
            setGradesPlayerLoading
        } = useSetJobToPlayer({handleGetJobs: handleGetJobs, setJobsLoading: setJobsLoading})

        const {
            isDeleteOpen,
            setDeleteOpen,
            jobToDelete,
            setItemToDelete,
            handleDelete,
            handleCancel
        } = useDeleteJob({handleGetJobs: handleGetJobs, setJobsLoading: setJobsLoading})


        const [isJobFormOpen, setJobFormOpen] = useState(false)
        const [currentJob, setCurrentJob] = useState<Job | undefined>()

        const [pageSize, setPageSize] = useState(15);  // Setzt die Anfangsgröße der Seite

        const [searchText, setSearchText] = useState('');

        useEffect(() => {
            if (jobs === null) handleGetJobs();
        }, [jobs, handleGetJobs]);


        const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
        };

        const handlePageSizeChange = (newPageSize: React.SetStateAction<number>) => {
            setPageSize(newPageSize);
        };


        const filteredItems = jobs?.filter((job) =>
            job.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            job.label?.toLowerCase().includes(searchText.toLowerCase()) ||
            job.type?.toLowerCase().includes(searchText.toLowerCase()) ||
            job.grades?.some(grade =>
                grade.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                grade.payment?.toString().includes(searchText) // falls du nach payment suchst
            )
        ) ?? [];

        function convertGradesToObject(job: Job): Job {
            // Umwandlung des grades-Arrays in ein schlüsselbasiertes Objekt
            const gradesObject = job.grades.reduce((obj, grade) => {
                obj[grade.order] = {
                    name: grade.name,
                    payment: Number(grade.payment),
                    isboss: grade.isboss,
                };
                return obj;
            }, {} as Record<string, Omit<Grade, 'order'>>);
            if (debugMode){
                console.log(job.grades)
                console.log('Converting')
                console.log(gradesObject)
            }
            // Rückgabe eines neuen Job-Objekts mit dem umgewandelten grades-Objekt
            return {
                ...job,
                grades: gradesObject as any, // Typanpassung, falls notwendig
            };
        }

        const getRowSpacing = (params: GridRowSpacingParams): GridRowSpacing => {
            return {
                top: 10,
                bottom: 10,
            };
        }

        const handleCreate = useCallback((data: Job) => {
            setJobFormOpen(false)
            setJobsLoading(true)
            console.log('handleCreate: useCallback createItem')
            console.log(JSON.stringify(convertGradesToObject(data)))
            fetchNui('createJob', JSON.stringify(convertGradesToObject(data))).then(_retData => {
                console.log('handleCreate: fetchNui createItem')
                console.log(JSON.stringify(data))
                handleGetJobs()
                return
            }).catch(_e => {
                console.error('An error has occured')
            })

        }, [handleGetJobs, setJobsLoading])

        const handleEdit = useCallback((data: Job) => {
            setJobFormOpen(false)
            setJobsLoading(true)
            console.log('handleEdit: useCallback editItem')
            console.log(JSON.stringify(convertGradesToObject(data)))
            fetchNui('editJob', JSON.stringify(convertGradesToObject(data))).then(_retData => {
                console.log('handleEdit: fetchNui editItem')
                console.log(JSON.stringify(data))
                handleGetJobs()
                return
            }).catch(_e => {
                console.error('An error has occured')
            })

        }, [handleGetJobs, setJobsLoading])

        const handleClose = useCallback(() => {
            setJobFormOpen(false)
            setJobsLoading(true)
            setCurrentJob(undefined)
            handleGetJobs()
        }, [handleGetJobs, setJobsLoading])

        const columns: GridColumns<Job> = [
            {
                // This is only for the image wrapping
                field: 'name',
                headerName: texts.jobImage,
                width: 75,
                renderCell: (params: GridRenderCellParams<string>) => (
                    <img
                        src={`${jobImagePrefix}${params.value}`}
                        alt="item"
                        style={{width: '50px', height: '50px', objectFit: 'contain'}}
                    />
                ),
            },
            {
                field: 'label',
                headerName: texts.jobLabel,
                flex: 1,
            },
            {
                field: 'gradesCount',
                headerName: texts.jobGradesCount,
                flex: 1,
                valueGetter: (params) => {
                    const grades = params.row.grades;
                    return grades.length;
                },
            },
            {
                field: 'minPayment',
                headerName: texts.jobGradesMinPayment,
                flex: 1,
                renderCell: (params) => {
                    const minPayment = params.row.minPayment;

                    return (
                        <div>
                            <Chip label={`$${minPayment}`} color="secondary"/>
                        </div>
                    );
                }
            },
            {
                field: 'maxPayment',
                headerName: texts.jobGradesMaxPayment,
                flex: 1,
                renderCell: (params) => {
                    const maxPayment = params.row.maxPayment;

                    return (
                        <div>
                            <Chip label={`$${maxPayment}`} color="primary" style={{marginRight: 5}}/>
                        </div>
                    );
                }
            },
            {
                field: 'defaultDuty',
                headerName: texts.jobDefaultDuty,
                flex: 1,
                renderCell: (params) => (
                    <Checkbox
                        checked={params.value}
                        disabled // macht die Checkbox nicht bearbeitbar
                    />
                ),
            },
            {
                field: 'offDutyPay',
                headerName: texts.jobOffDutyPay,
                flex: 1,
                renderCell: (params) => (
                    <Checkbox
                        checked={params.value}
                        disabled // macht die Checkbox nicht bearbeitbar
                    />
                ),
            },
            {
                field: 'createDate',
                headerName: texts.jobCreateTime,
                flex: 1,
                valueGetter: (params: GridValueGetterParams) => (new Date(params.row.createDate)),
                valueFormatter: params => moment(new Date(params?.value)).format(DATE_FORMAT),
            },
            {
                field: 'modifiedDate',
                headerName: texts.jobModifiedTime,
                flex: 1,
                valueGetter: (params: GridValueGetterParams) => {
                    const dateValue = params.row.modifiedDate;
                    return dateValue === 0 ? null : new Date(dateValue);
                },
                valueFormatter: (params) => {
                    if (!params.value) {
                        return 'N/A';
                    }
                    return moment(new Date(params.value)).format(DATE_FORMAT);
                },
            },
            {
                field: 'lastTouched',
                headerName: texts.jobModifiedBy,
                flex: 1
            },
            {
                field: 'playerActions',
                headerName: texts.playerActions,
                type: 'actions',
                getActions: (data: GridRowParams) => [
                    (<Tooltip title={texts.setJob}>
                        <GridActionsCellItem
                            icon={<MedicalServicesIcon/>}
                            onClick={() => {
                                const job = jobs?.find(t => t.name === data.id);
                                if (job) {
                                    setJobToSet(job);
                                } else {
                                    console.log('Job not found');
                                }
                            }}
                            label={texts.setJob}
                        />
                    </Tooltip>),
                    (<Tooltip title={texts.setJobToPlayer}>
                        <GridActionsCellItem icon={<PersonAddAlt1Icon/>} onClick={() => {
                            setJobToSetToPlayer(jobs?.filter(t => t.name === data.id)[0])
                            handleGetPlayers()
                        }} label={texts.setJobToPlayer}/>
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
                            setCurrentJob(jobs?.filter(t => t.name === data.id)[0])
                            setJobFormOpen(true)
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

        return (<>
            <Box display="flex" flexDirection="column" height="100%" width="100%">
                <Grid container spacing={1} >
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
                            onClick={() => setJobFormOpen(true)}
                            aria-label={texts.createItemBtn}
                        >
                            <AddIcon/>
                        </IconButton>*/}
                        <Button variant="contained"
                                onClick={() => setJobFormOpen(true)}
                                style={{padding: "1vh"}}
                                fullWidth
                                startIcon={<AddIcon/>}
                        >{texts.createJobBtn}</Button>
                    </Grid>
                </Grid>
                <DataGrid
                    rowHeight={65}
                    rows={filteredItems}
                    columns={columns}
                    loading={jobsLoading}
                    pageSize={pageSize}
                    initialState={{
                        sorting: {sortModel: [{field: "label", sort: 'asc'}]}
                    }}
                    rowsPerPageOptions={[10, 15, 20, 50]}
                    onPageSizeChange={handlePageSizeChange}
                    disableSelectionOnClick={false}
                />
                {/* <Button variant="contained"
                        onClick={() => setJobFormOpen(true)}
                        style={{marginTop: "1vh"}}
                        startIcon={<AddIcon/>}>{texts.createItemBtn}</Button>*/}

            </Box>
            <Dialog maxWidth="md" open={isJobFormOpen} onClose={() => {
                setJobFormOpen(false)
                setCurrentJob(undefined)
            }}>
                <CreateEditJob jobs={jobs} handleCreate={handleCreate} handleEdit={handleEdit} handleClose={handleClose}
                               jobData={currentJob}/>
            </Dialog>
            <SetJobDialog
                open={isSetJobOpen}
                handleAgree={handleSetJob}
                handleCancel={handleSetJobCancel}
                title={`${jobToSet?.label || ""}`}
                text={`<strong>${texts.setJobQuestion}`}
                grades={grades}
                gradesLoading={jobsLoading}
                jobData={jobToSet}
            />
            <SetJobToPlayerDialog
                open={isSetJobToPlayerOpen}
                handleAgree={handleSetJobToPlayer}
                handleCancel={handleSetJobToPlayerCancel}
                players={players}
                playersLoading={playersLoading}
                grades={gradesPlayer}
                gradesLoading={jobsLoading}
                title={`${jobToSetToPlayer?.label || ""}`}
                text={`<strong>${texts.setJobToPlayerQuestion}`}
                jobData={jobToSetToPlayer}
            />
            <DeleteJobDialog
                open={isDeleteOpen}
                handleAgree={handleDelete}
                handleCancel={handleCancel}
                title={`${jobToDelete?.label || ""}`}
                text={`<strong>${texts.deleteJobQuestion}`}
                jobData={currentJob}
            />
        </>);
    }
;

export default Jobs;

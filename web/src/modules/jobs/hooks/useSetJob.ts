import {useCallback, useEffect, useState} from "react"
import { fetchNui } from "../../../utils/fetchNui"
import {debugMode} from "../../../AppConfig";

type Props = {
  handleGetJobs: () => void
  setJobsLoading: (isLoading: boolean) => void
}

const useSetJob = ({handleGetJobs, setJobsLoading}: Props) => {
  const [isSetJobOpen, setSetJobOpen] = useState(false)
  const [jobToSet, setJobToSet] = useState<Job | undefined>()
  const [grades, setGrades] = useState<Grade[]>([])
  const [gradesLoading, setGradesLoading] = useState(false)

  const handleGetGrades = useCallback(() => {
    setGradesLoading(true);

    if (jobToSet?.grades) {
      const gradesArray = jobToSet.grades
      setGrades(gradesArray); // Das verarbeitete und sortierte Array in den Zustand setzen
    } else {
      setGrades([]); // Fallback: Leeres Array, falls keine Grades vorhanden sind
      if (debugMode){
        console.log('jobToSet is empty or has no grades');
      }
    }

    setGradesLoading(false);
  }, [jobToSet]);

  useEffect(() => {
    if (jobToSet) {
      handleGetGrades();
      setSetJobOpen(true);
    }
  }, [jobToSet, handleGetGrades]);


  const handleSetJob = useCallback((jobGrade:number, isMultiJob: boolean) => {
    if (debugMode){
      console.log('userCallback: handleSetJob')
      console.log('jobName:' + jobToSet?.name)
      console.log('jobGrade: ' + jobGrade)
    }
    setSetJobOpen(false)
    setJobsLoading(false)
    let setJobData = {
      jobName: jobToSet?.name,
      jobGrade: jobGrade,
      isMultiJob: isMultiJob,
    };

    fetchNui('setJob',setJobData).then(_retData => {
      if (debugMode){
        console.log('fetchNui: handleSetJob')
        console.log('retData:' + _retData)
      }
      handleGetJobs()
      setJobsLoading(false)
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    handleGetJobs()
  }, [handleGetJobs, setJobsLoading, jobToSet?.name])

  const handleSetJobCancel = useCallback(() => {
    setSetJobOpen(false)
    setGrades([])
    setJobToSet(undefined)
  }, [])

  return {
    isSetJobOpen: isSetJobOpen,
    setSetJobOpen: setSetJobOpen,
    jobToSet: jobToSet,
    setJobToSet: setJobToSet,
    handleSetJob: handleSetJob,
    handleSetJobCancel: handleSetJobCancel,
    grades,
    setGrades,
    handleGetGrades,
    gradesLoading,
    setGradesLoading
  }
}

export default useSetJob
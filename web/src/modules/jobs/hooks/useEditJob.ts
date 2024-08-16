import { useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"

type Props = {
  handleGetJobs: () => void
  setJobsLoading: (isLoading: boolean) => void
}

const useEditJob = ({handleGetJobs, setJobsLoading}: Props) => {
  const [isJobOpen, setIsJobOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState<Job | undefined>()
  
  const handleEditJob = useCallback(() => {
    setIsJobOpen(false)
    setJobsLoading(true)
    fetchNui('editJob', jobToEdit?.name).then(_retData => {
      handleGetJobs()
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    
  }, [handleGetJobs, setJobsLoading, jobToEdit])
  const handleCancel = useCallback(() => {
    setIsJobOpen(false)
    setJobToEdit(undefined)
  }, [])

  return {
    isJobOpen,
    setIsJobOpen,
    jobToEdit,
    setJobToEdit,
    handleEditJob,
    handleCancel
  }
}

export default useEditJob
import { useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"

type Props = {
  handleGetJobs: () => void
  setJobsLoading: (isLoading: boolean) => void
}

const useDeleteJob = ({handleGetJobs, setJobsLoading}: Props) => {
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | undefined>()
  const handleDelete = useCallback(() => {
    setDeleteOpen(false)
    setJobsLoading(true)
    fetchNui('deleteJob', jobToDelete?.name).then(_retData => {
      handleGetJobs()
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    
  }, [handleGetJobs, setJobsLoading, jobToDelete?.name])
  const handleCancel = useCallback(() => {
    setDeleteOpen(false)
    setJobToDelete(undefined)
  }, [])

  return {
    isDeleteOpen,
    setDeleteOpen,
    jobToDelete: jobToDelete,
    setItemToDelete: setJobToDelete,
    handleDelete,
    handleCancel
  }
}

export default useDeleteJob
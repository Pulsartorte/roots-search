import React, { ReactNode, useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"


export type ContextType = {

  jobs: Job[] | null
  jobsLoading: boolean
  setJobsLoading: (isLoading: boolean) => void
  handleGetJobs: () => void

  /*players: Player[] | null
  playersLoading: boolean
  setPlayersLoading: (isLoading: boolean) => void
  handleGetPlayers: () => void*/

  viewJob: Job | undefined
  setViewJob: (job: Job | undefined) => void
  isViewItemOpen: boolean
  setViewJobOpen: (open: boolean) => void

}

export const JobContext = React.createContext<ContextType>({} as ContextType)

export const JobContextProvider = (props: {children: ReactNode}) => {
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [jobsLoading, setJobsLoading] = useState(false)
  const [viewJob, setViewJob] = useState<Job | undefined>()
  const [isViewJobOpen, setIsViewJobOpen] = useState(false)

  /*const [players, setPlayers] = useState<Player[] | null>(null)
  const [playersLoading, setPlayersLoading] = useState(false)*/



    const handleGetJobs = useCallback(() => {
        fetchNui('getJobs').then(retData => {
            console.log('Received jobs from server:', retData);
            setJobsLoading(false)
            setJobs(retData)
        }).catch(_e => {
            console.error('An error has occured')
        })
    }, [])

    /*const handleGetPlayers = useCallback(() => {
        fetchNui('getPlayers').then(retData => {
            console.log('Received jobs from server:', retData);
            setPlayersLoading(false)
            setPlayers(retData)
        }).catch(_e => {
            console.error('An error has occured')
        })
    }, [])*/


  return (
    <JobContext.Provider value={{
      jobs: jobs,
      jobsLoading: jobsLoading,
      setJobsLoading: setJobsLoading,
      handleGetJobs: handleGetJobs,
      viewJob: viewJob,
      setViewJob: setViewJob,
      isViewItemOpen: isViewJobOpen,
      setViewJobOpen: setIsViewJobOpen
     /* players,
      playersLoading,
      setPlayersLoading,
      handleGetPlayers,*/
    }}>
      {props.children}
    </JobContext.Provider>
  )
}
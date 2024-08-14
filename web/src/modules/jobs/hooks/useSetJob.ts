import { useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"

type Props = {
  handleGetJobs: () => void
  setJobsLoading: (isLoading: boolean) => void
}

const useSetJob = ({handleGetJobs, setJobsLoading}: Props) => {
  const [isGiveItemOpen, setSetJobOpen] = useState(false)
  const [itemToGive, setJobToSet] = useState<Job | undefined>()

  const handleGiveItem = useCallback((quantity:number) => {
    console.log('userCallback: handleGiveItem')
    console.log('itemName:' + itemToGive?.name)
    console.log('quantity: ' + quantity)
    setSetJobOpen(false)
    setJobsLoading(false)
    let giveItemData = {
      quantity: quantity,
      itemName: itemToGive?.name
    };

    fetchNui('giveItemYourself',giveItemData).then(_retData => {
      console.log('fetchNui: handleGiveItem')
      console.log('retData:' + _retData)
      handleGetJobs()
      setJobsLoading(false)
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    handleGetJobs()
  }, [handleGetJobs, setJobsLoading, itemToGive?.name])
  const handleGiveItemCancel = useCallback(() => {
    setSetJobOpen(false)
    setJobToSet(undefined)
  }, [])

  return {
    isSetJobOpen: isGiveItemOpen,
    setSetJobOpen: setSetJobOpen,
    jobToSet: itemToGive,
    setJobToSet: setJobToSet,
    handleSetJob: handleGiveItem,
    handleSetJobCancel: handleGiveItemCancel
  }
}

export default useSetJob
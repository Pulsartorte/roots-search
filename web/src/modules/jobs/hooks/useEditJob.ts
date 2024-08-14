import { useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"

type Props = {
  handleGetItems: () => void
  setItemsLoading: (isLoading: boolean) => void
}

const useEditJob = ({handleGetItems, setItemsLoading}: Props) => {
  const [isItemOpen, setEditItemOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<Item | undefined>()
  
  const handleEditItem = useCallback(() => {
    setEditItemOpen(false)
    setItemsLoading(true)
    fetchNui('updateItem', itemToEdit?.name).then(_retData => {
      handleGetItems()
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    
  }, [handleGetItems, setItemsLoading, itemToEdit])
  const handleCancel = useCallback(() => {
    setEditItemOpen(false)
    setItemToEdit(undefined)
  }, [])

  return {
    isItemOpen,
    setEditItemOpen,
    itemToEdit,
    setItemToEdit,
    handleEditItem,
    handleCancel
  }
}

export default useEditJob
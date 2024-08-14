import { useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"

type Props = {
  handleGetItems: () => void
  setItemsLoading: (isLoading: boolean) => void
}

const useDeleteItem = ({handleGetItems, setItemsLoading}: Props) => {
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | undefined>()
  const handleDelete = useCallback(() => {
    setDeleteOpen(false)
    setItemsLoading(true)
    fetchNui('deleteItem', itemToDelete?.name).then(_retData => {
      handleGetItems()
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    
  }, [handleGetItems, setItemsLoading, itemToDelete?.name])
  const handleCancel = useCallback(() => {
    setDeleteOpen(false)
    setItemToDelete(undefined)
  }, [])

  return {
    isDeleteOpen,
    setDeleteOpen,
    itemToDelete,
    setItemToDelete,
    handleDelete,
    handleCancel
  }
}

export default useDeleteItem
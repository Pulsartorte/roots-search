import { useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"
import {debugMode} from "../../../AppConfig";

type Props = {
  handleGetItems: () => void
  setItemsLoading: (isLoading: boolean) => void
}

const useGiveItem = ({handleGetItems, setItemsLoading}: Props) => {
  const [isGiveItemOpen, setGiveItemOpen] = useState(false)
  const [itemToGive, setItemToGive] = useState<Item | undefined>()

  const handleGiveItem = useCallback((quantity:number) => {
    if (debugMode){
      console.log('userCallback: handleGiveItem')
      console.log('itemName:' + itemToGive?.name)
      console.log('quantity: ' + quantity)
    }
    setGiveItemOpen(false)
    setItemsLoading(false)
    let giveItemData = {
      quantity: quantity,
      itemName: itemToGive?.name
    };

    fetchNui('giveItemYourself',giveItemData).then(_retData => {
      if (debugMode){
        console.log('fetchNui: handleGiveItem')
        console.log('retData:' + _retData)
      }
      handleGetItems()
      setItemsLoading(false)
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    handleGetItems()
  }, [handleGetItems, setItemsLoading, itemToGive?.name])
  const handleGiveItemCancel = useCallback(() => {
    setGiveItemOpen(false)
    setItemToGive(undefined)
  }, [])

  return {
    isGiveItemOpen,
    setGiveItemOpen,
    itemToGive,
    setItemToGive,
    handleGiveItem,
    handleGiveItemCancel
  }
}

export default useGiveItem
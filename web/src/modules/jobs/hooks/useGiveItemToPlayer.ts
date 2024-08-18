import {useCallback, useEffect, useState} from "react"
import { fetchNui } from "../../../utils/fetchNui"
import {debugMode} from "../../../AppConfig";

type Props = {
  handleGetItems: () => void
  setItemsLoading: (isLoading: boolean) => void

}

const useGiveItemToPlayer = ({handleGetItems,setItemsLoading,}: Props) => {
  const [isGiveItemToPlayerOpen, setGiveItemToPlayerOpen] = useState(false)
  const [itemToGiveToPlayer, setItemToGiveToPlayer] = useState<Item | undefined>()
  const [players, setPlayers] = useState<Player[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)

  const handleGetPlayers = useCallback(() => {
    setPlayersLoading(true)
    fetchNui('getPlayers').then(retData => {
      if (debugMode){
        console.log('Received players from server:', retData);
      }
      setPlayersLoading(false)
      setPlayers(retData)
      console.log(players.toString())
      return;
    }).catch(_e => {
      console.error('An error has occured')
    })
  }, [])

 /* useEffect(() => {
    if (players === null) handleGetPlayers();
  }, [players, handleGetPlayers]);*/

  const handleGiveItemToPlayer = useCallback((quantity:number, selectedPlayer: Player) => {
    if (debugMode){
      console.log('userCallback: handleGiveItem')
      console.log('itemName:' + itemToGiveToPlayer?.name)
      console.log('quantity: ' + quantity)
      console.log('selectedPlayerId:' + selectedPlayer.id);
      console.log('selectedPlayerName:' + selectedPlayer.name);
    }
    setGiveItemToPlayerOpen(false)

    let giveItemData = {
      quantity: quantity,
      itemName: itemToGiveToPlayer?.name,
      targetPlayerId: selectedPlayer.id,
      targetPlayerName: selectedPlayer.name
    };
    if (debugMode){
      console.log(players.toString())
      console.log('giveItemData: ', giveItemData)
    }

    fetchNui('giveItem',giveItemData).then(_retData => {
      if (debugMode){
        console.log('fetchNui: handleGiveItemToPlayer')
        console.log('retData:' + _retData)
      }
      handleGetItems()
      setPlayersLoading(false)
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    handleGetItems()
  }, [handleGetItems, setItemsLoading, itemToGiveToPlayer?.name])
  const handleGiveItemToPlayerCancel = useCallback(() => {
    setGiveItemToPlayerOpen(false)
    setItemToGiveToPlayer(undefined)
  }, [])



  return {
    isGiveItemToPlayerOpen,
    setGiveItemToPlayerOpen,
    itemToGiveToPlayer,
    setItemToGiveToPlayer,
    handleGiveItemToPlayer,
    handleGiveItemToPlayerCancel,
    handleGetPlayers,
    players,
    setPlayers,
    playersLoading,
    setPlayersLoading
  }
}

export default useGiveItemToPlayer
import {useCallback, useEffect, useState} from "react"
import { fetchNui } from "../../../utils/fetchNui"

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
    setPlayersLoading(true);  // Ladezustand starten

    fetchNui('getPlayers')
        .then(retData => {
          console.log('Received players from server:', retData);
          setPlayers(retData);  // Spieler in den Zustand setzen
        })
        .catch(error => {
          console.error('An error has occurred:', error);
        })
        .finally(() => {
          setPlayersLoading(false);  // Ladezustand beenden
        });
  }, []);  // Hier brauchst du handleGetPlayers nicht in Abhängigkeiten, da es sich selbst enthält

 /* useEffect(() => {
    if (players === null) handleGetPlayers();
  }, [players, handleGetPlayers]);*/

  const handleGiveItemToPlayer = useCallback((quantity:number, selectedPlayer: Player) => {
    console.log('userCallback: handleGiveItem')
    console.log('itemName:' + itemToGiveToPlayer?.name)
    console.log('quantity: ' + quantity)
    console.log('selectedPlayerId:' + selectedPlayer.id);
    console.log('selectedPlayerName:' + selectedPlayer.name);
    setGiveItemToPlayerOpen(false)

    let giveItemData = {
      quantity: quantity,
      itemName: itemToGiveToPlayer?.name,
      targetPlayerId: selectedPlayer.id,
      targetPlayerName: selectedPlayer.name
    };
    console.log(players.toString())
    console.log('giveItemData: ', giveItemData)

    fetchNui('giveItem',giveItemData).then(_retData => {
      console.log('fetchNui: handleGiveItemToPlayer')
      console.log('retData:' + _retData)
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
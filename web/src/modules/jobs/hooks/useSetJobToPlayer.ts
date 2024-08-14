import {useCallback, useEffect, useState} from "react"
import { fetchNui } from "../../../utils/fetchNui"

type Props = {
  handleGetJobs: () => void
  setJobsLoading: (isLoading: boolean) => void

}

const useSetJobToPlayer = ({handleGetJobs,setJobsLoading,}: Props) => {
  const [isSetJobToPlayerOpen, setIsSetJobToPlayerOpen] = useState(false)
  const [jobToSetToPlayer, setJobToSetToPlayer] = useState<Job | undefined>()
  const [players, setPlayers] = useState<Player[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)

  const handleGetPlayers = useCallback(() => {
    setPlayersLoading(true)
    fetchNui('getPlayers').then(retData => {
      console.log('Received players from server:', retData);
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

  const handleSetJobToPlayer = useCallback((quantity:number, selectedPlayer: Player) => {
    console.log('userCallback: handleGiveItem')
    console.log('itemName:' + jobToSetToPlayer?.name)
    console.log('quantity: ' + quantity)
    console.log('selectedPlayerId:' + selectedPlayer.id);
    console.log('selectedPlayerName:' + selectedPlayer.name);
    setIsSetJobToPlayerOpen(false)

    let giveItemData = {
      quantity: quantity,
      itemName: jobToSetToPlayer?.name,
      targetPlayerId: selectedPlayer.id,
      targetPlayerName: selectedPlayer.name
    };
    console.log(players.toString())
    console.log('giveItemData: ', giveItemData)

    fetchNui('giveItem',giveItemData).then(_retData => {
      console.log('fetchNui: handleGiveItemToPlayer')
      console.log('retData:' + _retData)
      handleGetJobs()
      setPlayersLoading(false)
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    handleGetJobs()
  }, [handleGetJobs, setJobsLoading, jobToSetToPlayer?.name])
  const handleGiveItemToPlayerCancel = useCallback(() => {
    setIsSetJobToPlayerOpen(false)
    setJobToSetToPlayer(undefined)
  }, [])



  return {
    isSetJobToPlayerOpen: isSetJobToPlayerOpen,
    setSetJobToPlayerOpen: setIsSetJobToPlayerOpen,
    jobToSetToPlayer: jobToSetToPlayer,
    setJobToSetToPlayer: setJobToSetToPlayer,
    handleSetJobToPlayer: handleSetJobToPlayer,
    handleSetJobToPlayerCancel: handleGiveItemToPlayerCancel,
    handleGetPlayers,
    players,
    setPlayers,
    playersLoading,
    setPlayersLoading
  }
}

export default useSetJobToPlayer
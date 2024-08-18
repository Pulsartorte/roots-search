import {useCallback, useEffect, useState} from "react"
import { fetchNui } from "../../../utils/fetchNui"
import {debugMode} from "../../../AppConfig";

type Props = {
  handleGetJobs: () => void
  setJobsLoading: (isLoading: boolean) => void

}

const useSetJobToPlayer = ({handleGetJobs,setJobsLoading,}: Props) => {
  const [isSetJobToPlayerOpen, setIsSetJobToPlayerOpen] = useState(false)
  const [jobToSetToPlayer, setJobToSetToPlayer] = useState<Job | undefined>()
  const [players, setPlayers] = useState<Player[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)
  const [grades, setGrades] = useState<Grade[]>([])
  const [gradesLoading, setGradesLoading] = useState(false)

  const handleGetGrades = useCallback(() => {
    setGradesLoading(true);

    if (jobToSetToPlayer?.grades) {
      const gradesArray = jobToSetToPlayer.grades
      setGrades(gradesArray); // Das verarbeitete und sortierte Array in den Zustand setzen
    } else {
      setGrades([]); // Fallback: Leeres Array, falls keine Grades vorhanden sind
      if (debugMode){
        console.log('jobToSet is empty or has no grades');
      }
    }

    setGradesLoading(false);
  }, [jobToSetToPlayer]);

  useEffect(() => {
    if (jobToSetToPlayer) {
      handleGetGrades();
      setIsSetJobToPlayerOpen(true);
    }
  }, [jobToSetToPlayer, handleGetGrades]);

  const handleGetPlayers = useCallback(() => {
    setPlayersLoading(true);  // Ladezustand starten

    fetchNui('getPlayers')
        .then(retData => {
          if (debugMode){
            console.log('Received players from server:', retData);
          }
          setPlayers(retData);  // Spieler in den Zustand setzen
        })
        .catch(error => {
          console.error('An error has occurred:', error);
        })
        .finally(() => {
          setPlayersLoading(false);  // Ladezustand beenden
        });
  }, []);  // Hier brauchst du handleGetPlayers nicht in Abhängigkeiten, da es sich selbst enthält

/*  useEffect(() => {
    if (players === null || players.length === 0) {
      handleGetPlayers();
    }
  }, [players, handleGetPlayers]);*/


  const handleSetJobToPlayer = useCallback((jobGrade:number, selectedPlayer: Player, isMultiJob: boolean) => {
    if (debugMode){
      console.log('userCallback: handleGiveItem')
      console.log('itemName:' + jobToSetToPlayer?.name)
      console.log('jobGrade: ' + jobGrade)
      console.log('selectedPlayerId:' + selectedPlayer.id);
      console.log('selectedPlayerName:' + selectedPlayer.name);
    }
    setIsSetJobToPlayerOpen(false)

    let setJobData = {
      jobGrade: jobGrade,
      jobName: jobToSetToPlayer?.name,
      targetPlayerId: selectedPlayer.id,
      targetPlayerName: selectedPlayer.name,
      isMultiJob: isMultiJob,
    };
    if (debugMode){
      console.log(players.toString())
      console.log('setJobData: ', setJobData)
    }

    fetchNui('setJob',setJobData).then(_retData => {
      if (debugMode){
        console.log('fetchNui: handleGiveItemToPlayer')
        console.log('retData:' + _retData)
      }
      handleGetJobs()
      setPlayersLoading(false)
      return
    }).catch(_e => {
      console.error('An error has occured', _e)
    })
    handleGetJobs()
  }, [handleGetJobs, setJobsLoading, jobToSetToPlayer?.name])

  const handleSetJobToPlayerCancel = useCallback(() => {
    setIsSetJobToPlayerOpen(false)
    setJobToSetToPlayer(undefined)
    setIsSetJobToPlayerOpen(false)
  }, [])

  return {
    isSetJobToPlayerOpen: isSetJobToPlayerOpen,
    setSetJobToPlayerOpen: setIsSetJobToPlayerOpen,
    jobToSetToPlayer: jobToSetToPlayer,
    setJobToSetToPlayer: setJobToSetToPlayer,
    handleSetJobToPlayer: handleSetJobToPlayer,
    handleSetJobToPlayerCancel: handleSetJobToPlayerCancel,
    handleGetPlayers,
    players,
    setPlayers,
    playersLoading,
    setPlayersLoading,
    gradesPlayer: grades,
    setGradesPlayer: setGrades,
    handleGetGradesPlayer:handleGetGrades,
    gradesPlayerLoading: gradesLoading,
    setGradesPlayerLoading: setGradesLoading
  }
}

export default useSetJobToPlayer
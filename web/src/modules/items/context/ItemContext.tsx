import React, { ReactNode, useCallback, useState } from "react"
import { fetchNui } from "../../../utils/fetchNui"
import {debugMode} from "../../../AppConfig";

export type ContextType = {
    items: Item[] | null
    itemsLoading: boolean
    setItemsLoading: (isLoading: boolean) => void
    handleGetItems: () => void

    /*players: Player[] | null
    playersLoading: boolean
    setPlayersLoading: (isLoading: boolean) => void
    handleGetPlayers: () => void*/

    viewItem: Item | undefined
    setViewItem: (item: Item | undefined) => void
    isViewItemOpen: boolean
    setViewItemOpen: (open: boolean) => void

}

export const ItemContext = React.createContext<ContextType>({} as ContextType)

export const ItemContextProvider = (props: {children: ReactNode}) => {
    const [items, setItems] = useState<Item[] | null>(null)
    const [itemsLoading, setItemsLoading] = useState(false)

    const [viewDocument, setViewDocument] = useState<K5Document | undefined>()
    const [isViewDocOpen, setViewDocOpen] = useState(false)

    const [viewItem, setViewItem] = useState<Item | undefined>()
    const [isViewItemOpen, setViewItemOpen] = useState(false)

    /*const [players, setPlayers] = useState<Player[] | null>(null)
    const [playersLoading, setPlayersLoading] = useState(false)*/


    const handleGetItems = useCallback(() => {
        fetchNui('getItems').then(retData => {
            if (debugMode){
                console.log('Received items from server:', retData);
            }
            setItemsLoading(false)
            setItems(retData)
        }).catch(_e => {
            console.error('An error has occured')
        })
    }, [])

    /*const handleGetPlayers = useCallback(() => {
        fetchNui('getPlayers').then(retData => {
            console.log('Received items from server:', retData);
            setPlayersLoading(false)
            setPlayers(retData)
        }).catch(_e => {
            console.error('An error has occured')
        })
    }, [])*/


    return (
        <ItemContext.Provider value={{
            items,
            itemsLoading,
            setItemsLoading,
            handleGetItems,
            viewItem,
            setViewItem,
            isViewItemOpen,
            setViewItemOpen
            /* players,
             playersLoading,
             setPlayersLoading,
             handleGetPlayers,*/
        }}>
            {props.children}
        </ItemContext.Provider>
    )
}
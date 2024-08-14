import React, { ReactNode, useCallback, useState } from "react"
import { fetchNui } from "../utils/fetchNui"
import Items from "../modules/items/Pages/Items";

export type ContextType = {
  templates: DocumentTemplate[] | null
  templatesLoading: boolean
  setTemplatesLoading: (isLoading: boolean) => void
  handleGetTemplates: () => void

  documents: K5Document[] | null
  documentsLoading: boolean
  setDocumentsLoading: (isLoading: boolean) => void
  handleGetDocuments: () => void

  viewDocument: K5Document | undefined
  setViewDocument: (doc: K5Document | undefined) => void
  isViewDocOpen: boolean
  setViewDocOpen: (open: boolean) => void

  documentCopies: K5Document[] | null
  documentCopiesLoading: boolean
  setDocumentCopiesLoading: (isLoading: boolean) => void
  handleGetDocumentCopies: () => void

  jobs: Item[] | null
  jobsLoading: boolean
  setJobsLoading: (isLoading: boolean) => void
  handleGetJobs: () => void

  /*players: Player[] | null
  playersLoading: boolean
  setPlayersLoading: (isLoading: boolean) => void
  handleGetPlayers: () => void*/

  viewItem: Item | undefined
  setViewJob: (item: Item | undefined) => void
  isViewItemOpen: boolean
  setViewJobOpen: (open: boolean) => void

}

export const Context = React.createContext<ContextType>({} as ContextType)

export const ContextProvider = (props: {children: ReactNode}) => {
  const [templates, setTemplates] = useState<DocumentTemplate[] | null>(null)
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [documents, setDocuments] = useState<K5Document[] | null>(null)
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documentCopies, setDocumentCopies] = useState<K5Document[] | null>(null)
  const [documentCopiesLoading, setDocumentCopiesLoading] = useState(false)
  const [items, setItems] = useState<Item[] | null>(null)
  const [itemsLoading, setItemsLoading] = useState(false)

  const [viewDocument, setViewDocument] = useState<K5Document | undefined>()
  const [isViewDocOpen, setViewDocOpen] = useState(false)

  const [viewItem, setViewItem] = useState<Item | undefined>()
  const [isViewItemOpen, setViewItemOpen] = useState(false)

  /*const [players, setPlayers] = useState<Player[] | null>(null)
  const [playersLoading, setPlayersLoading] = useState(false)*/


  const handleGetTemplates = useCallback(() => {
    fetchNui('getMyTemplates').then(retData => {
      setTemplatesLoading(false)
      setTemplates(retData)
    }).catch(_e => {
      console.error('An error has occured')
    })
  }, [])

  const handleGetDocuments = useCallback(() => {
    fetchNui('getIssuedDocuments').then(retData => {
      setDocumentsLoading(false)
      setDocuments(retData)
    }).catch(_e => {
      console.error('An error has occured')
    })
  }, [])

  const handleGetDocumentCopies = useCallback(() => {
    fetchNui('getPlayerCopies').then(retData => {
      setDocumentCopiesLoading(false)
      setDocumentCopies(retData)
    }).catch(_e => {
      console.error('An error has occured')
    })
  }, [])

    const handleGetItems = useCallback(() => {
        fetchNui('getItems').then(retData => {
            //console.log('Received items from server:', retData);
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
    <Context.Provider value={{
      templates,
      templatesLoading,
      setTemplatesLoading,
      handleGetTemplates,
      documents,
      documentsLoading,
      setDocumentsLoading,
      handleGetDocuments,
      viewDocument,
      setViewDocument,
      isViewDocOpen,
      setViewDocOpen,
      documentCopies,
      documentCopiesLoading,
      setDocumentCopiesLoading,
      handleGetDocumentCopies,
      jobs: items,
      jobsLoading: itemsLoading,
      setJobsLoading: setItemsLoading,
      handleGetJobs: handleGetItems,
      viewItem,
      setViewJob: setViewItem,
      isViewItemOpen,
      setViewJobOpen: setViewItemOpen
     /* players,
      playersLoading,
      setPlayersLoading,
      handleGetPlayers,*/
    }}>
      {props.children}
    </Context.Provider>
  )
}
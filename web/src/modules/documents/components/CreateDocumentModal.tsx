import { Dialog, DialogTitle, List, ListItem, ListItemText } from "@mui/material"
import { useContext, useEffect, useMemo } from "react"
import { citizenTemplates, texts } from "../../../AppConfig"
import {useJob} from "../../general/hooks/useJob";
import {Context} from "../../../context/Context";



type Props = {
  open: boolean
  handleClose: () => void
  handleTemplateClick: (template: DocumentTemplate, citizen: boolean) => void
  citizen?: boolean
}

const CreateDocumentModal = ({ open, handleClose, handleTemplateClick, citizen}: Props) => {
  const { templates, handleGetTemplates } = useContext(Context)
  const { requiredJob } = useJob()

  const availableTempaltes = useMemo(() => {
    return templates?.filter(t => {
      if (!t.minGrade) {
        return true
      } else if (t.minGrade <= requiredJob?.grade!) {
        return true
      }
      return false
    })
  },[requiredJob?.grade, templates])

  useEffect(() => {
    handleGetTemplates()
  }, [handleGetTemplates])

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{texts.selectDocumentType}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {citizen ? citizenTemplates.map((t) => (
          <ListItem onClick={() => handleTemplateClick(t, true)} key={t.id}>
            <ListItemText primary={t.documentName} />
          </ListItem>
          )) :
          (availableTempaltes && availableTempaltes.length) ? availableTempaltes.map((t) => (
            <ListItem onClick={() => handleTemplateClick(t, false)} key={t.id}>
              <ListItemText primary={t.documentName} />
            </ListItem>
          )) :
            <ListItem>{texts.cannotIssueDocument}</ListItem>       
        }
      </List>
    </Dialog>
  )
}

export default CreateDocumentModal
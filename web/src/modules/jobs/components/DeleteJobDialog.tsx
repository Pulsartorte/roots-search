import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  Typography, IconButton
} from "@mui/material"
import {itemImagePrefix, texts} from "../../../AppConfig"
import {Box} from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

type Props = {
  open: boolean
  handleAgree: () => void
  handleCancel: () => void
  title: string
  text: string
  jobData: Job | undefined
}



const DeleteJobDialog = ({open, handleAgree, handleCancel, title, text, jobData}: Props) => {

  const getTextWithVariable = (key: string, variable: string) => {
    return `${key}${variable}`;
  };

  const serviceImageUrl = getTextWithVariable(itemImagePrefix, jobData?.name || '');


  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      style={{ minWidth: '400px' }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar
                src={serviceImageUrl}
                alt={jobData?.name}
                style={{
                  width: '50px',
                  height: '50px',
                  marginRight: '10px'
                }} // marginRight für Abstand zum Text
            />
            <Typography variant="h5" gutterBottom style={{marginBottom: "1vh"}}>
              {`${title} ${texts.jobEdit}`}
            </Typography>
          </Box>
          <IconButton
              style={{position: 'absolute', top: "1vh", right: "1vh"}}
              onClick={handleCancel}
          >
            <CloseIcon/>
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAgree} autoFocus>{texts.delete}</Button>
        <Button onClick={handleCancel} >
          {texts.cancel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteJobDialog
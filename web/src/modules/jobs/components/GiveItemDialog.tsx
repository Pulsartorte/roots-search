import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography, IconButton
} from "@mui/material"
import { texts } from "../../../AppConfig"
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean
  handleAgree: (quantity: number) => void
  handleCancel: () => void
  title: string
  text: string
}

const GiveItemDialog = ({open, handleAgree, handleCancel, title, text}: Props) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAgreeClick = () => {
    if (quantity >= 1) {
      handleAgree(quantity);
      setQuantity(1);  // Clear the input after agree
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>
        <Typography variant="h5" gutterBottom style={{marginBottom: "1vh"}}>
          {texts.giveItemTitle}
        </Typography>

        <IconButton
            style={{position: 'absolute', top: "1vh", right: "1vh"}}
            onClick={handleCancel}
        >
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div dangerouslySetInnerHTML={{ __html: text }} style={{marginBottom: "1vh"}}/>
          <TextField
              autoFocus
              margin="dense"
              label={texts.itemQuantityToGive}
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? 1 : Number(e.target.value))}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="success" onClick={handleAgreeClick} autoFocus fullWidth >{texts.giveInventory}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default GiveItemDialog
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import DifferenceIcon from '@mui/icons-material/Difference';
import WorkIcon from '@mui/icons-material/Work';
import Items from '../items/Pages/Items';
import Jobs from '../jobs/Pages/Jobs';

import { citizenTemplates, texts } from '../../AppConfig';
import {Work} from "@mui/icons-material";
import {ItemContext} from "../items/context/ItemContext";

export const NavLinks: Page[] = [
  {
    index: 0,
    title: texts.rootsItemsTitle,
    component: <Items/>,
    iconComponent: <WorkIcon/>,
    jobAccess: false,
    bossOnly: false
  },
  {
    index: 1,
    title: texts.rootsJobTitle,
    component: <Jobs/>,
    iconComponent: <WorkIcon/>,
    jobAccess: false,
    bossOnly: false
  }
  /*{
    index: 0,
    title: texts.myDocumentsTitle,
    component: <MyDocuments/>,
    iconComponent: <InboxIcon />,
    jobAccess: false,
    bossOnly: false
  },
  {
    index: 1,
    title: texts.issuedDocumentsTitle,
    component: <IssuedDocuments/>,
    iconComponent: <DraftsIcon />,
    jobAccess: !citizenTemplates.length,
    bossOnly: false
  },
  {
    index: 2,
    title:texts.templatesTitle,
    component: <Templates/>,
    iconComponent: <DifferenceIcon />,
    jobAccess: true,
    bossOnly: true
  },*/
]
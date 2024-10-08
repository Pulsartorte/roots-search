import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListElement from './_components/List/ListElement';
import { NavLinks } from './NavLinks';
import {availableJobs, colors} from "../../AppConfig";
import { useTheme } from '@mui/material/styles';

type Props = {
  selected: Page
  setSelected: (selectedPage: Page) => void
  job: string
  jobGrade: number
}

const Menu = ({jobGrade, selected, job, setSelected}: Props) => {
  const theme = useTheme(); // Zugriff auf das aktuelle Theme

  const handleListItemClick = (selectedPage: Page) => {
    setSelected(selectedPage);
  };

  const canSeeMenu = (navLink: Page) => {
    if (!navLink.jobAccess) { 
      return true
    } else if (!navLink.bossOnly) {
      if (availableJobs.filter(j => j.job === job).length) {
        return true
      } else {
        return false
      }
    } else {
      if (availableJobs.filter(j => j.job === job && j.templateGrades.includes(jobGrade)).length) {
        return true
      } else {
        return false
      }
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: '75vh', width: '100%', background: `linear-gradient(30deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`, margin: "auto", alignSelf: "center", borderRadius: "1vh" }}>
      <List component="nav">
        {NavLinks.map((navLink, key) => {
          return canSeeMenu(navLink) &&
          <ListElement title={navLink.title} key={key} selected={selected.index === key} onClick={() => { handleListItemClick(navLink) }} iconComponent={navLink.iconComponent} />
        })}
      </List>
    </Box>
  );
}

export default Menu
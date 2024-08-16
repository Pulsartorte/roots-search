import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Header from './Header';
import Menu from './Menu/Menu';
import { useState } from 'react';
import { NavLinks } from './Menu/NavLinks';
import { useJob } from '../modules/general/hooks/useJob';
import { debugData } from '../utils/debugData';
import { ContextProvider } from '../context/Context';
import { DocumentContextProvider } from './documents/context/DocumentContext'
import { ItemContextProvider } from './items/context/ItemContext';
import { JobContextProvider } from './jobs/context/JobContext';

export default function App() {
  const [selectedPage, setSelectedPage] = useState<Page>(NavLinks[0])
  const { requiredJob } = useJob()

  debugData([
    {
      action: 'setVisible',
      data: true,
    }
  ])

  return (
      <Box sx={{ p:0, height: "75vh", width: "75vw", display: "flex", alignItems: "center" }}>
        <Grid container sx={{height: '100%'}} spacing={2}>
          <Grid item xs={2}>
            <Menu selected={selectedPage} jobGrade={requiredJob?.grade!} job={requiredJob?.name!} setSelected={setSelectedPage}/>
          </Grid>
          <Grid item xs={9}>
            <Box
              component="main"
              sx={{
                height: '100%', p: 3, flexGrow: 1, bgcolor: 'background.default', borderRadius: "1vh", display: "flex", flexDirection: "column"
              }}> 
              <Header title={selectedPage.title} />
              {renderWithCorrectProvider(selectedPage.index)}
            </Box>
          </Grid>
        </Grid>
      </Box>
  );
}

const getSelectedComponent = (selectedIndex: number) => {
  let component = null
  NavLinks.forEach(navlink => {
    if (navlink.index === selectedIndex)
    component = navlink.component
  });
  return component
}

const renderWithCorrectProvider = (index: number) => {
  switch(index) {
    case 0:
      return (
          <ItemContextProvider>
            {getSelectedComponent(index)}
          </ItemContextProvider>
      );
    case 1:
      return (
          <JobContextProvider>
            {getSelectedComponent(index)}
          </JobContextProvider>
      );
    case 2:
      // Weitere Fälle für andere Module
    default:
      return getSelectedComponent(index);
  }
};

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, {} from 'react';
import { Typography, ThemeProvider, createTheme } from '@mui/material';
import { blue } from '@mui/material/colors';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

function App() {

  return (    
    <ThemeProvider theme={theme}>
      <div className="App">        
        <Typography className="mb-3" variant="h4" color="initial">Video Tool</Typography>    
        <Home />        
      </div>
    </ThemeProvider>
  );
}

export default App;

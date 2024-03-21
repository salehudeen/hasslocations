import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Logo from '../assets/Hass-Logo.png'; // Replace with your logo image path
import './Header.css'

const Header = () => {
    return (
      <AppBar className='headerBar' position="static">
        <Toolbar disableGutters variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
           
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            Hass Locations 
          </Typography>
          <img src={Logo} alt="App Logo" width="50" height="50" />
          <IconButton sx={{ ml: 'auto' }}>
           <button className='loginButton'>login</button>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Header;
  
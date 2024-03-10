import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Logo from '../assets/react.svg'; // Replace with your logo image path


const Header = () => {
    return (
      <AppBar position="static">
        <Toolbar disableGutters variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            {/* Add menu icon later if needed */}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            Your App Name
          </Typography>
          <img src={Logo} alt="App Logo" width="50" height="50" />
          <IconButton color="inherit" aria-label="login" sx={{ ml: 'auto' }}>
           <button>login</button>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Header;
  
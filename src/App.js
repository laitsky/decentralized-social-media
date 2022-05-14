import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  theme,
  Box,
  Container,
  Text,
  Avatar,
  AvatarBadge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { 
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';

import { logout } from './utils';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [path, setPath] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    getAccountDetails();
  }, []);

  const getAccountDetails = async () => {
    const accountDetails = await window.contract.get_account_details({ address: window.accountID });
    const profileImageUrl = `https://cloudflare-ipfs.com/ipfs/${accountDetails.profile_image_url}`;
    setAvatar(profileImageUrl);
  }

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  const showNavbar = () => {
    if (
      path === '/' ||
      path === '/register'
    ) {
      return ;
    }
    return (
      <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
        <Menu>
          <MenuButton as={Button} backgroundColor="transparent">
            <Avatar size="md" mr={2} src={avatar.length !== 0 ? avatar : ''} showBorder="true">
            <AvatarBadge boxSize='0.85em' bg='green.500' />
            </Avatar> 
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate('../profile')}>Profile</MenuItem>
            <MenuItem>Account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    )
  }

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Container mt={3}>
          {showNavbar()}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;

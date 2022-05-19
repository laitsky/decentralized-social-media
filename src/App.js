import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  theme,
  Box,
  Container,
  Avatar,
  AvatarBadge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Text,
} from '@chakra-ui/react';
import { IoHome, IoHomeSharp } from 'react-icons/io5';
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
import Account from './pages/Account';

import { IPFSGateway, logout } from './utils';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [path, setPath] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    getLoggedProfileImage();
  }, []);

  const getLoggedProfileImage = async () => {
    const accountDetails = await window.contract.get_account_details({ address: window.accountID });
    const profileImageUrl = IPFSGateway(accountDetails.profile_image_url);
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
      return;
    }

    return (
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" boxShadow="base" padding={4} borderRadius={6} mb={3}>
        <Link onClick={() => navigate('../home')}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <IoHomeSharp />
            <Text ml={1}>Home</Text>
          </Box>
        </Link>
        <Menu>
          <MenuButton as={Button} backgroundColor="transparent">
            <Avatar size="md" mr={2} src={avatar.length !== 0 ? avatar : ''} showBorder="true">
            <AvatarBadge boxSize='0.85em' bg='green.500' />
            </Avatar> 
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate('../profile/' + window.accountID)}>Profile</MenuItem>
            <MenuItem onClick={() => navigate('../account')}>Account</MenuItem>
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
          <Route path="/profile/:accountId" element={<Profile />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;

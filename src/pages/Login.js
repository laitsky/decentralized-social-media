import { useState, useEffect } from 'react';
import { Box, Button, Center, Container, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { login } from "../utils";

export default function Login() {
  const navigate = useNavigate();
  const [isExist, setIsExist] = useState();
  useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
      isUserExist()
    }
  }, []);

  useEffect(() => {
    if (isExist) {
      navigate('../home');
    } else if (window.walletConnection.isSignedIn() && isExist === false){
      navigate('../register');
    }
  }, [isExist])

  const isUserExist = async () => {
    const isUserExist = await window.contract.is_user_exists({address: window.accountID});
    setIsExist(isUserExist);
  }

  const handleLogin = () => {
    login();
  }
  
  return (
    <Box>
      <Container>
        <Center>
          <VStack>
            <Heading pt={12}>DAO Sosial Media</Heading>
            <Button colorScheme='blue' onClick={handleLogin}>Masuk</Button>
          </VStack>
        </Center>
      </Container>
    </Box>
  )
}
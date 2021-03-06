import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, Center, Container, Heading, Input, VStack } from "@chakra-ui/react";

import { v4 as uuidv4 } from 'uuid';

import { logout, makeStorageClient } from '../utils';

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isExist, setIsExist] = useState(false);
  const [file, setFile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let profileImageUrl;
      
      if (file.files[0]) {
        profileImageUrl = await handleUpload();
      }

      await window.contract.create_account({
        name: data.name,
        location: data.location,
        description: data.description,
        profile_image_url: file.files[0] ? profileImageUrl : null
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
      isUserExist();
    }
  }, []);

  useEffect(() => {
    if (isExist) {
      navigate('../home');
    }
  }, [isExist]);

  const isUserExist = async () => {
    const isUserExist = await window.contract.is_user_exists({address: window.accountID});
    setIsExist(isUserExist);
  }

  const handleUpload = async () => {
    const client = makeStorageClient();

    // Changing the file name
    Object.defineProperty(file.files[0], 'name', {
      writable: true,
      value: uuidv4()
    });

    const cid = await client.put(file.files);
    return `${cid}/${file.files[0].name}`;
  }

  return (
    <Box>
      <Container>
        <VStack spacing="6px">
          <Center>
            <Heading pt={12} pb={8}>Register</Heading>
          </Center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder='Name (optional)' {...register("name")} />
            <Input placeholder='Location (optional)' {...register("location")} />
            <Input placeholder='Bio (optional)' {...register("description")} />
            <label htmlFor="file">Pick image for profile picture</label> <hr />
            <input type="file" id="input" name="file" ref={(ref) => setFile(ref)} />
            <Box mt={3} mb={2}/>
            <Button isLoading={isLoading} mr={3} type="submit" colorScheme="blue">Register</Button>
            <Button onClick={logout} colorScheme="blue" variant="outline">Cancel</Button>
          </form>
        </VStack>
      </Container>
    </Box>
  )
}
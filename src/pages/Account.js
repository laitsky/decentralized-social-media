import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Center,
  Input,
  Avatar,
  Link,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  VStack,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { v4 as uuidv4 } from 'uuid';

import { IPFSGateway, makeStorageClient } from '../utils';

export default function Account() {
  const { register, handleSubmit, setValue } = useForm();
  const [imageCID, setImageCID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputFileRef = useRef(null);

  useEffect(() => {
    populateForm();
  }, []);

  
  const populateForm = async () => {
    const accountDetails = await window.contract.get_account_details({ address: window.accountID });
    // Populate the form
    setValue('name', accountDetails.name);
    setValue('description', accountDetails.description);
    setValue('location', accountDetails.location);
    setValue('url', accountDetails.url);
    console.log(accountDetails.profile_image_url)
    setImageCID(accountDetails.profile_image_url);
  }

  const onSubmit = async (data) => {
    await window.contract.edit_account_details({
      name: data.name,
      location: data.location,
      url: data.url,
      description: data.description
    });
  }

  const onFileChange = async (e) => {
    if (e.target.files !== null) {
      setIsLoading(true);
      const client = makeStorageClient();

      // Changing the file name
      Object.defineProperty(e.target.files[0], 'name', {
        writable: true,
        value: uuidv4()
      });

      const cid = await client.put(e.target.files);
      const newImageUrl = `${cid}/${e.target.files[0].name}`;

      await window.contract.edit_profile_image({ profile_image_url: newImageUrl });

      setIsLoading(false);
    }
  }

  return (
    <Box>
      <Heading size="lg">Your Account</Heading>
      <Box pb={4} />
      <Center mb={4}>
        <Link>
          <input type="file" id="input" name="file" ref={inputFileRef} style={{display: 'none'}} onChange={onFileChange} />
          <Avatar size="2xl" src={IPFSGateway(imageCID)} onClick={() => inputFileRef.current.click()} />
        </Link>
      </Center>
      {isLoading && (
        <Center>
          <Spinner color="blue.500" />
          <Text>Changing profile picture, please wait...</Text>
        </Center>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <VStack align='left' spacing='0.8em'>
            <Box>
              <FormLabel htmlFor='displayName'>Display Name</FormLabel>
              <Input id='displayName' type='text' {...register('name')} />
            </Box>
            <Box>
              <FormLabel htmlFor='bio'>Bio</FormLabel>
              <Textarea id='bio' size='lg' resize='none' {...register('description')}/>
            </Box>
            <Box>
              <FormLabel htmlFor='location'>Location</FormLabel>
              <Input id='location' type='text' {...register('location')} />
            </Box>
            <Box>
              <FormLabel htmlFor='website'>Website</FormLabel>
              <Input id='website' type='text' {...register('url')} />
            </Box>
            {!isLoading && (
              <Button colorScheme='blue' type='submit'>Save</Button>
            )}
          </VStack>
        </FormControl>
      </form>
    </Box> 
  )
}
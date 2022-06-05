import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button, 
  Heading, 
  Text, 
  Textarea, 
  IconButton,
  Avatar,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { CgHeart, CgComment } from 'react-icons/cg';
import { useParams, Link as RRLink } from "react-router-dom";

import { IPFSGateway } from "../utils";


export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState({ post: {}, comment_details: [], like_details: [] });
  const [value, setValue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (postId) {
      getPostDetail();
    }
  }, [postId]);

  const getPostDetail = async () => {
    const res = await window.contract.get_single_post({ post_id: +postId, account_id: window.accountID });
    setPost(res);
    console.log(res)
  }

  const handleInputChange = (e) => {
    setValue(e.target.value)
  }

  const handleCommentBtnSubmit = async () => {
    await window.contract.comment_on_post({
      post_id: +postId,
      comment: value
    });
    setValue('');
  }

  const handleLikeBtnClick = async () => {
    await window.contract.like_post({ post_id: +postId });
  }

  const handleShowAllLikes = async () => {
    onOpen();
  }

  return (
    <Box
      bgColor="gray.100"
      display="flex"
      flexDirection="column"
      padding={4}
      borderRadius={6}
      mt={3}
      mb={3}
    >
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Likes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {post.like_details.map((pl) => (
              <Box key={pl.user_address} display="flex" flexDirection="row" alignItems="center" mb={3}>
                <Avatar
                  size="sm"
                  src={pl.profile_image_url.length !== 0 ? IPFSGateway(pl.profile_image_url) : ''}
                />
                <Heading ml={2} size="xs">{pl.user_address}</Heading>
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        pb={4}
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            size="sm"
            src={IPFSGateway(post.profile_image_url)}
          />
          <Heading ml={2} size="xs">
            <Link as={RRLink} to={`/profile/${post.post.user_address}`}>{post.post.user_address}</Link>
          </Heading>
        </Box>
        <Text fontSize="xs">{new Date(post.post.created_at / 1_000_000).toLocaleString()}</Text>
      </Box>
      <Text pb={6}>{post.post.content}</Text>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Text fontSize="xs" mr={2}>
          <IconButton onClick={handleLikeBtnClick} size="sm" ml={-2} icon={<CgHeart color={post.is_liked ? 'red' : ''} />} />
          <button onClick={handleShowAllLikes}><span style={{fontWeight: "bold"}}>{post.like_count} Likes</span></button>
        </Text>
        <Text fontSize="xs">
          <IconButton size="sm" ml={-2} icon={<CgComment />} />
          <span style={{fontWeight: "bold"}}>{post.comment_count} Comments</span>
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end" mt={3}>
        <Textarea
          value={value}
          onChange={handleInputChange}
          bgColor="whiteAlpha.700"
          resize='none'
          placeholder="Give your reply"
        />
        <Button size="md" mt={3} colorScheme='blue' onClick={handleCommentBtnSubmit}>Comment</Button>
      </Box>
      <Box mb={4} />
      {post.comment_details.map((pc) => (
      <Box key={pc.comment_id} mb={3} backgroundColor="gray.100" borderRadius={6} padding={3}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box key={pc.user_address} display="flex" flexDirection="row" alignItems="center">
            <Avatar
              size="sm"
              src={IPFSGateway(pc.profile_image_url)}
            />
            <Heading ml={2} size="xs">{pc.user_address}</Heading>
          </Box>
          <Text fontSize="xs">{new Date(pc.created_at / 1_000_000).toLocaleString()}</Text>
        </Box>
        <Text pt={2}>{pc.comment}</Text>
      </Box>
      ))}
    </Box>
  )
}
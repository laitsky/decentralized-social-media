import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Avatar,
  Text,
} from "@chakra-ui/react";

import { CreatePostForm, PostContainer } from '../components/posts';

export default function Home() {
  const navigate = useNavigate();
  const [isExist, setIsExist] = useState();
  const [posts, setPosts] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const [modalType, setModalType] = useState('');
  const [commentInputArr, setCommentInputArr] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    isUserExist();
    if (!window.walletConnection.isSignedIn()) {
      navigate('../')
    }
    getAllPosts();
  }, []);

  useEffect(() => {
    if (isExist === false) {
      navigate('../')
    }
  }, [isExist]);

  const isUserExist = async () => {
    const isUserExist = await window.contract.is_user_exists({ address: window.accountID });
    setIsExist(isUserExist);
  }

  const getAllPosts = async () => {
    const res = await window.contract.get_all_posts({ account_id: window.accountID });
    setPosts(res);
  }

  const handleLikeBtnClick = async (postId) => {
    await window.contract.like_post({ post_id: postId });
  }

  const handleShowAllPostLikes = (postId) => async () => {
    setModalType('pl');
    const res = await window.contract.get_post_likes_details({ post_id: postId });
    setModalContent(res);
    onOpen();
  }

  const handleCommentBtnClick = (postId) => async () => {
    setModalType('pc');
    const res = await window.contract.get_post_comment_details({ post_id: postId });
    setModalContent(res);
    onOpen();
  }

  const handlePostFormInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleCommentInputChange = (index) => (e) => {
    let prevCommentInputValue = [...commentInputArr];
    prevCommentInputValue[index] = e.target.value;
    setCommentInputArr(prevCommentInputValue);
  }

  const handleCommentSubmit = (postId, index) => async () => {
    if (!commentInputArr[index]) {
      return;
    }
    await window.contract.comment_on_post({
      post_id: postId,
      comment: commentInputArr[index]
    });
  }

  const handlePostFormSubmit = async () => {
    setInputValue('');
    await window.contract.create_post({ content: inputValue });
  }

  const determineModalHeader = () => {
    if (modalType === 'pl') {
      return 'All Likes';
    } else if (modalType === 'pc') {
      return 'All Comments';
    }
  }

  const showModalContent = () => {
    if (modalType === 'pl') {
      return (
        modalContent.map(c => (
          <Box key={c.user_address} display="flex" flexDirection="row" alignItems="center">
            <Avatar
              size="sm"
              src={c.profile_image_url.length !== 0 ? `https://cloudflare-ipfs.com/ipfs/${c.profile_image_url}` : ''}
            />
            <Heading ml={2} size="xs">{c.user_address}</Heading>
          </Box>
        ))
      )
    } else if (modalType === 'pc') {
      return (
        modalContent.map(c => (
          <Box key={c.comment_id} mb={3} backgroundColor="gray.100" borderRadius={6} padding={3}>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Box key={c.user_address} display="flex" flexDirection="row" alignItems="center">
                <Avatar
                  size="sm"
                  src={c.profile_image_url.length !== 0 ? `https://cloudflare-ipfs.com/ipfs/${c.profile_image_url}` : ''}
                />
                <Heading ml={2} size="xs">{c.user_address}</Heading>
              </Box>
              <Text fontSize="xs">{new Date(c.created_at / 1_000_000).toLocaleString()}</Text>
            </Box>
            <Text pt={2}>{c.comment}</Text>
          </Box>
        ))
      )
    }
  }

  return (
    <Box>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{determineModalHeader()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {showModalContent()}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Heading size="lg" pb={4}>Home</Heading>
      <CreatePostForm
        value={inputValue}
        handleInputChange={handlePostFormInputChange}
        handleSubmit={handlePostFormSubmit}
      />
      {posts.map((post, index) => (
        <PostContainer
          key={post.post.post_id}
          handleLikeBtnClick={() => handleLikeBtnClick(post.post.post_id)}
          handleShowAllPostLikes={handleShowAllPostLikes(post.post.post_id)}
          handleCommentBtnClick={handleCommentBtnClick(post.post.post_id)}
          username={post.post.user_address}
          profileImageUrl={post.profile_image_url}
          date={new Date(post.post.created_at / 1_000_000).toLocaleString()}
          content={post.post.content}
          likeCount={post.like_count}
          commentCount={post.comment_count}
          isLiked={post.is_liked}
          value={commentInputArr[index]}
          handleInputChange={handleCommentInputChange(index)}
          handleCommentSubmit={handleCommentSubmit(post.post.post_id, index)}
        />
      ))}
    </Box>
  )
}
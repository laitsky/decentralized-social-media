import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Heading,
  Text,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import {
  IoLocationOutline,
  IoLinkOutline,
  IoCalendarOutline
} from 'react-icons/io5'
import { useParams, useNavigate, Link as RRLink } from 'react-router-dom';

import { PostContainer } from '../components/posts';

import { IPFSGateway } from '../utils';

export default function Profile() {
  const [account, setAccount] = useState({});
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowed, setIsFollowed] = useState();
  const [posts, setPosts] = useState([]);
  const [commentInputArr, setCommentInputArr] = useState([]);
  const [modalContent, setModalContent] = useState([]);
  const [modalType, setModalType] = useState('');
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getAccountDetails();
    getUserPosts();
    getUserFollowingList();
    getUserFollowersList();
    isUserFollowed();
  }, [accountId])

  const getAccountDetails = async () => {
    try {
      const accountDetails = await window.contract.get_account_details({ address: accountId });
      setAccount(accountDetails);
    } catch (err) {
      navigate('../home')
    }
  }

  const getUserPosts = async () => {
    const userPosts = await window.contract.get_user_posts({ account_id: accountId, perspective: window.accountID });
    setPosts(userPosts.reverse());
  }

  const followUser = async () => {
    await window.contract.follow_user({ address: accountId });
  }

  const getUserFollowingList = async () => {
    const res = await window.contract.get_user_following_list({ user_account_id: accountId });
    setFollowing(res);
  }

  const getUserFollowersList = async () => {
    const res = await window.contract.get_user_followers_list({ user_account_id: accountId });
    setFollowers(res);
  }

  const isUserFollowed = async () => {
    if (window.accountID === accountId) return;
    const res = await window.contract.is_user_followed({
      user_account_id: window.accountID,
      destination_account_id: accountId,
    });
    setIsFollowed(res);
  }

  const handleLikeBtnClick = async (postId) => {
    await window.contract.like_post({ post_id: +postId });
  }

  const handleShowAllPostLikes = (postId) => async () => {
    setModalType('pl');
    const res = await window.contract.get_post_likes_details({ post_id: +postId });
    setModalContent(res);
    onOpen();
  }

  const handleCommentBtnClick = (postId) => async () => {
    setModalType('pc');
    const res = await window.contract.get_post_comment_details({ post_id: +postId });
    setModalContent(res);
    onOpen();
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
      post_id: +postId,
      comment: commentInputArr[index]
    });
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
              src={c.profile_image_url.length !== 0 ? IPFSGateway(c.profile_image_url) : ''}
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
                  src={c.profile_image_url.length !== 0 ? IPFSGateway(c.profile_image_url) : ''}
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

  const showProfileButton = () => {
    if (accountId === window.accountID) {
      return <Button colorScheme="blue" variant="outline" onClick={() => navigate('../account')}>Edit Profile</Button>
    } else if (typeof(isFollowed) == 'number') {
      return <Button colorScheme="blue" onClick={followUser} variant="outline">Unfollow</Button>
    } else if (isFollowed === null) {
      return <Button colorScheme="blue" onClick={followUser}>Follow</Button>
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
      <Box display="flex" flexDirection="column">
        <Box display="flex" mt={4} flexDirection="row" justifyContent="space-between" alignItems="center">
          <Avatar src={IPFSGateway(account.profile_image_url)} size="xl" mb={4}/>
          {showProfileButton()}
        </Box>
        <Heading size="md">{account.name}</Heading>
        <Heading size="sm" color="gray.600">{account.address}</Heading>
        <Box mb={6} />
        <Text>{account.description}</Text>
        <Box mb={4} />
        <Box display="flex" flexDirection="row" alignItems="center">
          <IoLocationOutline /> 
          <Text ml={1}>{account.location}</Text>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <IoLinkOutline />
          <Text ml={1}>{account.url}</Text>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <IoCalendarOutline />
          <Text ml={1}>
            Join Date: {new Date(account.created_at / 1_000_000).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
        </Box>
        <Box flexDirection="row"  mt={4}>
          <Link mr={3} as={RRLink} to={`/profile/${accountId}/following`} >{following.length} followings</Link>
          <Link as={RRLink} to={`/profile/${accountId}/followers`}  >{followers.length} followers</Link>
        </Box>
      </Box>
      <Tabs isFitted isLazy variant="soft-rounded" colorScheme="blue" mt={4}>
      <TabList>
        <Tab>Posts</Tab>
      </TabList>
      <TabPanels>
        {posts.map((post, index) => (
          <PostContainer
            key={post.post.post_id}
            handleLikeBtnClick={() => handleLikeBtnClick(post.post.post_id)}
            handleShowAllPostLikes={handleShowAllPostLikes(post.post.post_id)}
            handleCommentBtnClick={handleCommentBtnClick(post.post.post_id)}
            postId={post.post.post_id}
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
      </TabPanels>
    </Tabs>
    </Box>
  )
}
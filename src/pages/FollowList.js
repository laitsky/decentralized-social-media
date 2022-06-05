import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Box,
  Heading,
  Text,
  Avatar,
  Button,
  Link
} from '@chakra-ui/react';
import { Link as RRLink } from 'react-router-dom';
import { IPFSGateway } from '../utils';

const PATH_TYPE = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
}

export default function FollowList() {
  const [path, setPath] = useState('');
  const [followList, setFollowList] = useState([]);
  const { accountId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const thirdPath = location.pathname.split('/')[3];
    setPath(thirdPath);
  }, []);

  useEffect(() => {
    if (path) {
      getFollowList();
    }
  }, [path])

  const getFollowList = async () => {
    let res;
    if (path === PATH_TYPE.FOLLOWERS) {
      res = await window.contract.get_user_followers_list({ user_account_id: accountId });
      console.log(res);
    } else if (path === PATH_TYPE.FOLLOWING) {
      res = await window.contract.get_user_following_list({ user_account_id: accountId });
      console.log(res);
    }

    setFollowList(res);
  }

  const followUser = (address) => async () => {
    await window.contract.follow_user({ address });
  }

  const returnHeader = () => {
    if (path === PATH_TYPE.FOLLOWERS) {
      return (
        <Box>
          <Heading size="lg">Followers</Heading>
          <Heading size="sm" color="gray.500">{accountId}</Heading>
        </Box>
      )
    } else if (path === PATH_TYPE.FOLLOWING) {
      return (
        <Box>
        <Heading size="lg">Following</Heading>
        <Heading size="sm" color="gray.500">{accountId}</Heading>
      </Box>
      )
    }
  }

  const renderFollowButton = (isFollowed, addressToFollow) => {
    if (window.accountID === addressToFollow) {
      return ;
    } else if (isFollowed) {
      return <Button colorScheme="blue" onClick={followUser(addressToFollow)} variant="outline">Unfollow</Button>
    } else {
      return <Button colorScheme="blue" onClick={followUser(addressToFollow)}>Follow</Button>
    }
  }

  return (
    <Box>
      {returnHeader()}
      {followList.map((user) => (
        <Box 
          bgColor="gray.200" 
          padding={3}
          my={3}
          borderRadius={10} 
          display="flex" 
          flexDirection="row" 
          alignItems="center"
          justifyContent="space-between"
          key={user.user_account_id}
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="sm" src={IPFSGateway(user.profile_image_url)} mr={3} />
            <Link as={RRLink} to={`/profile/${user.user_account_id}`}>
              <Text fontWeight="semibold">{user.user_account_id}</Text>
            </Link>
          </Box>
          {renderFollowButton(user.is_followed, user.user_account_id)}
        </Box>
      ))}
    </Box>
  )
}
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  Textarea, 
  IconButton,
  Avatar,
  Link
} from "@chakra-ui/react";
import { CgHeart, CgComment } from 'react-icons/cg';
import { useNavigate } from "react-router-dom";

import '../index.css';

import { IPFSGateway } from "../utils";

export const PostContainer = ({
  handleLikeBtnClick,
  handleShowAllPostLikes,
  handleCommentBtnClick,
  postId,
  username,
  profileImageUrl,
  date,
  content,
  likeCount,
  commentCount,
  value,
  isLiked,
  handleInputChange,
  handleCommentSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <Box backgroundColor="gray.100" display="flex" flexDirection="column" padding={4} borderRadius={6} mt={3} mb={3}>
      <Box className="click-box" onClick={() => navigate('../post/' + postId)}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" pb={4}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar
              size="sm" 
              src={profileImageUrl.length !== 0 ? IPFSGateway(profileImageUrl) : ''}
            />
            <Heading ml={2} size="xs"><Link onClick={() => {navigate('../profile/' + username)}}>{username}</Link></Heading>
          </Box>
          <Text fontSize="xs">{date}</Text>
        </Box>
        <Text pb={6}>{content}</Text>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
        <Text fontSize="xs">
          <IconButton size="sm" ml={-2} icon={<CgHeart color={isLiked ? "red" : ""} />} onClick={handleLikeBtnClick} />
            <button className="link" onClick={handleShowAllPostLikes}><span style={{fontWeight: "bold"}}>{likeCount} Likes</span></button>
        </Text>
        <Text mr={1}></Text>
          <Button size="sm" leftIcon={<CgComment />} onClick={handleCommentBtnClick}> 
            <Text fontSize="0.91em"><span style={{fontWeight: "bold"}}>{commentCount} </span>Comments</Text>
          </Button>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end" mt={3}>
        <Textarea
          value={value}
          onChange={handleInputChange}
          backgroundColor="whiteAlpha.700"
          resize='none'
          placeholder="Give your reply"
        />
        {value ? (
          <Button size="md" mt={3} colorScheme='blue' onClick={handleCommentSubmit}>Comment</Button>
        ) : ''}
      </Box>
    </Box>
  );
}

export const CreatePostForm = ({
  value,
  handleInputChange,
  handleSubmit
}) => (
  <Box display="flex" flexDirection="column" borderRadius={6} mt={3} mb={3}>
    <Textarea
      value={value}
      onChange={handleInputChange}
      resize='none' 
      rows={4.5} 
      placeholder="What are you thinking?"
      mb={4}
    />
    <Button colorScheme='blue' onClick={handleSubmit} disabled={!value.length}>Post</Button>
  </Box>
);

import * as nearAPI from 'near-api-js';
import { getConfig } from './config';
import { Web3Storage } from 'web3.storage';

const nearConfig = getConfig('mainnet');

// Initialize connection to NEAR contract and set global variables
export async function initApp() {
  // Initialize connection to network
  const near = await nearAPI.connect(nearConfig);

  // Connect wallet so users can sign transactions
  window.walletConnection = new nearAPI.WalletConnection(near);

  // Getting accountID
  window.accountID = window.walletConnection.getAccountId();

  // Load contract for later user
  window.contract = await new nearAPI.Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        'is_user_exists',
        'get_account_details',
        'is_user_followed',
        'get_user_following_list',
        'get_user_followers_list',
        'get_all_posts',
        'get_all_posts_personalized',
        'get_single_post',
        'get_user_posts',
        'get_post_likes_details',
        'get_post_comment_details'
      ],
      changeMethods: [
        'create_account',
        'follow_user',
        'create_post',
        'like_post',
        'comment_on_post',
        'edit_account_details',
        'edit_profile_image',
      ]
    }
  );
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName, "DAO Sosmed");
}

export function logout() {
  window.walletConnection.signOut();
  window.location.href = '/';
}

function getAccessToken() {
  return process.env.REACT_APP_WEB3STORAGE_TOKEN;
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export function IPFSGateway(cid) {
  return `https://dweb.link/ipfs/${cid}`
}
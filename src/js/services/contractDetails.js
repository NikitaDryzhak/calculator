import ABI from './ABI.json';
require('dotenv').config()
import { contractAddress, INFURA_PROVIDER} from '../utils/constans';
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_PROVIDER}`
);
const contract = new ethers.Contract(contractAddress, ABI, provider);
const wallet = new ethers.Wallet('1433ce1ec08c988b9631e8f63817e0d102eab4f7d4933328fe91e7673970019a', provider);
const contractWithWallet = contract.connect(wallet);

export { contractWithWallet };



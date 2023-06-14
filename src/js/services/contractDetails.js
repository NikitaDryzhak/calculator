import ABI from './ABI.json';
require('dotenv').config()
import { contractAddress, INFURA_PROVIDER} from '../utils/constans';
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_PROVIDER}`
);
const contract = new ethers.Contract(contractAddress, ABI, provider);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractWithWallet = contract.connect(wallet);

export { contractWithWallet };

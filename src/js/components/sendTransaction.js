import { contractWithWallet } from '../services/contractDetails.js';

export default async function sendTransaction(a, b, operation) {
  switch (operation) {
    case 'add':
      await contractWithWallet.add(a, b);
      break;
    case 'subtract':
      await contractWithWallet.subtract(a, b);
      break;
    case 'multiply':
      await contractWithWallet.multiply(a, b);
      break;
    case 'divide':
      await contractWithWallet.divide(a, b);
      break;
  }
}

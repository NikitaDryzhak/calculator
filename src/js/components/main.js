import {
  digitA,
  digitB,
  operation,
  calculateButton,
  usageCounter,
  result,
  loader,
  resultContainer,
} from '../utils/refs';
import { contractWithWallet } from '../services/contractDetails.js';
import Notiflix from 'notiflix';
import sendTransaction from './sendTransaction';
calculateButton.addEventListener('click', onClickCalculateBtn);

calculateButton.disabled = true;
usageCounter.hidden = true;
resultContainer.hidden = false;
loader.hidden = true;

onCheckMetamaskConnect();
function onCheckMetamaskConnect() {
  if (window.ethereum !== 'undefined') {
    ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
      const account = accounts[0];
      if (account.length > 0) {
        enableCalculator();
      }
    });
  }
}

function enableCalculator() {
  calculateButton.disabled = false;
  usageCounter.hidden = false;
}

getUsageCount();
async function getUsageCount() {
  const usageCountValue = await contractWithWallet.usageCount();
  usageCounter.innerHTML = `Calculator used: ${Number(usageCountValue)} times`;
}

function onClickCalculateBtn(e) {
  e.preventDefault();
  if (digitA.value.length === 0 || digitB.value.length === 0) {
    return Notiflix.Notify.info('Please input digit A and digit B');
  }
  sendTransaction(digitA.value, digitB.value, operation.value).then(
    listenForEventChanges()
  );
  reset();
}

async function listenForEventChanges() {
  showLoader();
  const eventFilter = contractWithWallet.filters['Result'];
  contractWithWallet.on(eventFilter, ({ data }) => {
    hideLoader();
    result.innerHTML = `Result: ${Number(data)}`;
    getUsageCount();
  });
}

function showLoader() {
  resultContainer.hidden = true;
  loader.hidden = false;
}

function hideLoader() {
  loader.hidden = true;
  resultContainer.hidden = false;
}

function reset() {
  digitA.value = null;
  digitB.value = null;
  operation.value = 'add';
}

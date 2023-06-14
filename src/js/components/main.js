import {
  digitA,
  digitB,
  operation,
  calculateButton,
  usageCounter,
  result,
  loader,
  resultContainer,
  connectMetamaskBtn,
} from '../utils/refs';
import { contractWithWallet, wallet } from '../services/contractDetails.js';
import Notiflix from 'notiflix';
import sendTransaction from './sendTransaction';
calculateButton.addEventListener('click', onClickCalculateBtn);
connectMetamaskBtn.addEventListener('click', onConnectMetamask);
usageCounter.hidden = true;
resultContainer.hidden = false;
loader.hidden = true;
let account;
detectMetamask();
function detectMetamask() {
  if (typeof window.ethereum !== 'undefined') {
    return;
  }
  Notiflix.Notify.info('Please install Metamask');
}
checkConnectedMetamask();
function checkConnectedMetamask() {
  window.ethereum
    .request({ method: 'eth_accounts' })
    .then(res => {
      if (res.length > 0) {
        connectMetamaskBtn.hidden = true;
        enableCalculator();
      }
    })
    .catch(err => {
      console.error(err);
    });
}
async function onConnectMetamask() {
  const accounts = await window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .catch(err => {
      if (err.code === 4001) {
        console.log('Please connect to Metamask');
      } else {
        console.log(err);
      }
    });
  account = accounts[0];
  if (account.length > 0) {
    connectMetamaskBtn.hidden = true;
    enableCalculator();
  }
}

function enableCalculator() {
  calculateButton.removeAttribute('disabled');
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




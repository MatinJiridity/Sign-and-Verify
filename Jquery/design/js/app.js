
$(function () {
    $(window).load(function () {
        PrepareNetwork();
    });
});


var VerifySigContract = null;
var web3 = null;
var JsonVerifySig = null;
var CurrentAccount = null;
var Content = null;
var networkDataVerifySig = null;
var signature = null;
var msg = null;


async function PrepareNetwork() {
    await loadWeb3();
    await LoadDataSmartContract();
}

async function loadWeb3() {

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum); // MetaMask
        await ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
            CurrentAccount = accounts[0];
            web3.eth.defaultAccount = CurrentAccount;
            console.log('current account: ' + CurrentAccount);
            SetCurrentAccount();
        });
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert('Non-Ethreum browser detected!');
    }

    ethereum.on('accoontChange', handleAccountChange); // from MetaMask API 
    ethereum.on('chainChange', handleChainChange);

    web3.eth.handleRevert = true;

}


function SetCurrentAccount() {
    $('#account').text(CurrentAccount);
}


async function handleAccountChange() {
    await ethereum.request({ method: 'eth-reqqusetAccount' }).then(function (accounts) {
        CurrentAccount = accounts[0];
        web3.eth.defaultAccount = CurrentAccount;
        console.log('current account: ' + CurrentAccount);
        window.location.reload();
        SetCurrentAccount();
    });
}

async function handleChainChange(_chainId) {
    windoe.location.reload();
    console.log('cahin changed ', _chainId);
}


async function LoadDataSmartContract() {

    await $.getJSON('VerifySig.json', function (contractData) {
        JsonVerifySig = contractData;
    });
    // console.log("JsonVerifySig: ",JsonVerifySig);

    web3 = await window.web3;

    const networkId = await web3.eth.net.getId();
    // console.log("networkId: ",networkId)

    networkDataVerifySig = await JsonVerifySig.networks[networkId];
    // console.log("networkDataVerifySig:",  networkDataVerifySig);



    if (networkDataVerifySig) {
        console.log("JsonVerifySig.abi:", JsonVerifySig.abi);
        console.log("networkDataVerifySig.address:", networkDataVerifySig.address);
        VerifySigContract = new web3.eth.Contract(JsonVerifySig.abi, networkDataVerifySig.address);
    }

    // $(document).on('click', '#CreateItemNFT', CreateItemNFT);

}

function signMessage() {
    const message = web3.utils.sha3($('#message').val())
    // console.log(`message: ${message}`);

    web3.eth.sign(message, CurrentAccount, function (err, result) {
        console.log(`error: ${err} sig: ${result}`);

        msg = message;
        signature = result;
        $('#msg').html('message hash:' + ' ' + message);
        $('#signature').html('signature:' + ' ' + result);
        window.alert('Message signed!');
    });
}

function verify() {
    VerifySigContract.methods.recover(msg, signature).call().then(function (result) {
        console.log('Recover', result)
        $('#address').html('This account signed the message:' + ' ' + result)
    }).catch((err) => {
        console.error(err);
        window.alert("There was an error recovering signature.")
    });
}





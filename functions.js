/*
 * Author:      Bhaskar S
 * Date:        01/27/2018
 * Description: Javascript data and functions for the Auto vehicle dealer-buyer Ethereum
 *              web application
 */

const evt = document.getElementById('evt_list');
//const cin = document.getElementById('contract');
const trfr = document.getElementById('transfer');

const ast = '2px solid #c0392b';
const dst = '2px solid #000000';

const xhr = new XMLHttpRequest();

window.onload = init();

var data = undefined;
var data2 = undefined;

/*
 * This function makes an ajax call to the url '/init' to get the values for:
 * the dealer account balance, the buyer account balance, the buyer address,
 * and the vehicle cost.
 * 
 * On success, the appropriate dom elements on the page are updated
 */
function init() {
    //trfr.addEventListener('click' , transfer);
    toggle(false); // Enable dealer button
    xhr.open('GET', '/init?w=txrp', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // log(xhr.responseText);

                data = JSON.parse(xhr.responseText);
                //console.log('response data:',data)
                document.getElementById('walletBal').innerText = data.bal;

                log('UI: Application successfully initialied');
            } else {
                log(`ERROR: status code ${xhr.status}`);
            }
        }
    };
    xhr.send();
}

/*
 * This function will ensure that only one button is active at any point in
 * time - either the button to deploy a contract on the dealer column or the
 * payment button on the buyer column once the contract has been deployed.
 */
function toggle(state) {
    
    /*cin.disabled = state;
    cin.style.border = (state ? dst : ast);
    cin.style.opacity = (state ? 0.5 : 1);
    pin.disabled = !state;
    pin.style.border = (!state ? dst : ast);
    pin.style.opacity = (!state ? 0.5 : 1);*/
}

/*
 * This function logs messages on the bottom part of the screen in the Event
 * Messages box.
 */
function log(msg) {
    let dt = new Date();
    let pnode = document.createElement('p');
    pnode.textContent = '[' + dt.toString() + '] ' + msg;
    evt.appendChild(pnode);
}

// validate submit
function validate() {
check = false;    
var walletType = document.getElementById("walletType").value;
var toAddress = document.getElementById("toAddress").value;
var amount = document.getElementById("amount").value;
console.log(walletType);
if (walletType) {
  // value is set to a valid option, so submit form
  check += 1;
} else {
    alert('Please select wallet first!')
  check -= 1;
}


if (toAddress) {
  // value is set to a valid option, so submit form
  check += 1;
} else {
    alert('Please provide recipient address!')
    check -= 1;
}

if (amount) {
  // value is set to a valid option, so submit form
  check += 1;
} else {
    alert('Please provide amount to transfer!')
    check -= 1;
}

if(check >= 3) {
    return true;
} else {
    return false;
}

}

/*
 * This function makes an ajax call to the url '/payment' to invoke the
 * deployed Vehicle2 contract method buyVehicle. On successful invocation,
 * the server returns the current dealer account balance, the current
 * buyer account balance, and a list of events that have been emitted
 * by the deployed contract.
 * 
 * On sucess, the appropriate dom elements in the page are updated
 */
function transfer() {
   if(validate()) {
    var dataTransfer = {};
    //dataTransfer.walletId = '5bc4bb85e59e7fad03ec704b340136f6';
    dataTransfer.walletType = document.getElementById("walletType").value;
    dataTransfer.toAddress = document.getElementById('toAddress').value;
    dataTransfer.amount  = document.getElementById('amount').value;
    var json = JSON.stringify(dataTransfer);
    console.log('json:',json)


    xhr.open('POST', '/transfer', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // log(xhr.responseText);
                 dataTranfer = JSON.parse(xhr.responseText);
                //toggle(false); // Enable dealer button
                 document.getElementById('walletBal').innerText = dataTranfer.bal;
                 //document.getElementById('sucessMsg').innerText = 'Payment successfully executed'; 

                log('UI: Payment successfully executed');
            } else {
                log(`ERROR: status code ${xhr.status}`);
            }
        }
    };
    xhr.send(json);
   }
}
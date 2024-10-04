import * as algosdk from "algosdk";
import { my_mnemonic as mnemonic } from "../config";
import { API_KEY as KEY } from "../config";

(async () => {
  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const algodClient = new algosdk.Algodv2(
    "a".repeat(64),
    // Use the API key if necessary
    //"https://testnet-api.algonode.cloud",
    KEY,
    443
  );

  // Decoded recipient address from Challenge 1
  const secretRecipient =
    "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY";

  // Create a payment transaction
  const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: account.addr,
    receiver: secretRecipient,
    amount: algosdk.algosToMicroalgos(1), // Sending 1 Algo
    suggestedParams: await algodClient.getTransactionParams().do(),
  });

  const signedPayTxn = payTxn.signTxn(account.sk); // Sign the transaction

  await algodClient.sendRawTransaction(signedPayTxn).do(); // Send the transaction

  const res = await algosdk.waitForConfirmation(algodClient, payTxn.txID(), 3); // Wait for confirmation

  console.log(res); // Output the result
})();

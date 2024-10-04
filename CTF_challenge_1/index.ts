import * as algosdk from "algosdk";
import { my_mnemonic as mnemonic } from "../config";

(async () => {
  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const algodClient = new algosdk.Algodv2(
    "a".repeat(64),
    "https://testnet-api.algonode.cloud",
    443
  );

  const secretRecipient =
    "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY";

  const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from : account.addr,
    to : secretRecipient,
    amount: algosdk.algosToMicroalgos(1),
    suggestedParams: await algodClient.getTransactionParams().do(),
  });

  const signedPayTxn = payTxn.signTxn(account.sk);

  await algodClient.sendRawTransaction(signedPayTxn).do();

  const res = await algosdk.waitForConfirmation(algodClient, payTxn.txID(), 3);

  console.log(res);
})();

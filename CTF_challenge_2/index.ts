import * as algosdk from "algosdk";
import { my_mnemonic as mnemonic } from "../config";

(async () => {
  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const algodClient = new algosdk.Algodv2(
    "a".repeat(64),
    "https://testnet-api.algonode.cloud",
    443
  );

  const assetId = 720485937;

  const payTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from : account.addr,
    to : account.addr,
    assetIndex: assetId,
    amount: 0,
    suggestedParams: await algodClient.getTransactionParams().do(),
  });

  const signedPayTxn = payTxn.signTxn(account.sk);

  await algodClient.sendRawTransaction(signedPayTxn).do();

  const res = await algosdk.waitForConfirmation(algodClient, payTxn.txID(), 3);

  console.log(res);
})();

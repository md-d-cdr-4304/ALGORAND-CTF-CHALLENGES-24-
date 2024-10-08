import * as algosdk from "algosdk";
//import { my_mnemonic as mnemonic } from "../config";

(async () => {
  const mnemonic = 'goat south visual angle balcony bridge rebuild wear fence together educate bind civil ripple dutch result artist ceiling tray crew blue hello quantum above marble'
  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const algodClient = new algosdk.Algodv2(
    "a".repeat(64),
    "https://testnet-api.algonode.cloud",
    443
  );

  const appId = 723522691;

  let uint8Array = new Uint8Array([85, 254, 181, 91]);

  console.log(account.addr);
  const appCall = algosdk.makeApplicationNoOpTxnFromObject({
    sender: account.addr,
    appIndex: appId,
    suggestedParams: await algodClient.getTransactionParams().do(),
    appArgs: [uint8Array, algosdk.bigIntToBytes(26340, 8)],
  });

  const signedTxn = appCall.signTxn(account.sk);

  await algodClient.sendRawTransaction(signedTxn).do();

  const res = await algosdk.waitForConfirmation(algodClient, appCall.txID(), 3);

  const decoder = new TextDecoder();

  console.log(decoder.decode(res.logs?res.logs[0]:new Uint8Array([])));
})();

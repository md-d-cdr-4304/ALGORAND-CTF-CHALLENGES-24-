from algosdk.v2client import algod
from algosdk.transaction import ApplicationNoOpTxn, wait_for_confirmation
from algosdk import abi, account, mnemonic
import json

algod_token = 'your_algod_token'
algod_address = 'https://testnet-api.algonode.cloud'
headers = {'X-API-Key': algod_token}
algod_client = algod.AlgodClient(algod_token, algod_address, headers)

mnemonic_phrase = 'goat south visual angle balcony bridge rebuild wear fence together educate bind civil ripple dutch result artist ceiling tray crew blue hello quantum above marble'
private_key = mnemonic.to_private_key(mnemonic_phrase)
sender_address = account.address_from_private_key(private_key)

abi_json = '''
{
    
        "name": "Ctffour",
        "methods": [
            {
                "name": "provideanswer",
                "args": [
                    {
                        "type": "uint64",
                        "name": "answer"
                    }
                ],
                "readonly": false,
                "returns": {
                    "type": "string"
                }
            }
        ],
        "networks": {}

}'''


contract_abi = abi.Contract.from_json(abi_json)

app_id = 723522691
nonce = 26340

params = algod_client.suggested_params()

method = contract_abi.get_method_by_name("provideanswer")
txn = ApplicationNoOpTxn(
    sender_address, 
    params, 
    app_id, 
    app_args=[method.get_selector(), nonce]
)

signed_txn = txn.sign(private_key)

txn_id = algod_client.send_transaction(signed_txn)
print(f"Transaction ID: {txn_id}")

confirmation = wait_for_confirmation(algod_client, txn_id, 4)
print(f"Transaction confirmed in round: {confirmation['confirmed-round']}")

print(f"Result: {confirmation}")

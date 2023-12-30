import fs from "fs";
import * as dotenv from "dotenv";
import {
  RpcProvider,
  Account,
  Contract
} from 'starknet';

dotenv.config();

const privateKey = process.env.PRIVKEY as string
const infuraUrl = process.env.INFURAURL as string
const accountAddr = process.env.ACCOUNTADDR as string

// privateKey => myaddr
// accountAddr 是 myaddr 在 startnet 上 signup 的地址

// https://starkscan.co/contract/0x0600386e4cd85d7bb925892b61b14ff019d3dd8e31432f4b97c8ee2462e0375d
const contractAddress = "0x0600386e4cd85d7bb925892b61b14ff019d3dd8e31432f4b97c8ee2462e0375d"
const abi = JSON.parse(fs.readFileSync("./abi.json").toString("ascii"))

const provider = new RpcProvider({
  nodeUrl: infuraUrl
});

const account = new Account(provider, accountAddr, privateKey)
const address = account.address
console.log(`Account Address: ${address}`);

const contract = new Contract(abi, contractAddress, account);
contract.connect(account)

async function main() {

  let ins = `{"p":"snsc-20","op":"mint","tick":"stark","amt":"1000"}`
  // const { suggestedMaxFee: estimatedFee1 } = await account.estimateInvokeFee({ contractAddress: contractAddress, entrypoint: "inscription", calldata: [splitted, address] });

  const {
    transaction_hash: tx_hash
  } = await contract.invoke("inscription", [ins, address])

  console.log(tx_hash)
  await provider.waitForTransaction(tx_hash)

  console.log(`hash: ${tx_hash}`)
  console.log(`https://starkscan.co/tx/${tx_hash}`)
}

main()

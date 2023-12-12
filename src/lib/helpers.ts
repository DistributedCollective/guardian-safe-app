import { Interface } from "ethers/lib/utils";

export const truncate = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }

  return str.substring(0, length) + '...';
}

const iface = new Interface(['function cancel(uint256 txId)']);
export const generateCancelData = (txId: number) => iface.encodeFunctionData('cancel', [txId]);

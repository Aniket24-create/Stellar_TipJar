import {
  isConnected,
  getAddress,
  signTransaction,
  isAllowed,
  requestAccess
} from "@stellar/freighter-api";

export const checkConnection = async (): Promise<boolean> => {
  const connectedStatus = await isConnected();
  // @ts-ignore - Handle both v5 (boolean) and v6 ({ isConnected: boolean })
  const isConn = typeof connectedStatus === 'object' ? connectedStatus.isConnected : connectedStatus;
  
  if (isConn) {
    const allowedStatus = await isAllowed();
    // @ts-ignore
    const isAllow = typeof allowedStatus === 'object' ? allowedStatus.isAllowed : allowedStatus;
    if (isAllow) {
      return true;
    }
  }
  return false;
};

export const connectWallet = async (): Promise<string | null> => {
  try {
    const connectedStatus = await isConnected();
    // @ts-ignore
    const isConn = typeof connectedStatus === 'object' ? connectedStatus.isConnected : connectedStatus;
    
    if (!isConn) {
      alert("Freighter wallet not installed! Please install the Freighter browser extension.");
      return null;
    }
    
    // Request access prompt
    const accessResponse = await requestAccess();
    // @ts-ignore
    if (typeof accessResponse === 'object' && accessResponse.error) {
      console.error(accessResponse.error);
      return null;
    }
    
    const publicKeyResponse = await getAddress();
    // @ts-ignore
    const address = typeof publicKeyResponse === 'object' ? publicKeyResponse.address : publicKeyResponse;
    
    if (!address) {
       console.error("No address returned");
       return null;
    }
    
    return address;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

export const signStellarTransaction = async (xdr: string, networkPassphrase: string): Promise<string> => {
  try {
    const signedTxResponse = await signTransaction(xdr, {
      networkPassphrase: networkPassphrase,
    });
    // @ts-ignore
    if (typeof signedTxResponse === 'object' && signedTxResponse.error) {
       throw new Error(signedTxResponse.error);
    }
    // @ts-ignore
    return typeof signedTxResponse === 'object' ? signedTxResponse.signedTxXdr || signedTxResponse.signedTx || signedTxResponse : signedTxResponse;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw error;
  }
};

export const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

import {
  isConnected,
  getAddress,
  signTransaction,
  isAllowed,
  requestAccess
} from "@stellar/freighter-api";

export const checkConnection = async (): Promise<boolean> => {
  try {
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
  } catch (error) {
    console.log("Freighter not available:", error);
    return false;
  }
};

export const connectWallet = async (): Promise<string | null> => {
  try {
    // Check if Freighter is installed by trying to call isConnected
    let connectedStatus;
    try {
      connectedStatus = await isConnected();
    } catch (error) {
      console.error("Freighter not detected:", error);
      alert("Freighter wallet not installed! Please install the Freighter browser extension from https://www.freighter.app/");
      return null;
    }

    // @ts-ignore
    const isConn = typeof connectedStatus === 'object' ? connectedStatus.isConnected : connectedStatus;
    
    if (!isConn) {
      alert("Freighter wallet not installed! Please install the Freighter browser extension from https://www.freighter.app/");
      return null;
    }
    
    // Request access - this will show the connection popup
    const accessResponse = await requestAccess();
    console.log("Access response:", accessResponse);
    
    // @ts-ignore
    if (typeof accessResponse === 'object' && accessResponse.error) {
      console.error("Access denied:", accessResponse.error);
      alert("Access to Freighter was denied. Please try again and approve the connection.");
      return null;
    }
    
    // Get the public key/address
    const publicKeyResponse = await getAddress();
    console.log("Public key response:", publicKeyResponse);
    
    // @ts-ignore
    const address = typeof publicKeyResponse === 'object' ? publicKeyResponse.address : publicKeyResponse;
    
    if (!address) {
       console.error("No address returned from Freighter");
       alert("Failed to get wallet address. Please make sure Freighter is unlocked and try again.");
       return null;
    }
    
    console.log("Successfully connected to wallet:", address);
    return address;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Failed to connect to Freighter wallet. Please make sure it's installed and unlocked.");
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

import * as StellarSdk from "@stellar/stellar-sdk";

// Define standard fee.
const BASE_FEE = "100000"; 

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

export const fetchBalance = async (publicKey: string): Promise<string> => {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find((b) => b.asset_type === "native");
    return xlmBalance ? xlmBalance.balance : "0.00";
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0.00";
  }
};

export const createPaymentTransaction = async (
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string
): Promise<string> => {
  try {
    const account = await server.loadAccount(sourcePublicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    return transaction.toXDR();
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    throw error;
  }
};

/**
 * Wraps a signed transaction in a Fee Bump transaction paid by the sponsor.
 * WARNING: In a real app, this MUST be done on a secure backend!
 */
export const applyFeeBumpAndSubmit = async (signedInnerXDR: string): Promise<any> => {
  try {
    const innerTx = StellarSdk.TransactionBuilder.fromXDR(
      signedInnerXDR,
      StellarSdk.Networks.TESTNET
    ) as StellarSdk.Transaction;

    const sponsorSecret = import.meta.env.VITE_SPONSOR_SECRET_KEY;
    
    if (!sponsorSecret) {
      console.warn("No VITE_SPONSOR_SECRET_KEY found. Submitting inner transaction directly.");
      return await server.submitTransaction(innerTx);
    }

    const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);
    
    // Create fee bump transaction
    const feeBumpTx = StellarSdk.TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      BASE_FEE, // Base fee for the fee bump
      innerTx,
      StellarSdk.Networks.TESTNET
    );

    // Sponsor signs the fee bump
    feeBumpTx.sign(sponsorKeypair);

    // Submit fee bump to network
    return await server.submitTransaction(feeBumpTx);
  } catch (error: any) {
    console.error("Error in applyFeeBumpAndSubmit:", error);
    if (error.response && error.response.data && error.response.data.extras) {
      throw new Error(
        error.response.data.extras.result_codes.transaction || "Transaction failed"
      );
    }
    throw error;
  }
};

export const submitTransaction = async (signedXDR: string): Promise<any> => {
  // We'll use applyFeeBumpAndSubmit as our default submission route to enable gasless tips!
  return applyFeeBumpAndSubmit(signedXDR);
};

export const fetchTransactionHistory = async (publicKey: string): Promise<any[]> => {
  try {
    const payments = await server
      .payments()
      .forAccount(publicKey)
      .order('desc')
      .limit(50)
      .call();
    
    return payments.records;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
};

export const streamPayments = (
  publicKey: string,
  onMessage: (message: any) => void,
  onError: (error: any) => void
) => {
  const closeStream = server
    .payments()
    .forAccount(publicKey)
    .cursor("now")
    .stream({
      onmessage: onMessage,
      onerror: onError,
    });
  
  return closeStream;
};

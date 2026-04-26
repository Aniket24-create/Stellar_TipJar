// Mock alias mapping for testing
const mockRegistry: Record<string, string> = {
  '@alice': 'GCSQ67IUIIPQSZGX25NTHSYKWW4QQECON3VUHMKCBD7YWZA3SI2Q57QC',
  '@bob': 'GB3LQQJ2I7X6Q6K3JZTJYQQB3VQZQZQZQZQZQZQZQZQZQZQZQZQZQZ',
};

/**
 * Resolves a username alias to a Stellar public key.
 * If the input doesn't start with '@', it assumes it's already a public key.
 */
export const resolveAlias = async (input: string): Promise<string> => {
  if (!input.startsWith('@')) {
    return input; // Assume it's a raw address
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const address = mockRegistry[input.toLowerCase()];
  if (!address) {
    throw new Error(`Alias ${input} not found in registry.`);
  }
  
  return address;
};

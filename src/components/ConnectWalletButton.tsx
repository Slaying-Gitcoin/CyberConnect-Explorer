import { useCallback, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const ConnectWalletButton = () => {
  const { connectWallet, address, ens } = useContext(Web3Context);

  const connect = useCallback(async () => {
    await connectWallet();
  }, [connectWallet]);

  return (
    <>
      {!address ? (
        <button onClick={connect}>
          Connect Wallet
        </button>
      ) : (
        <div>{ens || address}</div>
      )}
    </>
  );
};

export default ConnectWalletButton;

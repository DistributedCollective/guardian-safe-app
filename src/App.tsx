import { FC, PropsWithChildren } from 'react';
import { Button } from '@sovryn/ui';
import { OnboardProvider } from '@sovryn/onboard-react';
import { useAccount } from './hooks/useAccount';

export const App: FC<PropsWithChildren> = ({ children }) => {
  const { address, connect } = useAccount();
  
  return (
    <>
      {address ? (<>{children}</>) : (<div className='w-full h-screen flex justify-center items-center'><Button text="Connect Wallet" onClick={connect} /></div>)}
      <OnboardProvider />
    </>
  );
}

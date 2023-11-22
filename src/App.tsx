import { FC, PropsWithChildren } from 'react';
import { Button } from '@sovryn/ui';
import { OnboardProvider } from '@sovryn/onboard-react';
import { ApolloProvider } from '@apollo/client';
import { useAccount } from './hooks/useAccount';
import { apollo } from './lib/apollo';

export const App: FC<PropsWithChildren> = ({ children }) => {
  const { address, connect } = useAccount();
  
  return (
    <ApolloProvider client={apollo}>
      {address ? (<>{children}</>) : (<div className='w-full h-screen flex justify-center items-center'><Button text="Connect Wallet" onClick={connect} /></div>)}
      <OnboardProvider />
    </ApolloProvider>
  );
}

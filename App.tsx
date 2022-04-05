import * as React from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { Button, Text, View } from 'react-native';
import { getAccessToken } from './src/fetcher/auth';

const useProxy = true;

const redirectUri = AuthSession.makeRedirectUri({
  useProxy,
});

const issuer = process.env.ISSUER as string;

const clientSecret = process.env.CLIENT_SECRET as string;

const config: AuthSession.AuthRequestConfig = {
  clientId: process.env.CLIENT_ID as string,
  redirectUri,
  scopes: [
    'openid',
    'tts-saas-user-attribute',
    'profile',
    'email',
    'speech-api',
    'console-prosa',
    'payment-service',
  ],
};
export default function App() {
  const discovery = AuthSession.useAutoDiscovery(issuer);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    config,
    discovery
  );

  React.useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  React.useEffect(() => {
    // Change this to data fetcher lib
    if (result && result.type === 'success') {
      getAccessToken(
        issuer,
        config.clientId,
        clientSecret,
        result.params.code,
        redirectUri,
        request?.codeVerifier
      );
    }
  }, [request, result, redirectUri]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title='Login!'
        disabled={!request}
        onPress={() => promptAsync({ useProxy })}
      />
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
    </View>
  );
}

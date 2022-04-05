export const getAccessToken = async (
  issuer: string,
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
  codeVerifier: string | undefined
) => {
  try {
    if (!codeVerifier) throw new Error('codeVerifier is required');
    const myHeaders = new Headers();
    myHeaders.append(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=UTF-8'
    );
    const body = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    };
    const formBody: string[] = [];
    Object.entries(body).forEach(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + '=' + encodedValue);
    });
    const formData = formBody.join('&');
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    };
    fetch(`${issuer}/protocol/openid-connect/token`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => {
        throw new Error('Error fetching access token: ' + error);
      });
  } catch (error) {
    throw new Error('Error fetching access token: ' + error);
  }
};

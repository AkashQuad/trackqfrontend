import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Current time in seconds

  return decodedToken.exp < currentTime;
};

export default isTokenExpired;
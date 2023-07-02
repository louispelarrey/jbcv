import jwt_decode from 'jwt-decode';

interface DecodedToken {
  sub: string;
  username: string;
  roles: string[];
}

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: DecodedToken = jwt_decode(token);
    return decoded.sub;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default getUserIdFromToken;

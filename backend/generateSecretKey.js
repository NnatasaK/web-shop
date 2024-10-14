import { randomBytes } from 'crypto';

const generateSecretKey = () => {
  const secretKey = randomBytes(64).toString('hex');
  console.log(`Your generated JWT secret key: ${secretKey}`);
};

generateSecretKey();

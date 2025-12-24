import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const useSocket = () => {
  const socket = useContext(SocketContext);

  // Note: Socket null ho sakta hai agar user logged out hai, 
  // isliye hum error throw nahi kar rahe, bas return kar rahe hain.
  return socket;
};

export default useSocket;
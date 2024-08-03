const extract = (data: any) => {
  if (Object.keys(data.handshake.auth).length != 0) {
    const token = data.handshake.auth.authorization;
    return token.split('Bearer ')[1];
  } else {
    const token = data.handshake.headers.authorization;
    return token.split('Bearer ')[1];
  }
};

export default extract;

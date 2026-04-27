export const getSessionId = () => {
  let sessionId = localStorage.getItem('founderverse_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('founderverse_session', sessionId);
  }
  return sessionId;
};

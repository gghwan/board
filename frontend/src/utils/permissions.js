// utils/permissions.js
export const checkMicrophonePermission = async () => {
    if (!navigator.permissions) {
      throw new Error('권한 API를 사용할 수 없습니다.');
    }
    
    const permission = await navigator.permissions.query({ name: 'microphone' });
    if (permission.state === 'denied') {
      throw new Error('마이크 권한이 거부되었습니다.');
    }
    
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  };
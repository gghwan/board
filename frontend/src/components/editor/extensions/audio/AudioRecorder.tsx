import { useState, useRef, useEffect } from 'react';
import { useEditorContext } from '../../core/contexts/EditorContext';
import IconButton from '../../shared/buttons/IconButton';

interface AudioRecorderProps {
  onSave: (blob: Blob) => void;
  onClose: () => void;
}

const AudioRecorder = ({ onSave, onClose }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const { isAudioRecorderOpen } = useEditorContext();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
        onSave(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('오디오 녹음 실패:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }
  };

  if (!isAudioRecorderOpen) return null;

  return (
    <div className="audio-recorder p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <IconButton
          icon={isRecording ? 'stop' : 'microphone'}
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? '녹음 중지' : '녹음 시작'}
        />
        <span className="text-sm">
          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
        </span>
        <IconButton
          icon="times"
          onClick={onClose}
          title="닫기"
        />
      </div>
    </div>
  );
};

export default AudioRecorder;
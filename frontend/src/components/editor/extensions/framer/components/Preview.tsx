import { FC } from 'react';

interface PreviewProps {
  projectUrl: string;
  onActivateEdit: () => void;
  isEditMode: boolean;
}

export const Preview: FC<PreviewProps> = ({ projectUrl, onActivateEdit, isEditMode }) => {
  return (
    <div className="relative">
      <iframe
        src={projectUrl}
        className="w-full h-[400px]"
        allowFullScreen
      />
      {!isEditMode && (
        <div 
          className="absolute inset-0 bg-transparent cursor-pointer"
          onClick={onActivateEdit}
        />
      )}
    </div>
  );
};

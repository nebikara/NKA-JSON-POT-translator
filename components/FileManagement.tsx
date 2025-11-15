
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileJson, Trash2, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileManagementProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const FileCard: React.FC<{ file: UploadedFile; onRemove: (id: string) => void }> = ({ file, onRemove }) => (
    <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between transition-all duration-200 hover:bg-gray-600">
        <div className="flex items-center gap-3">
            <FileJson className="text-purple-400" size={20} />
            <div>
                <p className="font-semibold text-gray-200 text-sm">{file.name}</p>
                <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB | {file.lineCount} lines
                </p>
            </div>
        </div>
        <button onClick={() => onRemove(file.id)} className="text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-800 transition-colors">
            <Trash2 size={16} />
        </button>
    </div>
);

const FileManagement: React.FC<FileManagementProps> = ({ files, setFiles }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 10MB).`);
        return;
      }
      if (file.type !== 'application/json') {
        alert(`File ${file.name} is not a JSON file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          const parsedJson = JSON.parse(content);
          const lineCount = content.split(/\r\n|\r|\n/).length;

          const newFile: UploadedFile = {
            id: `${file.name}-${new Date().getTime()}`,
            name: file.name,
            size: file.size,
            content,
            lineCount,
            parsedJson
          };

          setFiles(prev => [...prev, newFile]);
        } catch (e) {
          alert(`Error parsing ${file.name}. Please ensure it is a valid JSON file.`);
        }
      };
      reader.readAsText(file);
    });
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'application/json': ['.json']} });

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const removeAllFiles = () => {
    setFiles([]);
  };

  return (
    <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-1 text-center">Upload Your JSON Files</h2>
        <p className="text-gray-400 mb-6 text-center">Drag and drop files or click to select them from your computer.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div
                {...getRootProps()}
                className={`
                border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-300 h-full flex flex-col justify-center items-center
                ${isDragActive ? 'border-purple-500 bg-gray-700' : 'border-gray-600 bg-gray-900/50 hover:border-purple-400'}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-gray-400">
                <UploadCloud size={56} className="mb-4 text-gray-500" />
                {isDragActive ? (
                    <p className="text-lg font-semibold">Drop the files here...</p>
                ) : (
                    <>
                    <p className="text-lg font-semibold">Drag & drop JSON files here</p>
                    <p className="text-sm">or click to select files (Max 10MB each)</p>
                    </>
                )}
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-200">Uploaded Files ({files.length})</h3>
                    {files.length > 0 && (
                        <button onClick={removeAllFiles} className="text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
                            <X size={14} /> Remove All
                        </button>
                    )}
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 bg-gray-900/50 p-3 rounded-lg">
                    {files.length > 0 ? (
                        files.map(file => <FileCard key={file.id} file={file} onRemove={removeFile} />)
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Awaiting files...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default FileManagement;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, Music, Video, Eye } from 'lucide-react';
import { chatFilesAPI, type FileAttachment } from '@/services/chatFilesAPI';
import { toast } from 'sonner';

interface FileAttachmentProps {
  attachment: FileAttachment;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ attachment }) => {
  const { filename, originalName, mimetype, size, url } = attachment;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (mimetype.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (mimetype.startsWith('audio/')) return <Music className="h-5 w-5 text-green-500" />;
    if (mimetype.startsWith('video/')) return <Video className="h-5 w-5 text-red-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getFileType = (): 'files' | 'audio' | 'video' => {
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype.startsWith('video/')) return 'video';
    return 'files';
  };

  const handleDownload = async () => {
    try {
      const response = await chatFilesAPI.downloadFile(getFileType(), filename);
      
      // Créer un blob et déclencher le téléchargement
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Fichier téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement du fichier');
    }
  };

  const handlePreview = () => {
    const fileUrl = chatFilesAPI.getFileUrl(url);
    window.open(fileUrl, '_blank');
  };

  const canPreview = () => {
    return mimetype.startsWith('image/') || 
           mimetype.startsWith('video/') || 
           mimetype.startsWith('audio/') ||
           mimetype === 'application/pdf';
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getFileIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {originalName}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(size)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 mt-3">
        {canPreview() && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Aperçu
          </Button>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          Télécharger
        </Button>
      </div>

      {/* Prévisualisation pour les images */}
      {mimetype.startsWith('image/') && (
        <div className="mt-2">
          <img
            src={chatFilesAPI.getFileUrl(url)}
            alt={originalName}
            className="max-w-full h-32 object-cover rounded border cursor-pointer"
            onClick={handlePreview}
          />
        </div>
      )}

      {/* Lecteur pour les audios */}
      {mimetype.startsWith('audio/') && (
        <div className="mt-2">
          <audio
            controls
            className="w-full h-8"
            src={chatFilesAPI.getFileUrl(url)}
          />
        </div>
      )}

      {/* Lecteur pour les vidéos */}
      {mimetype.startsWith('video/') && (
        <div className="mt-2">
          <video
            controls
            className="max-w-full h-32 rounded border"
            src={chatFilesAPI.getFileUrl(url)}
          />
        </div>
      )}
    </div>
  );
};

export default FileAttachment;

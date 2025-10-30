import { getDocumentUrl } from '../../../api/auth';

export const useDocActions = (setMessage) => {
  const preview = async (docId) => {
    try {
      const { url } = await getDocumentUrl(docId);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Preview failed:', error);
      setMessage?.(`Preview failed: ${error.message || 'Unknown error'}`);
    }
  };

  const download = async (docId, fileName) => {
    try {
      const { url } = await getDocumentUrl(docId);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setMessage?.(`Download failed: ${error.message || 'Unknown error'}`);
    }
  };

  return { preview, download };
};



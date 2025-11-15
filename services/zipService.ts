import JSZip from 'jszip';
import saveAs from 'file-saver';
import { TranslationResult } from '../types';

export const createZip = async (results: TranslationResult[]): Promise<void> => {
  const zip = new JSZip();

  results.forEach(result => {
    const folderName = result.fileName.replace('.json', '');
    const folder = zip.folder(folderName);
    if (folder) {
        folder.file(
            `${result.languageCode}.json`,
            JSON.stringify(result.translatedJson, null, 2)
        );
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'translations.zip');
};

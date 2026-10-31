import { useEffect, useState } from 'react';
import { DOWNLOAD_OPTIONS, type DownloadOption } from '@/lib/downloads';

async function fileExists(file: string): Promise<boolean> {
  try {
    const response = await fetch(file, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') ?? '';
    return response.ok && !contentType.includes('text/html');
  } catch {
    return false;
  }
}

export function useAvailableDownloads(): DownloadOption[] {
  const [available, setAvailable] = useState<DownloadOption[]>([]);

  useEffect(() => {
    let active = true;
    void Promise.all(DOWNLOAD_OPTIONS.map(async (option) => ((await fileExists(option.file)) ? option : null))).then(
      (results) => {
        if (active) setAvailable(results.filter((option): option is DownloadOption => option !== null));
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return available;
}

export interface DownloadOption {
  label: string;
  file: string;
}

export const DOWNLOAD_OPTIONS: DownloadOption[] = [
  { label: 'Windows (.exe)', file: '/downloads/valora.exe' },
  { label: 'Linux (.deb)', file: '/downloads/valora.deb' },
];

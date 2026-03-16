export interface NotificationItem {
  id: number;
  text: string;
  timestamp: number;
}

export interface OverlayState {
  scoreLeft: string;
  scoreRight: string;
  playerNamesLeft: string;
  playerNamesRight: string;
  teamNameLeft: string;
  teamNameRight: string;
  teamColorLeft: string;
  teamColorRight: string;
  winsLeft: number;
  winsRight: number;
  week: number;
  overlay: string;
}

export interface ConfigState {
  appColor: string;
  columnColor: string;
  autoServer: boolean;
  overlayURL: string;
  autoUpdate: boolean;
}

export interface ImageUrls {
  [key: string]: string;
}

export interface OBSScene {
  collection: string;
  scene: string;
}

export interface DownloadStatus {
  [key: string]: 'downloaded' | 'update-available' | 'not-downloaded' | 'deleted';
}

export interface OverlayInfo {
  name: string;
  displayName: string;
  status: 'downloaded' | 'update-available' | 'not-downloaded' | 'deleted';
  version?: string;
  localVersion?: string;
}

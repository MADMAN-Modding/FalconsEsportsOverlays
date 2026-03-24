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

export interface RawOverlayState {
  overlay: string;
  player_names_left: string;
  player_names_right: string;
  score_left: string;
  score_right: string;
  team_color_left: string;
  team_color_right: string;
  team_name_left: string;
  team_name_right: string;
  week: number;
  wins_left: number;
  wins_right: number;
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

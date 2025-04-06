
export type Message = {
  id: number;
  platform: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
};

export type ConnectedAccountsMap = {
  [key: string]: boolean;
};

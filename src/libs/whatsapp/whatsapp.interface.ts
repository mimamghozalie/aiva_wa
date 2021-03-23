export interface MessageReceived {
  body: string;
  data: any;
  userId?: string;
  deviceId: string;
  author: string;
  chatId: string;
  fromMe: boolean;
  type: 'image' | 'video' | 'chat';
  time: any;
  msgId: string;
  mediaPath?: string;
  senderName?: string;
  ack?: '-1' | '0' | '1' | '2' | '3' | '4';
}

export interface MessageAck {
  messageId: string;
  ack: '-1' | '0' | '1' | '2' | '3' | '4';
  msg: any;
  deviceId: string;
}

export interface Remote {
  server: string;
  user: string;
  _serialized: string;
}

export interface Id {
  fromMe: boolean;
  remote: Remote;
  id: string;
  _serialized: string;
}

export interface WhatsAppMessage {
  id: Id;
  ack: number;
  hasMedia: boolean;
  body: string;
  type: string;
  timestamp: number;
  from: string;
  to: string;
  isForwarded: boolean;
  broadcast: boolean;
  fromMe: boolean;
  hasQuotedMsg: boolean;
  mentionedIds: any[];
}

export interface WhatsAppResponse {
  error: boolean;
  data?: WhatsAppMessage | any;
  message?: string;
}

export interface WAStatus {
  deviceId: string;
  number?: string;
  connection?: WAMethod;
  qrcode?: string;
  session?: any;
  status?: string;
}

export interface WAMethod {
  sendMessage: (phone: string, msg: any) => {};
  getContacts: () => {};
  getContactById: (
    phone: string,
  ) => {
    getProfilePicUrl(): string;
  };
  getProfilePicture: (phone: string) => {};
  isRegisteredUser: (phone: string) => {};
  getChatById: (phone: string) => {};
  getChats: () => {};
  getChat: () => {};
  destroy: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface newAuth {
  deviceId: string;
  session: string;
  status: 'pairing' | 'connected' | 'offline'
}

export interface sendMessageParam {
  deviceId: string;
  phone: string;
  mediaPath: string;
  type: 'image' | 'video';
  caption?: string;
}

export interface MessageResponse {
  error: boolean;
  message?: string;
  data?: any;
}

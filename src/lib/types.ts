export type Student = {
  id: string;
  name: string;
  batch: string;
  parentName: string;
  phone: string;
};

export type MessageTemplate = {
  id: string;
  title: string;
  body: string;
};

export type HistoryEntry = {
  id: string;
  at: string;
  batch: string;
  count: number;
  message: string;
};

export type AppSettings = {
  schoolName: string;
  pin: string;
  pinEnabled: boolean;
  speakStatus: boolean;
  testPhone: string;
};

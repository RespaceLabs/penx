import { atom, useAtom } from 'jotai';
import { Message } from '@prisma/client';
import { store } from '@/store';
import { SocketConnector } from '@/lib/socket/socketConnector';

export enum MessageStatus {
  Sended = 1,
  Fail = 2,
  Sending = 3
}

export enum IGroupStatus {
  OK = 1,
  Fail = 2,
}

export enum ContentType {
  TEXT = 1,
  IMAGE = 2
};

export interface IGroupMessage {
  channelId: string,
  content: string
  uid: string
  updateId: string
  userImage: string
  userName: string
  contentType: ContentType
}

export interface IMessage extends Message {
  updateId?: string
  fromUser: {
    image: string;
    name: string;
  };
}

interface MessagesState {
  messages: IMessage[];
  currentPage: number;
  status: IGroupStatus;
  isNew: boolean
}

const messagesAtom = atom<Map<string, MessagesState>>(new Map());

export function useMessages() {
  const [messagesMap, setMessagesMap] = useAtom(messagesAtom);

  const getMessagesState = (channelId: string): MessagesState => messagesMap.get(channelId) || { messages: [], currentPage: 1, status: IGroupStatus.OK, isNew: false };

  const addMessages = (channelId: string, newMessages: IMessage[], newPage: number, isNew: boolean) => {
    // const currentState = getMessagesState(channelId);
    // const updatedPage = newPage !== undefined ? newPage : currentState.currentPage;

    setMessagesMap((prevMap) => {
      const currentState = getMessagesState(channelId);
      return new Map(prevMap).set(channelId, {
        messages: [...newMessages, ...currentState.messages],
        currentPage: newPage,
        status: IGroupStatus.OK,
        isNew
      });
    });
  };

  const updateMessages = (channelId: string, newMessages: IMessage[], newPage?: number) => {
    const currentState = getMessagesState(channelId);
    const updatedPage = newPage !== undefined ? newPage : currentState.currentPage;

    setMessagesMap((prevMap) => {
      return new Map(prevMap).set(channelId, { messages: newMessages, currentPage: updatedPage, status: IGroupStatus.OK, isNew: false })
    });
  };

  return { messagesMap, addMessages, updateMessages, getMessagesState };
}

export function getMessagesStateById(channelId: string): MessagesState | undefined {
  return store.get(messagesAtom).get(channelId)
}

export function initFailStoreById(channelId: string) {
  store.set(messagesAtom, (prevMap) => {
    if (!prevMap.has(channelId)) {
      // Create a new state with default values
      const initialState: MessagesState = {
        messages: [],
        currentPage: 1,
        status: IGroupStatus.Fail,
        isNew: true
      };

      return new Map(prevMap).set(channelId, initialState);
    }

    // If the channelId already exists, return the Map as is
    return prevMap;
  });
}

export function addMessageToStore(channelId: string, newMessage: IMessage) {
  const instance = SocketConnector.getInstance();
  const updateId = newMessage.updateId;
  const hasUpdateId = instance?.hasChatSendMsgUpdateId(updateId!);

  if (updateId && hasUpdateId) {
    store.set(messagesAtom, (prevMap) => {
      const currentState = prevMap.get(channelId) || { messages: [], currentPage: 1 };
      return new Map(prevMap).set(channelId, {
        ...currentState,
        messages: currentState.messages.map((msg) =>
          msg.id === updateId ? { ...msg, id: newMessage.id, status: newMessage.status } : msg
        ),
        status: IGroupStatus.OK,
        isNew: true
      });
    });

    instance.removeChatSendMsgUpdateId(updateId);
  } else {
    store.set(messagesAtom, (prevMap) => {
      const currentState = prevMap.get(channelId) || { messages: [], currentPage: 1 };
      return new Map(prevMap).set(channelId, {
        ...currentState,
        messages: [...currentState.messages, newMessage],
        status: IGroupStatus.OK,
        isNew: true
      });
    });
  }
}

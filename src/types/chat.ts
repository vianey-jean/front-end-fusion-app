
import { User } from './auth';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isAutoReply?: boolean;
  isEdited?: boolean;
  isAdminReply?: boolean;
  isSystemMessage?: boolean;
}

export interface Conversation {
  messages: Message[];
  participants: string[];
}

export interface ServiceConversation extends Conversation {
  type: 'service';
  id: string;
  clientInfo?: User & {
    id: string;
    nom: string;
    email: string;
  };
  unreadCount?: number;
}

export interface AdminConversation extends Conversation {
  type: 'admin';
  id: string;
  participantInfo?: User;
}

export interface ChatWidget {
  isOpen: boolean;
  isMinimized: boolean;
  unreadCount: number;
  selectedConversation?: string;
}

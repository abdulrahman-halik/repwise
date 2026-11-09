'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { StreamChat } from 'stream-chat';
import { useCreateChatClient } from 'stream-chat-react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';

export interface StreamUserIdentity {
  id: string;
  name: string;
  image?: string;
  role: 'client' | 'trainer';
  token: string;
}

interface StreamContextValue {
  streamUser: StreamUserIdentity | null;
  chatClient: StreamChat | null;
  videoClient: StreamVideoClient | null;
  isConnecting: boolean;
  connectionError: string | null;
  loginWithUser: (input: {
    userId: string;
    name?: string;
    image?: string;
    role?: 'client' | 'trainer';
  }) => Promise<void>;
  logoutStreamUser: () => void;
}

const StreamContext = createContext<StreamContextValue | undefined>(undefined);

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || '';

function ConnectedStreamClients({
  user,
  apiKey,
  onReadyChange,
  children,
}: {
  user: StreamUserIdentity;
  apiKey: string;
  onReadyChange: (chat: StreamChat | null, video: StreamVideoClient | null) => void;
  children: React.ReactNode;
}) {
  const tokenProvider = useCallback(async () => {
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        name: user.name,
        image: user.image,
        role: user.role,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.error || 'Failed to fetch Stream token');
    }
    return data.token as string;
  }, [user.id, user.name, user.image, user.role]);

  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: user.token || tokenProvider,
    userData: {
      id: user.id,
      name: user.name,
      image: user.image,
    },
  });

  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    const videoTokenProvider = async () => {
      if (user.token) return user.token;
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          image: user.image,
          role: user.role,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Failed to fetch Stream Video token');
      }
      return data.token as string;
    };

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      token: user.token,
      tokenProvider: videoTokenProvider,
    });

    setVideoClient(client);

    return () => {
      setVideoClient(null);
      client.disconnectUser().catch(() => {});
    };
  }, [apiKey, user.id, user.name, user.image, user.role, user.token]);

  useEffect(() => {
    onReadyChange(chatClient, videoClient);
  }, [chatClient, videoClient, onReadyChange]);

  useEffect(() => {
    return () => {
      onReadyChange(null, null);
    };
  }, [onReadyChange]);

  return <>{children}</>;
}

export function StreamProvider({ children }: { children: React.ReactNode }) {
  // Credentials kept in React state (never localStorage) so two browser tabs can be two distinct users
  const [streamUser, setStreamUser] = useState<StreamUserIdentity | null>(null);
  const [runtimeApiKey, setRuntimeApiKey] = useState<string>(STREAM_API_KEY);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleReadyChange = useCallback(
    (chat: StreamChat | null, video: StreamVideoClient | null) => {
      setChatClient(chat);
      setVideoClient(video);
    },
    [],
  );

  const loginWithUser = useCallback(
    async (input: {
      userId: string;
      name?: string;
      image?: string;
      role?: 'client' | 'trainer';
    }) => {
      setIsConnecting(true);
      setConnectionError(null);
      try {
        const res = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        if (!res.ok || !data.token || !data.user) {
          throw new Error(data.error || 'Unable to authenticate with Stream');
        }
        if (data.apiKey) {
          setRuntimeApiKey(data.apiKey);
        }
        setStreamUser({
          id: data.user.id,
          name: data.user.name,
          image: data.user.image,
          role: data.user.role === 'trainer' ? 'trainer' : 'client',
          token: data.token,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to connect to Stream';
        setConnectionError(message);
        throw err;
      } finally {
        setIsConnecting(false);
      }
    },
    [],
  );

  const logoutStreamUser = useCallback(() => {
    setStreamUser(null);
    setChatClient(null);
    setVideoClient(null);
    setConnectionError(null);
  }, []);

  const isClientBootstrapping = Boolean(streamUser && (!chatClient || !videoClient));

  return (
    <StreamContext.Provider
      value={{
        streamUser,
        chatClient,
        videoClient,
        isConnecting: isConnecting || isClientBootstrapping,
        connectionError,
        loginWithUser,
        logoutStreamUser,
      }}
    >
      {streamUser && runtimeApiKey ? (
        <ConnectedStreamClients
          key={streamUser.id}
          user={streamUser}
          apiKey={runtimeApiKey}
          onReadyChange={handleReadyChange}
        >
          {children}
        </ConnectedStreamClients>
      ) : (
        children
      )}
    </StreamContext.Provider>
  );
}

export function useStreamContext(): StreamContextValue {
  const ctx = useContext(StreamContext);
  if (!ctx) {
    throw new Error('useStreamContext must be used within a StreamProvider');
  }
  return ctx;
}


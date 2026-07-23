'use client';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS, PresenceUser, FormField } from '@shared/types';
import { useFormStore } from '@/store/useFormStore';

// Connects to the SAME origin/port the app is served from, since Socket.io
// is attached to the same HTTP server as Next.js and Express (see
// server/index.ts + server/socket.ts).
export function useSocket(formId: string, userName?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const { addField, updateField, removeField, reorderFields } = useFormStore();

  useEffect(() => {
    if (!formId || formId === 'undefined') return;

    const socket = io({ withCredentials: true });
    socketRef.current = socket;

    socket.emit(SOCKET_EVENTS.JOIN_FORM, { formId, name: userName });

    socket.on(SOCKET_EVENTS.PRESENCE_LIST, (list: PresenceUser[]) => setPresence(list));
    socket.on(SOCKET_EVENTS.USER_JOINED, (user: PresenceUser) =>
      setPresence((prev) => [...prev.filter((u) => u.socketId !== user.socketId), user]),
    );
    socket.on(SOCKET_EVENTS.USER_LEFT, (user: PresenceUser) =>
      setPresence((prev) => prev.filter((u) => u.socketId !== user.socketId)),
    );

    // Remote edits from other collaborators — apply to local store only
    // (don't re-emit, or we'd create an infinite echo loop).
    socket.on(SOCKET_EVENTS.FIELD_ADD, ({ field }: { field: FormField }) => addField(field));
    socket.on(SOCKET_EVENTS.FIELD_UPDATE, ({ fieldId, changes }: { fieldId: string; changes: Partial<FormField> }) =>
      updateField(fieldId, changes),
    );
    socket.on(SOCKET_EVENTS.FIELD_DELETE, ({ fieldId }: { fieldId: string }) => removeField(fieldId));
    socket.on(SOCKET_EVENTS.FIELD_REORDER, ({ orderedFieldIds }: { orderedFieldIds: string[] }) =>
      reorderFields(orderedFieldIds),
    );

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_FORM, { formId });
      socket.disconnect();
    };
  }, [formId, userName, addField, updateField, removeField, reorderFields]);

  return {
    presence,
    emitFieldAdd: (field: FormField) => socketRef.current?.emit(SOCKET_EVENTS.FIELD_ADD, { formId, field }),
    emitFieldUpdate: (fieldId: string, changes: Partial<FormField>) =>
      socketRef.current?.emit(SOCKET_EVENTS.FIELD_UPDATE, { formId, fieldId, changes }),
    emitFieldDelete: (fieldId: string) => socketRef.current?.emit(SOCKET_EVENTS.FIELD_DELETE, { formId, fieldId }),
    emitFieldReorder: (orderedFieldIds: string[]) =>
      socketRef.current?.emit(SOCKET_EVENTS.FIELD_REORDER, { formId, orderedFieldIds }),
  };
}

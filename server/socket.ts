import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { Form } from './db/models/Form';
import type { FormFieldSubdoc } from './db/models/Form';
import { SOCKET_EVENTS, PresenceUser, FormField } from '../shared/types';

// In-memory presence map: formId -> Map<socketId, PresenceUser>
// This is fine for a single server instance. If you scale to multiple
// server processes later, move this to Redis (socket.io-redis adapter)
// and share presence state across instances.
const presenceByForm = new Map<string, Map<string, PresenceUser>>();

function getIdentityFromSocket(socket: Socket): { userId: string; name: string } | null {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) return null;

  const parsed = cookie.parse(cookieHeader);
  const cookieName = process.env.COOKIE_NAME || 'fb_token';
  const token = parsed[cookieName];
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const decoded = jwt.verify(token, secret) as { sub: string };
    // name is fetched lazily on join; keep this lightweight here
    return { userId: decoded.sub, name: 'User' };
  } catch {
    return null;
  }
}

export function initSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    const identity = getIdentityFromSocket(socket);

    socket.on(SOCKET_EVENTS.JOIN_FORM, async ({ formId, name }: { formId: string; name?: string }) => {
      socket.join(formId);

      if (!presenceByForm.has(formId)) {
        presenceByForm.set(formId, new Map());
      }
      const room = presenceByForm.get(formId)!;

      const user: PresenceUser = {
        socketId: socket.id,
        userId: identity?.userId || `anon-${socket.id}`,
        name: name || identity?.name || 'Anonymous',
      };
      room.set(socket.id, user);

      // Tell everyone else someone joined, and send the joiner the full list
      socket.to(formId).emit(SOCKET_EVENTS.USER_JOINED, user);
      io.to(socket.id).emit(SOCKET_EVENTS.PRESENCE_LIST, Array.from(room.values()));
    });

    socket.on(SOCKET_EVENTS.LEAVE_FORM, ({ formId }: { formId: string }) => {
      leaveRoom(io, socket, formId);
    });

    // ---- Field editing events ----
    // Strategy: last-write-wins. Client emits the change, server persists
    // it to Mongo, then broadcasts to everyone else in the room. Clients
    // apply changes optimistically on their own end already, so the
    // broadcast is only sent to OTHER sockets in the room.

    socket.on(
      SOCKET_EVENTS.FIELD_ADD,
      async ({ formId, field }: { formId: string; field: FormField }) => {
        try {
          await Form.findByIdAndUpdate(formId, { $push: { fields: field } });
          socket.to(formId).emit(SOCKET_EVENTS.FIELD_ADD, { field });
        } catch (err) {
          console.error('[socket] field:add failed', err);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.FIELD_UPDATE,
      async ({ formId, fieldId, changes }: { formId: string; fieldId: string; changes: Partial<FormField> }) => {
        try {
          const form = await Form.findById(formId);
          if (!form) return;
          const field = form.fields.find((f: FormFieldSubdoc) => f.id === fieldId);
          if (!field) return;
          Object.assign(field, changes);
          await form.save();
          socket.to(formId).emit(SOCKET_EVENTS.FIELD_UPDATE, { fieldId, changes });
        } catch (err) {
          console.error('[socket] field:update failed', err);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.FIELD_REORDER,
      async ({ formId, orderedFieldIds }: { formId: string; orderedFieldIds: string[] }) => {
        try {
          const form = await Form.findById(formId);
          if (!form) return;
          const byId = new Map<string, FormFieldSubdoc>(
            form.fields.map((f: FormFieldSubdoc) => [f.id, f]),
          );
          orderedFieldIds.forEach((id, index) => {
            const f = byId.get(id);
            if (f) f.order = index;
          });
          form.fields.sort((a: FormFieldSubdoc, b: FormFieldSubdoc) => a.order - b.order);
          await form.save();
          socket.to(formId).emit(SOCKET_EVENTS.FIELD_REORDER, { orderedFieldIds });
        } catch (err) {
          console.error('[socket] field:reorder failed', err);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.FIELD_DELETE,
      async ({ formId, fieldId }: { formId: string; fieldId: string }) => {
        try {
          await Form.findByIdAndUpdate(formId, { $pull: { fields: { id: fieldId } } });
          socket.to(formId).emit(SOCKET_EVENTS.FIELD_DELETE, { fieldId });
        } catch (err) {
          console.error('[socket] field:delete failed', err);
        }
      },
    );

    socket.on('disconnecting', () => {
      for (const formId of socket.rooms) {
        leaveRoom(io, socket, formId);
      }
    });
  });

  return io;
}

function leaveRoom(io: SocketIOServer, socket: Socket, formId: string) {
  const room = presenceByForm.get(formId);
  if (!room) return;
  const user = room.get(socket.id);
  room.delete(socket.id);
  socket.leave(formId);
  if (user) {
    socket.to(formId).emit(SOCKET_EVENTS.USER_LEFT, user);
  }
  if (room.size === 0) {
    presenceByForm.delete(formId);
  }
}

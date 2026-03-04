let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
  return ioInstance;
};

export const getIO = () => ioInstance;

export const emitEvent = (eventName, payload) => {
  if (!ioInstance) return;
  ioInstance.emit(eventName, payload);
};

export const emitToRoom = (room, eventName, payload) => {
  if (!ioInstance) return;
  ioInstance.to(room).emit(eventName, payload);
};

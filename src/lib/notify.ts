import prisma from './prisma';

export async function notifyUser({
  userId,
  actorId,
  postId,
  type,
}: {
  userId: string;
  actorId: string;
  postId?: string;
  type: 'like' | 'comment' | 'boost';
}) {
  if (userId === actorId) return; // don’t notify self

  await prisma.notification.create({
    data: {
      userId,
      actorId,
      postId,
      type,
    },
  });
}

import type { Prisma } from '@prisma/client';

export type Player = Prisma.PlayerGetPayload<{
  include: {
    participant: {
      include: {
        member: true;
      };
    };
  };
}>;

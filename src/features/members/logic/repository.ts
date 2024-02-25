import { withResult } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

import type { Result } from '@/types/Result';
import type { Member, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createMember = (
  data: Prisma.MemberCreateInput,
): Promise<Result<Member>> => {
  return withResult(() => prisma.member.create({ data }))();
};

export const findAllMembers = async (
  where: Prisma.MemberWhereInput,
): Promise<Result<Member[]>> => {
  return withResult(() =>
    prisma.member.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
    }),
  )();
};

export const findMemberById = (
  id: Member['id'],
): Promise<Result<Member | null>> => {
  return withResult(() =>
    prisma.member.findUnique({
      where: { id },
    }),
  )();
};

export const updateMember = ({
  id,
  ...data
}: Pick<Member, 'id'> & Prisma.MemberUpdateInput): Promise<Result<Member>> => {
  return withResult(() =>
    prisma.member.update({
      where: { id },
      data,
    }),
  )();
};

export const deleteMemberById = (id: Member['id']): Promise<Result<Member>> => {
  return withResult(() =>
    prisma.member.delete({
      where: { id },
    }),
  )();
};

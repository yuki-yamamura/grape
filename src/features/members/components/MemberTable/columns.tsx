import Button from '@/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { levelMap, sexMap } from '@/constants';
import DecoratedMember from '@/features/members/components/DecoratedMember';
import { MoreHorizontal } from 'lucide-react';

import type { Member } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

export const createColumns = (
  deleteMember: (member: Member) => Promise<void>,
  openMemberDetail: (memberId: Member['id']) => Promise<void>,
): ColumnDef<Member>[] => {
  return [
    {
      accessorKey: 'name',
      header: '名前',
      cell: ({ row }) => <DecoratedMember member={row.original} />,
    },
    {
      accessorKey: 'sex',
      header: '性別',
      cell: ({ row }) => sexMap.get(row.original.sex),
    },
    {
      accessorKey: 'level',
      header: 'レベル',
      cell: ({ row }) => levelMap.get(row.original.level),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal
                  className="h-4 w-4"
                  aria-label="メニューを開く"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openMemberDetail(member.id)}>
                詳細を見る
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteMember(member)}
                className="text-destructive"
              >
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

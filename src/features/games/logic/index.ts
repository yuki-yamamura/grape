import { DOUBLES_PLAYER_COUNT, SINGLES_PLAYER_COUNT } from '@/constants';
import { shuffleArray } from '@/utils';
import { Rule } from '@prisma/client';

import type { GameCreateSchema } from '@/features/games/validation';
import type { Activity } from '@/types/models/Activity';
import type { Game } from '@/types/models/Game';
import type { Participant } from '@/types/models/Participant';
import type { Player } from '@/types/models/Player';
import type { Prisma } from '@prisma/client';

export const getAllPlayers = (game: Game): Player[] => {
  return game.gameDetails
    .map((gameDetail) => gameDetail)
    .flat()
    .map((gameDetail) => gameDetail.players)
    .flat();
};

/**
 * generate a new game depending on the conditions.
 */
export const generateGame = (
  conditions: GameCreateSchema & { activity: Activity },
): Prisma.GameCreateInput => {
  const { activity, memberIds, singlesCount, doublesCount } = conditions;

  const totalPlayers =
    singlesCount * SINGLES_PLAYER_COUNT + doublesCount * DOUBLES_PLAYER_COUNT;

  const candidates: Participant[] = memberIds
    .map(({ memberId }) =>
      activity.participants.find(
        (participant) => participant.memberId === memberId,
      ),
    )
    .filter((participant): participant is Participant => !!participant);
  // sort candidates by the number of games that his/her has played for equality.
  const sortedCandidates = calculateTotalGamesPerParticipant(
    candidates,
    activity,
  )
    .sort((a, b) => (a.totalGames > b.totalGames ? 1 : -1))
    .map(({ participant }) => participant);

  // pick players depending on how many the game needs players,
  //   and then shuffle them to make pairs random.
  const players = shuffleArray(sortedCandidates.slice(0, totalPlayers));
  const resters = sortedCandidates.slice(totalPlayers);

  const gameDetails = generateGameDetails(players, singlesCount, doublesCount);

  return {
    activity: {
      connect: {
        id: activity.id,
      },
    },
    gameDetails: {
      create: gameDetails,
    },
    resters: {
      create: resters.map((rester) => ({
        participant: {
          connect: {
            id: rester.id,
          },
        },
      })),
    },
  } satisfies Prisma.GameCreateInput;
};

/**
 * calculate how many times each participant has played the games in the activity.
 */
const calculateTotalGamesPerParticipant = (
  participants: Participant[],
  activity: Activity,
): {
  participant: Participant;
  totalGames: number;
}[] => {
  const allPlayers: Player[] = activity.games
    .map((game) => getAllPlayers(game))
    .flat();

  return participants.map((participant) => ({
    participant,
    totalGames: allPlayers.filter(
      (player) => player.participantId === participant.id,
    ).length,
  }));
};

/**
 * generate game details depending on the conditions.
 * make sure that the number of participants in the argument
 *   equals the sum of singles and doubles counts before calling this function.
 */
const generateGameDetails = (
  participants: Participant[],
  singlesCount: number,
  doublesCount: number,
): Prisma.GameDetailCreateWithoutGameInput[] => {
  const singlesGameDetails = Array.from(
    Array(singlesCount),
    (_, index) => index,
  ).map((index) => {
    const start = index * SINGLES_PLAYER_COUNT;
    const end = start + SINGLES_PLAYER_COUNT;

    return {
      courtNumber: index + 1,
      rule: Rule.SINGLES,
      players: {
        create: participants.slice(start, end).map((participant) => ({
          participant: {
            connect: {
              id: participant.id,
            },
          },
        })),
      },
    };
  }) satisfies Prisma.GameDetailCreateWithoutGameInput[];

  const totalSinglesPlayers = singlesCount * SINGLES_PLAYER_COUNT;
  const doublesGameDetails = Array.from(
    Array(doublesCount),
    (_, index) => index,
  ).map((index) => {
    const start = totalSinglesPlayers + index * DOUBLES_PLAYER_COUNT;
    const end = start + DOUBLES_PLAYER_COUNT;

    return {
      courtNumber: singlesCount + index + 1,
      rule: Rule.DOUBLES,
      players: {
        create: participants.slice(start, end).map((participant) => ({
          participant: {
            connect: {
              id: participant.id,
            },
          },
        })),
      },
    };
  }) satisfies Prisma.GameDetailCreateWithoutGameInput[];

  return [...singlesGameDetails, ...doublesGameDetails];
};

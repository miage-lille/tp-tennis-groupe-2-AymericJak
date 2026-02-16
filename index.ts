import { isSamePlayer, Player, stringToPlayer } from './types/player';
import {
  advantage,
  deuce,
  FortyData,
  game,
  fifteen,
  love,
  Point,
  PointsData,
  Score,
  thirty, forty, points,
} from './types/score';
import { pipe, Option } from 'effect';

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return stringToPlayer('PLAYER_TWO');
    case 'PLAYER_TWO':
      return stringToPlayer('PLAYER_ONE');
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE':
      return 'Love';
    case 'FIFTEEN':
      return '15';
    case 'THIRTY':
      return '30';
    default:
      throw new Error('Unknown point');
  }
};

export const stringToPoint = (str: string): Point => {
  switch (str) {
    case 'LOVE':
      return love();
    case 'FIFTEEN':
      return fifteen();
    case 'THIRTY':
      return thirty();
    default:
      throw new Error(`Invalid point string: ${str}`);
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS':
      return `${pointToString(score.pointsData.PLAYER_ONE)} - ${pointToString(
        score.pointsData.PLAYER_TWO
      )}`;
    case 'FORTY':
      return `${playerToString(
        score.fortyData.player
      )}: 40 - ${playerToString(otherPlayer(score.fortyData.player))}: ${pointToString(
        score.fortyData.otherPoint
      )}`;
    case 'DEUCE':
      return 'Deuce';
    case 'ADVANTAGE':
      return `Advantage ${playerToString(score.player)}`;
    case 'GAME':
      return `Game ${playerToString(score.player)}`;
    default:
      throw new Error('Unknown score');
  }
};

export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayed, winner)) return game(winner);
  return deuce();
};

export const incrementPoint = (point: Point): Option.Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return Option.some(fifteen());
    case 'FIFTEEN':
      return Option.some(thirty());
    case 'THIRTY':
      return Option.none();
  }
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    Option.match({
      onNone: () => deuce(),
      onSome: p => forty(currentForty.player, p) as Score,
    })
  );
};

// Exercice 2
// Tip: You can use pipe function from Effect to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  const winnerPoint = current[winner];
  const loser = otherPlayer(winner);
  const loserPoint = current[loser];

  switch (winnerPoint.kind) {
    case 'LOVE':
      return winner === 'PLAYER_ONE'
        ? points(fifteen(), current.PLAYER_TWO)
        : points(current.PLAYER_ONE, fifteen());
    case 'FIFTEEN':
      return winner === 'PLAYER_ONE'
        ? points(thirty(), current.PLAYER_TWO)
        : points(current.PLAYER_ONE, thirty());
    case 'THIRTY':
      return forty(winner, loserPoint);
  }
};

// Exercice 3
export const scoreWhenGame = (winner: Player): Score => {
  return game(winner);
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY':
      return scoreWhenForty(currentScore.fortyData, winner);
    case 'DEUCE':
      return scoreWhenDeuce(winner);
    case 'ADVANTAGE':
      return scoreWhenAdvantage(currentScore.player, winner);
    case 'GAME':
      return scoreWhenGame(currentScore.player);
  }
};

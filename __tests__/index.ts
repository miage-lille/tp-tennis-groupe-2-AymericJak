import { describe, expect, test } from '@jest/globals';
import {
  otherPlayer,
  playerToString,
  score,
  scoreWhenAdvantage,
  scoreWhenDeuce,
  scoreWhenForty,
  scoreWhenGame,
  scoreWhenPoint,
  stringToPoint,
} from '..';
import { stringToPlayer } from '../types/player';
import { advantage, deuce, forty, game, points, thirty } from '../types/score';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(w => {
      const score = scoreWhenDeuce(stringToPlayer(w));
      const scoreExpected = advantage(stringToPlayer(w));
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(advantaged => {
      const advantagedPlayer = stringToPlayer(advantaged);
      const winner = advantagedPlayer;
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = game(winner);
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(advantaged => {
      const advantagedPlayer = stringToPlayer(advantaged);
      const winner = otherPlayer(advantagedPlayer);
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = deuce();
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const fortyData = {
        player: stringToPlayer(winner),
        otherPoint: stringToPoint('THIRTY'),
      };
      const score = scoreWhenForty(fortyData, stringToPlayer(winner));
      const scoreExpected = game(stringToPlayer(winner));
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const fortyData = {
        player: otherPlayer(stringToPlayer(winner)),
        otherPoint: stringToPoint('THIRTY'),
      };
      const score = scoreWhenForty(fortyData, stringToPlayer(winner));
      const scoreExpected = deuce();
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const fortyData = {
        player: otherPlayer(stringToPlayer(winner)),
        otherPoint: stringToPoint('FIFTEEN'),
      };
      const score = scoreWhenForty(fortyData, stringToPlayer(winner));
      const scoreExpected = forty(fortyData.player, thirty());
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  // -------------------------TESTS POINTS-------------------------- //
  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const current = {
        PLAYER_ONE: stringToPoint('LOVE'),
        PLAYER_TWO: stringToPoint('FIFTEEN'),
      };
      const score = scoreWhenPoint(current, stringToPlayer(winner));
      const scoreExpected =
        winner === 'PLAYER_ONE'
          ? points(stringToPoint('FIFTEEN'), stringToPoint('FIFTEEN'))
          : points(stringToPoint('LOVE'), stringToPoint('THIRTY'));
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  test('Given one player at 30 and win, score is forty', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const winnerPlayer = stringToPlayer(winner);
      const current =
        winner === 'PLAYER_ONE'
          ? {
              PLAYER_ONE: stringToPoint('THIRTY'),
              PLAYER_TWO: stringToPoint('FIFTEEN'),
            }
          : {
              PLAYER_ONE: stringToPoint('FIFTEEN'),
              PLAYER_TWO: stringToPoint('THIRTY'),
            };
      const score = scoreWhenPoint(current, winnerPlayer);
      const scoreExpected = forty(winnerPlayer, stringToPoint('FIFTEEN'));
      expect(score).toStrictEqual(scoreExpected);
    });
  });

  // -------------------------TESTS EXERCICE 3-------------------------- //
  test('Given scoreWhenGame, score is Game for winner', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const winnerPlayer = stringToPlayer(winner);
      const scoreResult = scoreWhenGame(winnerPlayer);
      const scoreExpected = game(winnerPlayer);
      expect(scoreResult).toStrictEqual(scoreExpected);
    });
  });

  test('Given POINTS, score delegates to scoreWhenPoint', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const winnerPlayer = stringToPlayer(winner);
      const currentScore = points(
        stringToPoint('LOVE'),
        stringToPoint('FIFTEEN')
      );
      const scoreResult = score(currentScore, winnerPlayer);
      const scoreExpected = scoreWhenPoint(
        currentScore.pointsData,
        winnerPlayer
      );
      expect(scoreResult).toStrictEqual(scoreExpected);
    });
  });

  test('Given FORTY, score delegates to scoreWhenForty', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const winnerPlayer = stringToPlayer(winner);
      const currentScore = forty(
        otherPlayer(winnerPlayer),
        stringToPoint('FIFTEEN')
      );
      const scoreResult = score(currentScore, winnerPlayer);
      const scoreExpected = scoreWhenForty(
        currentScore.fortyData,
        winnerPlayer
      );
      expect(scoreResult).toStrictEqual(scoreExpected);
    });
  });

  test('Given DEUCE, score delegates to scoreWhenDeuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(winner => {
      const winnerPlayer = stringToPlayer(winner);
      const currentScore = deuce();
      const scoreResult = score(currentScore, winnerPlayer);
      const scoreExpected = scoreWhenDeuce(winnerPlayer);
      expect(scoreResult).toStrictEqual(scoreExpected);
    });
  });

  test('Given ADVANTAGE, score delegates to scoreWhenAdvantage', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(advantaged => {
      const advantagedPlayer = stringToPlayer(advantaged);
      const winnerPlayer = otherPlayer(advantagedPlayer);
      const currentScore = advantage(advantagedPlayer);
      const scoreResult = score(currentScore, winnerPlayer);
      const scoreExpected = scoreWhenAdvantage(advantagedPlayer, winnerPlayer);
      expect(scoreResult).toStrictEqual(scoreExpected);
    });
  });

  test('Given GAME, score remains unchanged regardless of point winner', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach(gameWinner => {
      const gameWinnerPlayer = stringToPlayer(gameWinner);
      const pointWinner = otherPlayer(gameWinnerPlayer);
      const currentScore = game(gameWinnerPlayer);
      const scoreResult = score(currentScore, pointWinner);
      const scoreExpected = game(gameWinnerPlayer);
      expect(scoreResult).toStrictEqual(scoreExpected);
    });
  });
});

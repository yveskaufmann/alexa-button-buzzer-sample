import {
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  SkillBuilders,
} from 'ask-sdk-core';

import {
  Response,
  SessionEndedRequest,
} from 'ask-sdk-model';

import * as winston from 'winston';
import { fail } from 'assert';

export const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = 'Zum Spielen müssen die teilnehmenden Spieler nun ihren Echo Button einmal drücken!';

    const { attributesManager, requestEnvelope } = handlerInput;
    const { request } = requestEnvelope;

    const session = attributesManager.getSessionAttributes();
    session.ORG_REQUEST = request.requestId;
    attributesManager.setSessionAttributes(session);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        type: 'GameEngine.StartInputHandler',
        timeout: 10000,
        proxies: ['p1', 'p2', 'p3', 'p4'],
        recognizers: {
          'roll_call_p1': {
            type: 'match',
            anchor: 'start',
            fuzzy: true,
            pattern: [{
              gadgetIds: ['p1'],
              action: 'down',
            }
            ]
          },
          'roll_call_p2': {
            type: 'match',
            anchor: 'start',
            fuzzy: true,
            pattern: [{
              gadgetIds: ['p2'],
              action: 'down',
            }
            ]
          },
          'roll_call_p3': {
            type: 'match',
            anchor: 'start',
            fuzzy: true,
            pattern: [{
              gadgetIds: ['p3'],
              action: 'down',
            }
            ]
          },
          'roll_call_p4': {
            type: 'match',
            anchor: 'start',
            fuzzy: true,
            pattern: [{
              gadgetIds: ['p4'],
              action: 'down',
            }
            ]
          }
        },
        events: {
          roll_call_p1: {
            shouldEndInputHandler: false,
            maximumInvocations: 1,
            reports: 'matches',
            meets: ['roll_call_p1']
          },
          roll_call_p2: {
            shouldEndInputHandler: false,
            maximumInvocations: 1,
            reports: 'matches',
            meets: ['roll_call_p2']
          },
          roll_call_p3: {
            shouldEndInputHandler: false,
            maximumInvocations: 1,
            reports: 'matches',
            meets: ['roll_call_p3']
          },
          roll_call_p4: {
            shouldEndInputHandler: false,
            maximumInvocations: 1,
            reports: 'matches',
            meets: ['roll_call_p4']
          },
          rollCallComplete: {
            shouldEndInputHandler: true,
            reports: 'history',
            meets: ['timed out']
          }
        }
      })
      .getResponse();
  },
};

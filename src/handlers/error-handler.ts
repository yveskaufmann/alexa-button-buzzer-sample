import {
  ErrorHandler,
  HandlerInput,
  ResponseBuilder,
  RequestHandler,
  SkillBuilders,
  ResponseFactory,
} from 'ask-sdk-core';

import {
  Response,
  SessionEndedRequest
} from 'ask-sdk-model';

import * as winston from 'winston';

export const ErrorRequestHandler: ErrorHandler = {
  canHandle(handlerInput: HandlerInput, error: Error): boolean {
    return true;
  },
  handle(handlerInput: HandlerInput, error: Error): Response {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};


import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';

import {
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  ResponseFactory,
  SkillBuilders,
} from 'ask-sdk-core';

import {
  Response,
  SessionEndedRequest
} from 'ask-sdk-model';

import * as requestHandlers from './handlers';
import { ErrorRequestHandler } from './handlers/error-handler'

winston.configure({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'skill' }),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => `${info.timestamp} [${info.label}] [${info.level}] ${info.message}`)
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const skill = SkillBuilders.custom()
  .addRequestHandlers(...Object.values(requestHandlers))
  .addErrorHandlers(ErrorRequestHandler)
  .create();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', (req, res) => {
  winston.info(`Received alexa request: \n${JSON.stringify(req.body, null, 2)}`);
  skill.invoke(req.body).then((responseEnvelope) => {
    winston.info(`Generated alexa response: \n${JSON.stringify(responseEnvelope, null, 2)}`);
    res.status(200).send(responseEnvelope)
  }).catch((err) => {
    winston.error(`$(err)`);
    res.status(500).send({
      error: 'Invalid alexa request',
      message: err
    });
  })
});
app.listen(8080, () => {
  winston.info(`Skill started`);
})

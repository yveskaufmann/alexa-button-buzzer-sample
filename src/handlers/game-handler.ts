import {
  HandlerInput,
  RequestHandler,
} from 'ask-sdk-core';

import {
  Response,
  SessionEndedRequest,
  Request,
  interfaces
} from 'ask-sdk-model';

interface Player {
  name: string;
  color: string;
  gadgetId: string;
}

let INIT_PLAYERS: Player[] = [
  {
    name: 'rot',
    color: 'FF0000',
    gadgetId: ''
  },
  {
    name: 'grün',
    color: '00FF00',
    gadgetId: ''
  },
  {
    name: 'blau',
    color: '0000FF',
    gadgetId: ''
  },
  {
    name: 'gelb',
    color: 'FFFF00',
    gadgetId: ''
  }
];

export const GameRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    let session = handlerInput.attributesManager.getSessionAttributes();
    return handlerInput.requestEnvelope.request.type === 'GameEngine.InputHandlerEvent' &&
      session.ORG_REQUEST === handlerInput.requestEnvelope.request['originatingRequestId']
  },
  handle(handlerInput: HandlerInput): Response {

    const { requestEnvelope, attributesManager } = handlerInput;
    const request = requestEnvelope.request as interfaces.gameEngine.InputHandlerEventRequest;
    const session = attributesManager.getSessionAttributes();
    let players: Player[] = session.players || INIT_PLAYERS;


    for (let event of (request.events || [])) {

      let currentPlayer: Player = null;
      if (event.inputEvents != null && event.inputEvents.length > 0) {
        currentPlayer = players.find((p) => p.gadgetId === event.inputEvents[0].gadgetId)
      }

      if (event.name === 'buzzerHit') {
        return handlerInput.responseBuilder.speak(
          `<audio src='https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_01.mp3'/>` +
          `Herzlichen Glückwunsch Spieler ${currentPlayer.name} du hast gewonnen !`)
          .withShouldEndSession(true)
          .getResponse();
      }

      if (event.name === 'buzzerNotHit') {
        return handlerInput.responseBuilder
          .speak(`<audio src='https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_negative_response_01.mp3'/> Leider Unendschieden !`)
          .withShouldEndSession(true)
          .getResponse();
      }


      if (event.name === 'rollCallComplete') {

        if (event.inputEvents == null || event.inputEvents.length == 0) {
          return handlerInput.responseBuilder
            .speak('Leider keine Spieler erkannt!')
            .withShouldEndSession(true)
            .getResponse();
        }



        const playerCount = event.inputEvents.reduce((pCount, inputEvent) => {
          if (inputEvent.action !== 'down') {
            return pCount;
          }
          return pCount + 1;
        }, 0)

        const response = handlerInput.responseBuilder
          .speak(`Ok, wir haben ${playerCount} Mitspieler die <break time="1s"/> "Wer drückt zu erst Spielen"!` + `Auf gehts !`)
          .addDirective({
            type: 'GameEngine.StartInputHandler',
            timeout: 10000,
            recognizers: {
              buzzerHit: {
                type: 'match',
                pattern: [
                  {
                    action: 'down',
                  }
                ]
              }
            },
            events: {
              buzzerHit: {
                meets: ['buzzerHit'],
                reports: 'history',
                maximumInvocations: 1,
                shouldEndInputHandler: true,
              },
              buzzerNotHit: {
                meets: ['timed out'],
                reports: 'history',
                shouldEndInputHandler: true
              }
            }

          })
          .withShouldEndSession(false)
          .getResponse();

        session.ORG_REQUEST = request.requestId;
        session.players = players;
        attributesManager.setSessionAttributes(session);
        return response;


      }

      if ((event.name || '').startsWith('roll_call_p')) {
        const playerIndex = parseInt((event.name || '').slice(-1))
        const player = players[playerIndex - 1];
        player.gadgetId = (event.inputEvents || [])[0].gadgetId || '';
        session.players = players;
        attributesManager.setSessionAttributes(session);


        return handlerInput.responseBuilder
          .speak(`Willkommen Spieler ${player.name}`)
          .addDirective({
            type: 'GadgetController.SetLight',
            version: 1,
            targetGadgets: [player.gadgetId],
            parameters: {
              triggerEvent: 'none',
              triggerEventTimeMs: 0,
              animations: [{
                targetLights: ['1'],
                repeat: 10,
                sequence: [
                  {
                    blend: true,
                    color: '0x000000',
                    durationMs: 100
                  },
                  {
                    blend: true,
                    color: player.color,
                    durationMs: 100
                  }
                ]
              }]
            }
          }).getResponse()
      }
    }

    return handlerInput.responseBuilder
      .speak('Nicht alle Spieler haben ihren Echo Button gedrückt!')
      .getResponse();
  }
};

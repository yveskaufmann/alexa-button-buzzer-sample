import { GameEngine } from './game-engine';

let directive = new GameEngine.StartInputHandlerDirectiveBuilder()
  .timeout(1000)
  .addProxy('player1')
  .addProxy('player2')
  .addPatternRecognizer('player1_hit_button')
    .addPattern()
      .matchAction(GameEngine.PatternAction.UP)
      .matchGadgets('player1')
      .createPattern()
    .createRecognizer()
  .addPatternRecognizer('player2_hit_button')
    .addPattern()
      .matchAction(GameEngine.PatternAction.UP)
      .matchGadgets('player1')
      .createPattern()
    .createRecognizer()
  .createInputHandler();


console.info(JSON.stringify(directive, null, 2));

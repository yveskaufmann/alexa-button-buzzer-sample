
export namespace GameEngine {

  export enum PatternAnchor {
    START_ANCHOR = 'start',
    END_ANCHOR = 'start',
    ANYWHERE_ANCHOR = 'anywhere'
  }

  export enum PatternAction {
    DOWN = 'down',
    UP = 'up',
    SILENCE = 'silence'
  }

  export interface Pattern {
    gadgetIds?: string[];
    colors?: string[];
    action?: PatternAction
  }

  export namespace Recognizer {

    export type Recognizer = PatternRecognizer | DeviationRecognizer | ProgressRecognizer;
    export type RecognizerMap = { [recognizerName: string]: Recognizer };

    export interface PatternRecognizer {
      type: 'match';
      anchor?: PatternAnchor;
      fuzzy: boolean;
      gadgetIds?: string[];
      actions?: PatternAction[];
      pattern: Pattern[];
    }

    export interface DeviationRecognizer {
      type: 'deviation';
      recognizer: string;
    }

    export interface ProgressRecognizer {
      type: 'progress';
      recognizer: string;
      completion: number;
    }

    export interface TimeoutRecognizer {
      type: 'timeout';
    }
  }

}

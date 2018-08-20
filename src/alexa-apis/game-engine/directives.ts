export namespace Directives {


  export type InputEventHandlerMap = { [eventName: string]: InputHandlerEvent };

  export interface StartInputHandlerDirective {
    type: 'GameEngine.StartInputHandler';

    /**
     * The maximum runtime for this input handler, in milliseconds.
     *
     * Minimum value: 0. Maximum value: 90,000 ms (90 seconds).
     */
    timeout: number;
    proxies?: any[];
    recognizers: RecognizerMap;
    events: InputEventHandlerMap;
  }

  export interface StopInputHandlerDirective {
    type: 'GameEngine.StopInputHandler';
    originatingRequestId: string;
  }
}

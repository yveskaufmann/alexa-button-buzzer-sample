
export namespace GameEngine {

  export namespace Requests {

    export enum InputHandlerEventReport {
      HISTORY = 'history',
      MATCHES = 'matches',
      NOTHING = 'nothing'
    }

    interface InputHandlerEvent {
      meets: string[];
      fails?: string[];
      reports?: InputHandlerEventReport;
      shouldEndInputHandler: boolean;
      maximumInvocations?: number;
      triggerTimeMilliseconds?: number;
    }

    interface InputEvent {
      gadgetId: string;
      timestamp: string;
      action: PatternAction;
      color: string;
      feature: string;
    }


    export interface InputEventHandlerRequest {
      type: 'GameEngine.InputHandlerEvent';
      requestId: string;
      timestamp: string;
      locale: string;
      originatingRequestId: string;
      events: Array<{
        name: string;
        inputEvents: InputEvent[];
      }>;
    }

    export interface SystemExceptionEncountered {
      type: 'System.ExceptionEncountered';
      requestId: string;
      timestamp: string;
      locale: string;
      errror: {
        type: string;
        message: string;
      },
      cause: {
        requesterId: string;
      }
    }
  }
}

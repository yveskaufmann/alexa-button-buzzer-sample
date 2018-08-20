export namespace GadgetController {

  export namespace Directives {
    export interface SetLightDirective {
      type: 'GadgetController.SetLight';
      version: number;
      targetGadgets: string[];
      parameters: {
        triggerEvent: 'buttonDown' | 'buttonUp' | 'none';
        triggerEventTimeMs: number;
        animations: SetLightAnimation[]
      };
    }
  }

  export interface SetLightAnimationSequence {
    durationMs: number;
    blend: boolean;
    color: string;
  }

  export interface SetLightAnimation {
    repeat: number;
    targetLights: string[];
    sequence: SetLightAnimationSequence[];

  }
}


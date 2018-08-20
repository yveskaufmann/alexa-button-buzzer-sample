export class StartInputHandlerDirectiveBuilder {

  private _timeout: number;
  private _proxies?: any[];
  private _recognizers: Directives.RecognizerMap;
  private _events: Directives.InputEventHandlerMap;

  constructor() {
    this._timeout = 5000;
    this._recognizers = {};
    this._events = {};
  }

  timeout(timeout: number): this {
    if (timeout < 0) throw new Error(`Illegal Argmument: timeout must be greater or equal then 0 milliseconds`);
    if (timeout > 90000) throw new Error(`Illegal Argmument: timeout must be less than or equal 90000 milliseconds`);
    this._timeout = timeout;
    return this;
  }

  addProxy(proxyName: string): this {
    if (this._proxies == null) {
      this._proxies = [];
    }

    if (!this._proxies.includes(proxyName)) {
      this._proxies.push(proxyName);
    }

    return this;
  }

  addDeviationRecognizer(name: string, devationRecognizer: string): this {
    if (this._recognizers[devationRecognizer] == null) {
      throw new Error(`Illegal Argument Error: This deviation recognizer "${name}" could not be added because the referenced ${devationRecognizer} recognizer don't exists.`);
    }

    this._addRecognizer(name, {
      type: 'deviation',
      recognizer: devationRecognizer
    } as DeviationRecognizer);

    return this;
  }

  addProgressRecognizer(name: string, progressRecognizer: string, completion: number): this {
    if (this._recognizers[progressRecognizer] == null) {
      throw new Error(`Illegal Argument Error: This progress recognizer "${name}" could not be added because the referenced ${progressRecognizer} recognizer don't exists.`);
    }

    if (completion < 0) completion = 0;
    if (completion > 100) completion = 100;
    if (completion < 1) completion = Math.round(completion / 100);

    this._addRecognizer(name, {
      type: 'progress',
      recognizer: progressRecognizer,
      completion: completion
    } as ProgressRecognizer);

    return this;
  }

  addPatternRecognizer(name: string): PatternRecognizerBuilder {

    const recognizerBuilder = (pattern: Partial<PatternRecognizer>) => {
      this._addRecognizer(name, {
        type: 'match',
        fuzzy: false,
        ...pattern
      } as PatternRecognizer);
    }

    return new PatternRecognizerBuilder(this, recognizerBuilder);
  }

  createInputHandler(): Directives.StartInputHandlerDirective {
    let ihd = {
      type: 'GameEngine.StartInputHandler',
      timeout: this._timeout,
      recognizers: this._recognizers,
      events: this._events
    } as Directives.StartInputHandlerDirective;

    if (this._events) {
      ihd.proxies = this._proxies;
    }

    return ihd;
  }

  private _addRecognizer<T extends Directives.Recognizer>(name: string, recognizer: T) {
    if (this._recognizers[name] != null) {
      throw new Error(`Could not add the recognizer ${name} because the recognizer exists already.`);
    }
    this._recognizers[name] = recognizer;
  }
}

class PatternRecognizerBuilder {

  private recognizer: Partial<PatternRecognizer> = {};

  constructor(
    private inputHandlerBuilder: StartInputHandlerDirectiveBuilder,
    private recognizerBuilder: (pattern: Partial<PatternRecognizer>) => void
  ) { }

  anchor(anchor: PatternAnchor): this {
    this.recognizer.anchor = anchor;
    return this;
  }

  makeFuzzy(enableFuzzy: boolean = true): this {
    this.recognizer.fuzzy = true;
    return this;
  }

  considerGadget(gadgetId: string): this {
    if (this.recognizer.gadgetIds == null) {
      this.recognizer.gadgetIds = [];
    }

    if (!this.recognizer.gadgetIds.includes(gadgetId)) {
      this.recognizer.gadgetIds.push(gadgetId);
    }

    return this;
  }

  considerAction(action: PatternAction): this {
    this.recognizer.actions = [
      ...(this.recognizer.actions || []).filter((currAction => currAction !== action)),
      action
    ];
    return this;
  }

  addPattern(): PatternBuilder {
    return new PatternBuilder(this, (pattern) => {
      this.recognizer.pattern = [
        ...(this.recognizer.pattern || []),
        pattern
      ];
    });
  }
  createRecognizer(): StartInputHandlerDirectiveBuilder {
    this.recognizerBuilder(this.recognizer);
    return this.inputHandlerBuilder;
  }
}

class PatternBuilder {
  private pattern: Partial<Pattern> = {};

  constructor(
    private recognizerBuilder: PatternRecognizerBuilder,
    private patternBuilder: (pattern: Partial<Pattern>) => void
  ) { }

  matchGadgets(gadgetId: string): this {
    this.pattern.gadgetIds = [
      ...(this.pattern.gadgetIds || []).filter((g) => g !== gadgetId)
    ]
    return this;
  }

  matchColors(color: string): this {
    this.pattern.colors = [
      ...(this.pattern.colors || []).filter((c) => c !== color)
    ]
    return this;
  }

  matchAction(action: PatternAction): this {
    this.pattern.action = action;
    return this;
  }

  public createPattern(): PatternRecognizerBuilder {
    this.patternBuilder(this.pattern);
    return this.recognizerBuilder;
  }
}

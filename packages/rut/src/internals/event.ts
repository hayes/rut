/* eslint-disable complexity, max-classes-per-file */

export class BaseEvent {
  bubbles: boolean = true;

  cancelable: boolean = true;

  currentTarget: unknown = {};

  defaultPrevented: boolean = false;

  eventPhase: number = 0;

  isTrusted: boolean = true;

  propagationStopped: boolean = false;

  srcElement: null = null;

  target: unknown = {};

  timeStamp: number;

  type: string;

  constructor(type: string) {
    this.timeStamp = Date.now();
    this.type = type;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  stopImmediatePropagation(): void {
    this.propagationStopped = true;
  }

  stopPropagation(): void {
    this.propagationStopped = true;
  }
}

export class SyntheticEvent extends BaseEvent {
  nativeEvent: Event;

  persisted: boolean = false;

  constructor(type: string, nativeEvent: Event) {
    super(type);

    this.nativeEvent = nativeEvent;

    // Copy over non-function properties
    Object.entries(nativeEvent).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        Object.defineProperty(this, key, {
          enumerable: true,
          value,
        });
      }
    });
  }

  isDefaultPrevented(): boolean {
    return this.defaultPrevented;
  }

  isPersistent(): boolean {
    return this.persisted;
  }

  isPropagationStopped(): boolean {
    return this.propagationStopped;
  }

  persist(): void {
    this.persisted = true;
  }

  preventDefault(): void {
    this.nativeEvent.preventDefault();
    this.defaultPrevented = true;
  }

  stopPropagation(): void {
    this.nativeEvent.stopPropagation();
    this.propagationStopped = true;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/Events
// istanbul ignore next
export function createHostEvent(type: string): Event {
  switch (type) {
    case 'animationcancel':
    case 'animationiteration':
    case 'animationend':
    case 'animationstart':
      return new AnimationEvent(type);
    case 'beforeunload':
      return new BeforeUnloadEvent();
    case 'auxclick':
    case 'click':
    case 'contextmenu':
    case 'dblclick':
    case 'mousedown':
    case 'mouseenter':
    case 'mouseleave':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'mouseup':
      return new MouseEvent(type);
    case 'devicelight':
    case 'devicemotion':
    case 'deviceorientation':
    case 'deviceorientationabsolute':
      return new DeviceLightEvent(type);
    case 'blur':
    case 'focus':
      return new FocusEvent(type);
    case 'copy':
    case 'cut':
    case 'paste':
      return new ClipboardEvent(type);
    case 'compositionend':
    case 'compositionstart':
    case 'compositionupdate':
      return new CompositionEvent(type);
    case 'drag':
    case 'dragend':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'dragstart':
    case 'drop':
      return new DragEvent(type);
    case 'error':
      return new ErrorEvent(type);
    case 'hashchange':
      return new HashChangeEvent(type);
    case 'keydown':
    case 'keypress':
    case 'keyup':
      return new KeyboardEvent(type);
    case 'loadend':
    case 'progress':
    case 'readystatechange':
      return new ProgressEvent(type);
    case 'message':
    case 'messageerror':
      return new MessageEvent(type);
    case 'pagehide':
    case 'pageshow':
      return new PageTransitionEvent();
    case 'gotpointercapture':
    case 'lostpointercapture':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerenter':
    case 'pointerleave':
    case 'pointerover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerup':
      return new PointerEvent(type);
    case 'popstate':
      return new PopStateEvent(type);
    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
      return new TouchEvent(type);
    case 'transitioncancel':
    case 'transitionend':
    case 'transitionrun':
    case 'transitionstart':
      return new TransitionEvent(type);
    case 'abort':
    case 'scroll':
    case 'resize':
      return new UIEvent(type);
    case 'securitypolicyviolation':
      return new SecurityPolicyViolationEvent(type);
    case 'storage':
      return new StorageEvent(type);
    case 'unhandledrejection':
      return new PromiseRejectionEvent(type, { promise: Promise.resolve() });
    case 'wheel':
      return new WheelEvent(type);
    default:
      return new Event(type);
  }
}

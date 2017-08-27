import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {GeneralEvent} from "../model/general-event";

/**
 * Used to facilitate component interaction via Observables. This is needed
 * (at least) to accommodate situations where components might be routed
 * to (e.g. Home) and thus can not emit an event for a parent (App) to
 * handle, but that the parent still needs to be able to handle events for.
 *
 * For example, the "cancel select mode" button appears in the header
 * of the app on the App component's level, but it is the "press" event
 * triggered by a category at the Home component level that dictates when
 * that button should appear.
 */
@Injectable()
export class GeneralEventService {

  private subject: Subject<any> = new Subject();
  private observable: Observable<any> = this.subject.asObservable();

  constructor() { }

  public getObservable() : Observable<any> {
    return this.observable;
  }

  public broadcastEvent(type: string, body: any) : void {
    this.subject.next(new GeneralEvent(type, body));
  }

}

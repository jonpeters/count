import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  public calculateSMA(period: number, data: Array<any>, keyProp: string, valueProp: string) : Array<any> {
    var sma: Array<any> = new Array();
    let total = 0;
    for (let i=0; i<period; i++) total += data[i][valueProp];
    for (let i=period-1; i<data.length; i++) {
      let item = {};
      item[keyProp] = data[i][keyProp];
      item[valueProp] = total / period;
      sma.push(item);
      total -= data[i-(period-1)][valueProp];
      if (i+1 < data.length) {
        total += data[i + 1][valueProp];
      }
    }
    return sma;
  }

}

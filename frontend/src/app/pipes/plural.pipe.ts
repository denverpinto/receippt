import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {

  transform(singularText: string,number: number, pluralText?: string): string {
    let pluralWord = pluralText ? pluralText : `${singularText}s`;
              return number == 1 ? singularText : pluralWord;
   }

}

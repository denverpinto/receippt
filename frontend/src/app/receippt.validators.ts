import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function checkUnused(usedValues: Array<String>) {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value: string = control.value;
        if (usedValues.map(value=>value.toUpperCase().trim()).includes(value.toUpperCase().trim())) {
            return { 'used': true }
        }
        else
            return null;
    };
}


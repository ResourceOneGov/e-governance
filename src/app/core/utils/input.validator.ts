import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class InputValidator {
    static cannotStartWithSpace(control: AbstractControl) : ValidationErrors | null {
        if(control && control.value && control.value[0] === ' '){
            return {cannotStartWithSpace: true}
        } 
        return null;
    }
}
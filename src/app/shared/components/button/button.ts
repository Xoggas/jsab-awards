import {Component, HostBinding, input} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  icon = input<string>();
  text = input.required<string>();
  isTight = input<boolean>();
  showSpinner = input<boolean>();
  isDisabled = input<boolean>();

  @HostBinding('attr.disabled')
  get disabledAttr() {
    return this.isDisabled() ? '' : null;
  }
}

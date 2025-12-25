import {Component, effect, inject, input} from '@angular/core';
import {RankedEntryDto} from '../../models/ranked-entry.dto';
import {NgOptimizedImage} from '@angular/common';
import {DomSanitizer, SafeHtml, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-result-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
  host: {class: 'glass-card'}
})
export class ResultComponent {
  entry = input.required<RankedEntryDto>();
  sanitizer = inject(DomSanitizer);

  safeUrl: SafeResourceUrl | undefined = undefined;
  safeName: SafeHtml | undefined = undefined;

  constructor() {
    effect(() => {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.entry().link);
      this.safeName = this.sanitizer.bypassSecurityTrustHtml(this.entry().name);
    });
  }
}

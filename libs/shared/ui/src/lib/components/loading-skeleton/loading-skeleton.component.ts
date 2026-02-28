import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'retail-loading-skeleton',
  standalone: true,
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeletonComponent {
  count = input(3);
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueDateChecker',
  standalone: true
})
export class DueDateCheckerPipe implements PipeTransform {

  transform(dateStr: string): string {
    if (!dateStr) return 'inherit';

    const inputDate = new Date(dateStr);
    const today = new Date();

    const isToday =
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate();

    return isToday ? 'red' : 'inherit';
  }
}

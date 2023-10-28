import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { NgxSignalStorageService } from 'ngx-signal-storage';

type Todo = { title: string; desc: string; timestamp: Date };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private storage = inject(
    NgxSignalStorageService<{
      todos: Todo[];
    }>
  );

  tasks = this.storage.watch('todos');

  constructor() {
    effect(() => {
      const change = this.storage.has('todos');
      console.log(change());
    });
  }

  setTask(newTodo: Omit<Todo, 'timestamp'>) {
    const todo = { ...newTodo, timestamp: new Date() };
    this.storage.set('todos', [...(this.tasks() ?? []), todo]);
  }

  clearAllTodo() {
    this.storage.clear();
  }

  removeTodos() {
    this.storage.remove('todos');
  }
}

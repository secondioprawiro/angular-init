import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../utils/interface';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {

  todos: TodoItem[] = []

  newTodoText: string = ''

  addTodo() {
    if(this.newTodoText.trim()){
      const newTodo: TodoItem = {
        id: Date.now(),
        task: this.newTodoText,
        isCompleted: false
      }
      this.todos.push(newTodo)
      this.newTodoText = ""
      this.saveToLocalStorage()
    }
  }

  toggleTodo(todo: TodoItem){
    todo.isCompleted = !todo.isCompleted;
    this.saveToLocalStorage();
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveToLocalStorage();
  }
  
  private saveToLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('my_todos', JSON.stringify(this.todos));
    }
  }

  private loadFromLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('my_todos');
      if (saved) {
        this.todos = JSON.parse(saved);
      }
    }
  }

  constructor() {
    console.log('todo constructor');
    this.loadFromLocalStorage();
  }

}

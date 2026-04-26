import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'CV',
        loadChildren: () => import('./components/cv/cv.module').then(m => m.CvModule)
    },
    {
        path: 'todo',
        loadComponent: () => import('./components/todo/todo.component').then(m => m.TodoComponent)
    },
    {
        path: '',
        loadComponent: () => import('./components/cv/cv.component').then(m => m.CvComponent)
    }
];

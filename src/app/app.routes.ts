import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuardsGuard } from './guards/auth-guards.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
    },
    { path: 'login',    redirectTo: 'auth/login',    pathMatch: 'full' },
    { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

    { 
        path: '', 
        canActivate: [authGuardsGuard], 
        component: LayoutComponent, 
        children: [
            {
                path: '',
                loadComponent: () => import('./components/cv/cv.component').then(m => m.CvComponent)
            },
            {
                path: 'cv',
                loadChildren: () => import('./components/cv/cv.module').then(m => m.CvModule)
            },
            {
                path: 'todo',
                loadComponent: () => import('./components/todo/todo.component').then(m => m.TodoComponent)
            },
            {
                path: 'pokemon',
                loadChildren: () => import('./components/pokemon/pokemon.module').then(m => m.PokemonModule)
            }
        ] 
    },
    
    // Catch-all route untuk 404 / halaman tidak ditemukan
    { path: '**', redirectTo: '' }
];


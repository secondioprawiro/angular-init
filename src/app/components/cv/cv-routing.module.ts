import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CvComponent } from './cv.component';

export const routes: Routes = [
    {
        path: '',
        component: CvComponent
    },
    {
        path: 'cv',
        redirectTo: ''
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CvRoutingModule { }
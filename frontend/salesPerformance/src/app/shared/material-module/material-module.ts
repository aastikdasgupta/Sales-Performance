import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';      // Optional but recommended
import { MatNativeDateModule } from '@angular/material/core';             // Optional but recommended

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,         // <-- Added here
    MatDatepickerModule,      // <-- Optional
    MatNativeDateModule,      // <-- Optional
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,         // <-- Added here
    MatDatepickerModule,      // <-- Optional
    MatNativeDateModule,      // <-- Optional
  ],
})
export class MaterialModule {}

// src/app/app.component.ts

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar el locale español
registerLocaleData(localeEs, 'es');

import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

//Implementar la interfaz
import { Empleado } from './Interfaces/empleado';
import { EmpleadoService } from './Services/empleado.service';
import { MatIconModule } from '@angular/material/icon';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DialogAddEdit } from './Dialogs/dialog-add-edit/dialog-add-edit';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [EmpleadoService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  //templateUrl: '.Dialogs/dialog-add-edit/dialog-add-edit.html',
  //styleUrls: ['.Dialogs/dialog-add-edit/dialog-add-edit.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['IdEmpleado','NombreCompleto', 'Departamento', 'Sueldo', 'FechaContrato','Acciones'];
  dataSource = new MatTableDataSource<Empleado>();

  constructor(
    private _empleadoServicio: EmpleadoService,
    public dialog: MatDialog
    //readonly dialog = inject(MatDialog)
  ){

  }

  ngOnInit(): void {
    this.mostrarEmpleados();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarEmpleados(){
    this._empleadoServicio.getList().subscribe({
      next:(dataResponse)=>{
        console.log(dataResponse)
        this.dataSource.data = dataResponse;
      },error:(e) =>{}
    })
  }

  /* openDialog() {
    this.dialog.open(DialogAddEdit);
  } */
  dialogoNuevoEmpleado() {
    this.dialog.open(DialogAddEdit,{
      disableClose:true,
      width:"450px"
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "creado"){
        this.mostrarEmpleados();
      }
    })
  }

  dialogoEditarEmpleado(dataEmpleado: Empleado) {
    this.dialog.open(DialogAddEdit,{
      disableClose:true,
      width:"450px",
      data:dataEmpleado
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "editado"){
        this.mostrarEmpleados();
      }
    })
  }

}

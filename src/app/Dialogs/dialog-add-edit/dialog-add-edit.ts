import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import {ReactiveFormsModule,FormBuilder,FormGroup,Validators} from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';

import { MatSnackBarModule,MatSnackBar} from '@angular/material/snack-bar';

import { MAT_DATE_FORMATS} from '@angular/material/core';
//import * as moment from 'moment';
import moment from 'moment';

import { Departamento} from '../../Interfaces/departamento';
import { Empleado } from '../../Interfaces/empleado';
import { DepartamentoService } from '../../Services/departamento.service';
import { EmpleadoService } from '../../Services/empleado.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter'; // porque estás usando moment.js

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

/* configurar el formato de las fechas */
export const MY_DATE_FORMATS = {
  parse:{
    dateInput: 'DD/MM/YYYY',
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-dialog-add-edit',
  // si quieres usar imports acá, añade standalone: true y todos los módulos necesarios
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatGridListModule, MatButtonModule, MatSnackBarModule, MatDatepickerModule, MatMomentDateModule], // etc
  templateUrl: './dialog-add-edit.html',
  styleUrls: ['./dialog-add-edit.css'],
  providers:[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class DialogAddEdit {

  formEmpleado: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion:string = "Guardar";
  listaDepartamentos: Departamento[]=[];


  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEdit>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _departamentoServicio: DepartamentoService,
    private _empleadoServicio: EmpleadoService 

  ){
    this.formEmpleado = this.fb.group({
      nombreCompleto: ['',Validators.required],
      idDepartamento: ['',Validators.required],
      sueldo: ['',Validators.required],
      fechaContrato: ['',Validators.required]
    })

    this._departamentoServicio.getList().subscribe({
      next:(data)=>{
        console.log('Departamentos:', data);
        this.listaDepartamentos = data;
      },error:(e)=>{
        console.error('ERROR AL CARGAR DPARTAMENTOS', e);
      }
    });
  }

mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration: 3000
    });
  }

  addEditEmpleado(){
    //console.log(this.formEmpleado)
    console.log(this.formEmpleado.value)

    const modelo : Empleado ={
      idEmpleado : 0,
      nombreCompleto : this.formEmpleado.value.nombreCompleto,
      idDepartamento : this.formEmpleado.value.idDepartamento,
      sueldo:this.formEmpleado.value.sueldo,
      //fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("DD/MM/YYYY")
      fechaContrato: moment(this.formEmpleado.value.fechaContrato).toISOString()
      //fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("YYYY-MM-DD")
    }

    //para mostrar la fecha con formato DD-MM-YYYY
    const fechaISO = modelo.fechaContrato;
    const fechaFormateada = moment(fechaISO).format('DD-MM-YYYY');
    console.log(fechaFormateada);


    this._empleadoServicio.add(modelo).subscribe({
      next:(data)=>{
        this.mostrarAlerta("Empleado fue creado","Listo");
        this.dialogoReferencia.close("creado");
      },error:(e)=>{
        this.mostrarAlerta("No se pudo crear","Error");
      }
    })

  }

}

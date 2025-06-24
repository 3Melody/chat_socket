import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FriendDialogService } from './friendDialog.service';

@Component({
   standalone: true,
  selector: 'app-my-dialog',
    imports: [NgFor,CommonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule],
  templateUrl: './my-dialog.component.html',
  styleUrl: './my-dialog.component.scss'
})
export class MyDialogComponent implements OnInit  {

      readonly data = inject(MAT_DIALOG_DATA);


  searchForm: FormGroup
  dataFriend: any
  type :any
  listFriend : any


  constructor( public dialogRef: MatDialogRef<MyDialogComponent>,
    public _FormBuilder: FormBuilder,
    private _serivce : FriendDialogService
    ) {

      this.searchForm = this._FormBuilder.group({ username: '' });
     }

     ngOnInit(): void {
       console.log("🚀 ~ MyDialogComponent ~ ngOnInit ~ this.data:", this.data)
      this.type = this.data.type
      this._serivce.listFriend.subscribe((res: any) => {
        this.listFriend = res
      })

      this._serivce.pedding().subscribe((res: any) => {
        this.listFriend = res
      })


     }

     searchFriend(): void{
      this._serivce.searchFriend(this.searchForm.get('username')?.value).subscribe((res: any) => {
        this.dataFriend = res
        console.log("🚀 ~ MyDialogComponent ~ this._serivce.searchFriend ~ this.dataFriend:", this.dataFriend)
      })

     }

     addFriend(id : any){
      this._serivce.addFriend(id).subscribe((res: any) => {
        if(res.status == 200){
          window.alert('ส่งคำขอเป็นเพื่อนเรียบร้อย')
        }
      })
     }

     accept(id : any) {
      this._serivce.accept(id).subscribe((res: any) => {
    window.alert('รับเป็นเพื่อนเรียบร้อย')
      })
     }

      close(): void {
    this.dialogRef.close('Some Result');
  }

}

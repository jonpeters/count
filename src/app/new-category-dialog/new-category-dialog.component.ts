import {Component, OnInit, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.css']
})
export class NewCategoryDialogComponent implements OnInit {

  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}

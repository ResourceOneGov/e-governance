import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upload-section',
  templateUrl: './upload-section.component.html',
  styleUrls: ['./upload-section.component.scss']
})
export class UploadSectionComponent implements OnInit {

  error: string;
  showSpinner: boolean = false;

  constructor(private fb: FormBuilder, private eLearningService: ELearningService, private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

}

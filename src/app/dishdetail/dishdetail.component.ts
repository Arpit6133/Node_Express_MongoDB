import { Component, OnInit, ViewChild, Inject }from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Comment } from "../shared/comment";
import { MatSliderModule } from '@angular/material/slider';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from "rxjs/operators";


@Component({
    selector: 'app-dishdetail',
    templateUrl: './dishdetail.component.html',
    styleUrls: ['./dishdetail.component.scss']
  })

  

  export class DishdetailComponent implements OnInit {
      
    dish: Dish;
    dishIds : string[];
    prev : string;
    next : string;
    commentForm: FormGroup;
    comment: Comment;
    @ViewChild('fform') commentFormDirective;

    formErrors = {
      'author': '',
      'comment': ''
    };

    validationMessages = {
      'author': {
        'required':'Name is required.',
        'minlength':'Name must be at least 4 characters long.'
      },
      'comment': {
        'required':'Comment is required.'
      }
    };
  
    constructor(private dishService: DishService,
      private route: ActivatedRoute,
      private location: Location,
      private fb: FormBuilder,
      @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
      this.createForm();

      this.dishService.getDishIds()
        .subscribe((dishIds) => this.dishIds = dishIds);
      this.route.params
        .pipe(switchMap((params:Params) => this.dishService.getDish(params['id'])))
        .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id) });
    }

    createForm(): void{
      this.commentForm = this.fb.group({
        author:['',[Validators.required , Validators.minLength(4) , Validators.maxLength(25)]],
        rating:[0,[Validators.required , Validators.pattern]],
        comment:['',[Validators.required,Validators.minLength(4) , Validators.maxLength(50)]]
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged() ; // (re)set form validation messages

    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const message = this.validationMessages[field]
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += message[key] + '';
              }
            }
          }
        }
      }
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      console.log(this.comment);
      this.commentForm.reset({
        author: '',
        comment: '',
        
      });
      this.commentFormDirective.resetForm();
    }

    setPrevNext(dishId: string) {
      const index = this .dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];

    }

    formatLable(value: number) {
      if (!value) {
        return 0;
      }
      if (value <= 5) {
        return value;
      }
    }

    
    goBack(): void {
      this.location.back();
  }
  }
  

  
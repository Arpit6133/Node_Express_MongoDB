import { Component, OnInit, ViewChild, Inject }from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Comment, rating } from "../shared/comment";
import { MatSliderModule } from '@angular/material/slider';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from "rxjs/operators";
import { trigger ,state, style, animate, transition } from "@angular/animations";


@Component({
    selector: 'app-dishdetail',
    templateUrl: './dishdetail.component.html',
    styleUrls: ['./dishdetail.component.scss'],
    animations: [
      trigger('visibility',[
        state('shown', style({
          transform: 'scale(1.0)',
          opacity: 1
        })),
        state('hidden', style({
          transform: 'scale(0.5)',
          opacity:0
        })),
        transition('*=>*', animate('0.5s ease-in-out'))
      ])
    ]
  })

  

  export class DishdetailComponent implements OnInit {
      
    dish: Dish;
    errMess: string;
    dishIds : string[];
    prev : string;
    next : string;
    commentForm: FormGroup;
    comment: Comment;
    @ViewChild('cform') commentFormDirective;
    dishcopy: Dish;
    visibility = 'shown';

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
        .pipe(switchMap((params:Params) =>{this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
        .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
          errmess => this.errMess = <any> errmess);
    }

    

    setPrevNext(dishId: string) {
      const index = this .dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    goBack(): void {
      this.location.back();
    }

    createForm(): void{
      this.commentForm = this.fb.group({
        author:['',[Validators.required , Validators.minLength(4)]],
        rating:5,
        comment:['',Validators.required]
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
      this.comment.date = new Date().toISOString();
      console.log(this.comment);
      this.dishcopy.comments.push(this.comment);
      this.dishService.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish; this.dishcopy= dish;
        },
        errmess => {this.dish = null; this.dishcopy= null; this.errMess = <any>errmess ;});
      this.commentFormDirective.resetForm();
      this.commentForm.reset({
        author: '',
        rating: 5,
        comment: ''
      });
      
    }

  }
  

  
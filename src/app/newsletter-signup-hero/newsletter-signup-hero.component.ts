import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-newsletter-signup-hero",
  templateUrl: "./newsletter-signup-hero.component.html",
  styleUrls: ["./newsletter-signup-hero.component.scss"],
})

export class NewsletterSignupHeroComponent implements OnInit {
  invalid: boolean = false;
  _email: string = "";
  invalid_email: boolean = false;
  consented: boolean = false;
  error: string = "";
  success: string = "";
  submitted: boolean = false;
  blink_box: boolean = false;
  showFull: boolean = false;
  email_test: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  get email() { return this._email; }

  set email(val: string) {
    this._email = val;
    this.showFull = !!this._email;
    if (!this.showFull) this.consented = false;
  }

  constructor(private http: HttpClient) { }

  inputListener () {
    this.invalid_email = false;
    this.blink_box = false;
  }
  checkboxListener () {
    this.blink_box = false;
  }

  submit() {
    const mailchimp_add = "https://ik396c7x0k.execute-api.us-west-2.amazonaws.com/default/mailchimp?email=";
    const mailchimp_url = mailchimp_add + encodeURIComponent(this.email || "");

    this.invalid = false;

    if (!this.email_test.test(this.email)) {
      this.invalid_email = true;
      this.invalid = true;
    } else {
      this.invalid_email = false;
    }

    if (!this.consented) {
      this.blink_box = true;
      this.invalid = true;
    } else {
      this.blink_box = false;
    }
    if (this.invalid) return false;

    this.error = "";

    this.http.get(mailchimp_url)
      .subscribe(
        response => {
          if (response["status"] == "pending") {
            this.submitted = true;
            this.success = "Great! Now please check your email and confirm."
          } else if (response["detail"]) {
            this.error = response["detail"];
          }
        },
        error => {
          this.error = "Sorry, an error occurred.";
        });
  }

  ngOnInit() { }
}

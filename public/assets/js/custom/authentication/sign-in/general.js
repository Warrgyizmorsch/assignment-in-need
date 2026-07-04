"use strict";

// Wrap the code in an immediately-invoked function expression (IIFE)
(function () {
  // Declare variables
  var form, submitButton, validation;

  // Initialize the module
  var KTSigninGeneral = {
    init: function () {
      // Get DOM elements
      form = document.querySelector("#kt_sign_in_form");
      submitButton = document.querySelector("#kt_sign_in_submit");

      // Initialize form validation using FormValidation library
      validation = FormValidation.formValidation(form, {
        fields: {
          email: {
            validators: {
              notEmpty: {
                message: "Email address is required"
              },
              emailAddress: {
                message: "The value is not a valid email address"
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: "The password is required"
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row"
          })
        }
      });

      // Add a click event listener to the submit button
      submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Validate the form
        validation.validate().then(function (status) {
          if (status === "Valid") {
            // Disable the submit button and show a success message
            submitButton.setAttribute("data-kt-indicator", "on");
            submitButton.disabled = true;

            setTimeout(function () {
              // Remove the indicator and enable the submit button
              submitButton.removeAttribute("data-kt-indicator");
              submitButton.disabled = false;

              // Show a success message
              Swal.fire({
                text: "You have successfully logged in!",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary"
                }
              }).then(function (result) {
                if (result.isConfirmed) {
                  // Clear the email and password fields
                  form.querySelector('[name="email"]').value = "";
                  form.querySelector('[name="password"]').value = "";
                }
              });
            }, 2000);
          } else {
            // Show an error message
            Swal.fire({
              text: "Sorry, looks like there are some errors detected, please try again.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary"
              }
            });
          }
        });
      });
    }
  };

  // Initialize the module when the DOM is ready
  KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
  });
})();

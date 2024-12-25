/**
* PHP Email Form Validation - v3.9
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  // Select all forms with the class 'php-email-form'
  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form from submitting the traditional way

      let thisForm = this;
      let action = thisForm.getAttribute('action'); // URL where to submit the form
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'Form submission URL is missing!');
        return;
      }

      // Show loading indication and hide previous messages
      toggleLoadingMessage(thisForm, true);
      toggleErrorMessage(thisForm, false);
      toggleSentMessage(thisForm, false);

      let formData = new FormData(thisForm);

      if (recaptcha) {
        handleReCaptcha(thisForm, action, formData, recaptcha);
      } else {
        submitFormData(thisForm, action, formData);
      }
    });
  });

  function handleReCaptcha(thisForm, action, formData, recaptcha) {
    if (typeof grecaptcha !== "undefined") {
      grecaptcha.ready(function() {
        grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
        .then(token => {
          formData.set('recaptcha-response', token);
          submitFormData(thisForm, action, formData);
        }).catch(error => {
          displayError(thisForm, 'reCAPTCHA validation failed: ' + error);
        });
      });
    } else {
      displayError(thisForm, 'reCAPTCHA script is not loaded.');
    }
  }

  function submitFormData(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
    })
    .then(data => {
      toggleLoadingMessage(thisForm, false);
      if (data.trim() === 'OK') {
        toggleSentMessage(thisForm, true);
        thisForm.reset(); // Reset form after successful submission
      } else {
        throw new Error(data || 'Form submission failed without a server message.');
      }
    })
    .catch(error => {
      displayError(thisForm, 'Error: ' + error.message);
    });
  }

  function toggleLoadingMessage(thisForm, show) {
    thisForm.querySelector('.loading').classList.toggle('d-block', show);
  }

  function toggleErrorMessage(thisForm, show, message = '') {
    let errorMessage = thisForm.querySelector('.error-message');
    errorMessage.innerHTML = message;
    errorMessage.classList.toggle('d-block', show);
  }

  function toggleSentMessage(thisForm, show) {
    thisForm.querySelector('.sent-message').classList.toggle('d-block', show);
  }

  function displayError(thisForm, error) {
    toggleLoadingMessage(thisForm, false);
    toggleErrorMessage(thisForm, true, error);
  }

})();

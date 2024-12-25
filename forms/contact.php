<?php
  // Ensure error reporting is enabled for debugging
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  $receiving_email_address = 'contact@example.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'] ?? '';
  $contact->from_email = $_POST['email'] ?? '';
  $contact->subject = $_POST['subject'] ?? 'No subject provided';

  if(empty($contact->from_name) || empty($contact->from_email) || empty($_POST['message'])) {
    echo json_encode(array('status' => 'error', 'message' => 'Please fill all the required fields.'));
    exit;
  }

  // Uncomment and configure SMTP settings if needed
  /*
  $contact->smtp = array(
    'host' => 'smtp.example.com',
    'username' => 'your_smtp_username',
    'password' => 'your_smtp_password',
    'port' => '587',
    'encryption' => 'tls'
  );
  */

  $contact->add_message($_POST['name'], 'From');
  $contact->add_message($_POST['email'], 'Email');
  $contact->add_message($_POST['message'], 'Message', 10);

  if ($contact->send()) {
    echo json_encode(array('status' => 'success', 'message' => 'Your message has been sent. Thank you!'));
  } else {
    echo json_encode(array('status' => 'error', 'message' => 'Sorry, your message could not be sent. Please try again later.'));
  }
?>

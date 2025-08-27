<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    // Добавяме токен и имейл като параметри
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function envelope()
    {
        return new Envelope(
            subject: 'Смяна на парола',
        );
    }

    public function content()
    {
        return new Content(
            markdown: 'emails.reset-password',
        );
    }

    public function attachments()
    {
        return [];
    }
}

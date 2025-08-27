<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            background-color: #f9fafb; /* фон на имейла */
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            width: 100%;
            padding: 40px 0;
        }
        .email-content {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff; /* бял фон на контейнера */
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 22px;
            margin-bottom: 20px;
            color: #111827;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
        }
        .button {
            display: inline-block;
            background-color: #A7296F;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            {{ $slot }}
        </div>
        <div class="footer">
            {{ config('app.name') }} &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
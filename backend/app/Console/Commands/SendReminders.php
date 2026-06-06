<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Reminder;
use App\Models\Notification;

class SendReminders extends Command
{
    protected $signature = 'reminders:send';

    protected $description =
        'Send scheduled reminders';

    public function handle()
    {
        $reminders = Reminder::with('note')
            ->where('is_sent', false)
            ->where('remind_at', '<=', now())
            ->get();

        foreach ($reminders as $reminder)
        {
            Notification::create([

                'user_id' =>
                    $reminder->user_id,

                'title' =>
                    'Reminder',

                'message' =>
                    'Reminder for note: '
                    .
                    $reminder->note->title,

                'type' =>
                    'reminder',

                'is_read' =>
                    false,
            ]);

            $reminder->update([
                'is_sent' => true
            ]);
        }

        $this->info(
            $reminders->count()
            .
            ' reminders processed.'
        );

        return Command::SUCCESS;
    }
}
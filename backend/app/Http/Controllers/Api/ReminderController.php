<?php

namespace App\Http\Controllers\Api;

use App\Models\Note;
use App\Models\Reminder;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReminderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'note_id' => 'required|exists:notes,id',
            'remind_at' => 'required|date|after:now',
        ]);

        $note = Note::findOrFail($request->note_id);

        if ($note->user_id != $request->user()->id)
        {
            return response()->json([
                'message' => 'Unauthorized'
            ],403);
        }

        $reminder = Reminder::create([
            'user_id' => $request->user()->id,
            'note_id' => $note->id,
            'remind_at' => $request->remind_at,
            'is_sent' => false,
        ]);

        return response()->json([
            'message' => 'Reminder created successfully',
            'reminder' => $reminder
        ],201);
    }

    public function index(Request $request)
    {
        $reminders = Reminder::with('note')
            ->where('user_id',$request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($reminders);
    }

    public function update(Request $request,$id)
    {
        $reminder = Reminder::findOrFail($id);

        if($reminder->user_id != $request->user()->id)
        {
            return response()->json([
                'message'=>'Unauthorized'
            ],403);
        }

        $request->validate([
            'remind_at'=>'required|date|after:now'
        ]);

        $reminder->update([
            'remind_at'=>$request->remind_at
        ]);

        return response()->json([
            'message'=>'Reminder updated successfully',
            'reminder'=>$reminder
        ]);
    }

    public function destroy(Request $request,$id)
    {
        $reminder = Reminder::findOrFail($id);

        if($reminder->user_id != $request->user()->id)
        {
            return response()->json([
                'message'=>'Unauthorized'
            ],403);
        }

        $reminder->delete();

        return response()->json([
            'message'=>'Reminder deleted successfully'
        ]);
    }
}
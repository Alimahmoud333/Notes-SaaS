<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where(
            'user_id',
            $request->user()->id
        )
        ->latest()
        ->paginate(20);

        return response()->json($notifications);
    }

    public function markAsRead(
        Request $request,
        $id
    )
    {
        $notification = Notification::findOrFail($id);

        if(
            $notification->user_id
            !=
            $request->user()->id
        )
        {
            return response()->json([
                'message'=>'Unauthorized'
            ],403);
        }

        $notification->update([
            'is_read'=>true
        ]);

        return response()->json([
            'message'=>'Notification marked as read'
        ]);
    }

    public function markAllRead(Request $request)
    {
        Notification::where(
            'user_id',
            $request->user()->id
        )
        ->update([
            'is_read'=>true
        ]);

        return response()->json([
            'message'=>'All notifications marked as read'
        ]);
    }

    public function destroy(
        Request $request,
        $id
    )
    {
        $notification = Notification::findOrFail($id);

        if(
            $notification->user_id
            !=
            $request->user()->id
        )
        {
            return response()->json([
                'message'=>'Unauthorized'
            ],403);
        }

        $notification->delete();

        return response()->json([
            'message'=>'Notification deleted successfully'
        ]);
    }
}
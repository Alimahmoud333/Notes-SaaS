<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\Note;
use App\Models\Group;
use App\Models\Review;
use App\Models\Report;
use App\Models\Subscription;
use App\Http\Controllers\Controller;
use App\Models\Reminder;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminController extends Controller
{
public function dashboard()
{
    return response()->json([

        'statistics' => [

            'users' => User::count(),

            'notes' => Note::count(),

            'groups' => Group::count(),

            'reviews' => Review::count(),

            'reports' => Report::count(),

            'subscriptions' => Subscription::count(),

            'pro_users' => User::where('plan', 'pro')->count(),

            'free_users' => User::where('plan', 'free')->count(),

            'suspended_users' => User::where('is_suspended', true)->count(),
        ]
    ]);
}


public function user($id)
{
    $user = User::with(['notes', 'groups'])->findOrFail($id);

    return response()->json($user);
}

public function reports()
{
    return Report::with([
        'user',
        'note'
    ])
    ->latest()
    ->paginate(20);
}

public function users(Request $request)
{
    $users = User::query();

    if ($request->search) {
        $users->where('name', 'like', '%'.$request->search.'%')
              ->orWhere('email', 'like', '%'.$request->search.'%');
    }

    return $users
        ->latest()
        ->paginate(20);
}


public function suspendUser($id)
{
    $user = User::findOrFail($id);

    $user->update([
        'is_suspended' => true
    ]);

    Notification::create([
        'user_id' => $user->id,
        'title' => 'Account Suspended',
        'message' => 'Your account has been suspended by admin.',
        'type' => 'admin',
        'is_read' => false,
    ]);

    return response()->json([
        'message' => 'User suspended'
    ]);
}

public function unsuspendUser($id)
{
    $user = User::findOrFail($id);

    $user->update([
        'is_suspended' => false
    ]);

    Notification::create([
        'user_id' => $user->id,
        'title' => 'Account Restored',
        'message' => 'Your account has been restored by admin.',
        'type' => 'admin',
        'is_read' => false,
    ]);

    return response()->json([
        'message' => 'User unsuspended successfully'
    ]);
}

public function deleteUser($id)
{
    $user = User::findOrFail($id);

    $user->delete();

    return response()->json([
        'message' => 'User deleted successfully'
    ]);
}


public function reviews()
{
    return Review::with('user')
        ->latest()
        ->paginate(20);
}

public function reminders()
{
    return Reminder::with([
        'user',
        'note'
    ])
    ->latest()
    ->paginate(20);
}

public function notifications()
{
    return Notification::with('user')
        ->latest()
        ->paginate(20);
}

}
<?php

namespace App\Http\Controllers\Api;

use App\Models\Note;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\Notification;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NoteController extends Controller
{
    /*
    =========================================
    CREATE NOTE
    =========================================
    */

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'title' => 'required|string|min:3|max:255',
            'content' => 'required|string',
            'group_id' => 'nullable|exists:groups,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt|max:5120',
        ]);

        /*
        FREE PLAN LIMIT
        */

        if ($user->plan == 'free') {

            $notesCount = Note::where(
                'user_id',
                $user->id
            )->count();

            if ($notesCount >= 10) {
                return response()->json([
                    'message' => 'Free plan allows only 10 notes'
                ], 403);
            }

            if ($request->hasFile('image')) {
                return response()->json([
                    'message' => 'Images available only for Pro users'
                ], 403);
            }

            if ($request->hasFile('file')) {
                return response()->json([
                    'message' => 'Files available only for Pro users'
                ], 403);
            }
        }

        /*
        GROUP PERMISSION
        */

        if ($request->group_id) {

            $group = Group::findOrFail(
                $request->group_id
            );

            if ($group->owner_id != $user->id) {

                $member = GroupMember::where(
                    'group_id',
                    $group->id
                )
                ->where(
                    'user_id',
                    $user->id
                )
                ->where(
                    'can_edit',
                    true
                )
                ->first();

                if (!$member) {
                    return response()->json([
                        'message' => 'No permission to create note in this group'
                    ], 403);
                }
            }
        }

        $image = null;
        $file = null;

        if ($request->hasFile('image')) {
            $image = $request
                ->file('image')
                ->store('notes/images', 'public');
        }

        if ($request->hasFile('file')) {
            $file = $request
                ->file('file')
                ->store('notes/files', 'public');
        }

        $note = Note::create([
            'user_id' => $user->id,
            'group_id' => $request->group_id,
            'title' => $request->title,
            'content' => $request->content,
            'image' => $image,
            'file' => $file,
            'is_shared' => $request->group_id ? true : false,
        ]);

        return response()->json([
            'message' => 'Note created successfully',
            'note' => $note
        ], 201);
    }

    /*
    =========================================
    MY NOTES
    =========================================
    */

    public function index(Request $request)
    {
        $notes = Note::where(
            'user_id',
            $request->user()->id
        )
        ->with('group')
        ->latest()
        ->paginate(10);

        return response()->json($notes);
    }

    /*
    =========================================
    SHOW NOTE
    =========================================
    */

    public function show(Request $request, $id)
    {
        $note = Note::with([
            'user',
            'group'
        ])->findOrFail($id);

        $user = $request->user();

        if ($note->user_id == $user->id) {
            return response()->json($note);
        }

        if ($note->group_id) {

            $member = GroupMember::where(
                'group_id',
                $note->group_id
            )
            ->where(
                'user_id',
                $user->id
            )
            ->where(
                'can_view',
                true
            )
            ->exists();

            if ($member) {
                return response()->json($note);
            }
        }

        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    /*
    =========================================
    UPDATE NOTE
    =========================================
    */

    public function update(Request $request, $id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|min:3|max:255',
            'content' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt|max:5120',
        ]);

        if (
            ($request->hasFile('image') || $request->hasFile('file'))
            &&
            $request->user()->plan != 'pro'
        ) {
            return response()->json([
                'message' => 'Upgrade to Pro'
            ], 403);
        }

        if ($request->hasFile('image')) {
            $note->image = $request
                ->file('image')
                ->store('notes/images', 'public');
        }

        if ($request->hasFile('file')) {
            $note->file = $request
                ->file('file')
                ->store('notes/files', 'public');
        }

        $note->title = $request->title ?? $note->title;
        $note->content = $request->content ?? $note->content;

        $note->save();

        return response()->json([
            'message' => 'Note updated successfully',
            'note' => $note
        ]);
    }

    /*
    =========================================
    DELETE NOTE
    =========================================
    */

    public function destroy(Request $request, $id)
    {
        $note = Note::findOrFail($id);

        if ($note->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully'
        ]);
    }



    public function dashboard(Request $request)
    {
        $user = $request->user();

        $notesCount = Note::where('user_id', $user->id)->count();

        $groupsCount = Group::whereHas('members', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();

        $notificationsCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $subscription = Subscription::where('user_id', $user->id)
            ->latest()
            ->first();

        return response()->json([
            'notes' => $notesCount,
            'groups' => $groupsCount,
            'notifications' => $notificationsCount,
            'plan' => $user->plan,
            'plan_expires_at' => $user->plan_expires_at,
            'subscription' => $subscription,
        ]);
    }
}
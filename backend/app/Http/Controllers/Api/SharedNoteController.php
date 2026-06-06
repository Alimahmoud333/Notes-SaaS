<?php

namespace App\Http\Controllers\Api;

use App\Models\Note;
use App\Models\Group;
use App\Models\GroupMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Notification;
class SharedNoteController extends Controller
{
    /*
    =========================================
    SHARE NOTE
    =========================================
    */

    public function share(Request $request, $noteId)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id'
        ]);

        $note = Note::findOrFail($noteId);

        if ($note->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $group = Group::findOrFail(
            $request->group_id
        );

        $note->update([
            'group_id' => $group->id,
            'is_shared' => true
        ]);
        $members = GroupMember::where(
    'group_id',
    $group->id
)->get();

foreach ($members as $member)
{
    Notification::create([
        'user_id' => $member->user_id,
        'title' => 'New Shared Note',
        'message' => $request->user()->name .
            ' shared a note in group ' .
            $group->name,
        'type' => 'shared_note',
        'is_read' => false,
    ]);
}

        return response()->json([
            'message' => 'Note shared successfully',
            'note' => $note
        ]);
    }

    /*
    =========================================
    GROUP NOTES
    =========================================
    */

    public function groupNotes(Request $request, $groupId)
    {
        $member = GroupMember::where(
            'group_id',
            $groupId
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->where(
            'can_view',
            true
        )
        ->exists();

        if (!$member) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $notes = Note::with('user')
            ->where('group_id', $groupId)
            ->latest()
            ->paginate(15);

        return response()->json($notes);
    }

    /*
    =========================================
    ALL SHARED NOTES
    =========================================
    */

    public function sharedNotes(Request $request)
    {
        $groupIds = GroupMember::where(
            'user_id',
            $request->user()->id
        )->pluck('group_id');

        return Note::with([
            'user',
            'group'
        ])
        ->whereIn('group_id', $groupIds)
        ->latest()
        ->paginate(15);
    }

    /*
    =========================================
    UPDATE SHARED NOTE
    =========================================
    */

    public function updateSharedNote(
        Request $request,
        $noteId
    )
    {
        $note = Note::findOrFail($noteId);

        $member = GroupMember::where(
            'group_id',
            $note->group_id
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->where(
            'can_edit',
            true
        )
        ->exists();

        if (!$member) {
            return response()->json([
                'message' => 'Edit permission denied'
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string'
        ]);

        $note->update([
            'title' => $request->title ?? $note->title,
            'content' => $request->content ?? $note->content,
        ]);
        $members = GroupMember::where(
    'group_id',
    $note->group_id
)->get();

foreach ($members as $member)
{
    Notification::create([
        'user_id' => $member->user_id,
        'title' => 'Shared Note Updated',
        'message' => $request->user()->name .
            ' updated a shared note',
        'type' => 'shared_note',
        'is_read' => false,
    ]);
}

        return response()->json([
            'message' => 'Shared note updated',
            'note' => $note
        ]);
    }

    /*
    =========================================
    DELETE SHARED NOTE
    =========================================
    */

    public function deleteSharedNote(
        Request $request,
        $noteId
    )
    {
        $note = Note::findOrFail($noteId);

        $member = GroupMember::where(
            'group_id',
            $note->group_id
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->where(
            'can_delete',
            true
        )
        ->exists();

        if (!$member) {
            return response()->json([
                'message' => 'Delete permission denied'
            ], 403);
        }
        $members = GroupMember::where(
    'group_id',
    $note->group_id
)->get();


foreach ($members as $member)
{
    Notification::create([
        'user_id' => $member->user_id,
        'title' => 'Shared Note Deleted',
        'message' => $request->user()->name .
            ' deleted a shared note',
        'type' => 'shared_note',
        'is_read' => false,
    ]);
}

        $note->delete();

        return response()->json([
            'message' => 'Shared note deleted'
        ]);
    }

    /*
    =========================================
    PIN NOTE
    =========================================
    */

    public function pin(Request $request, $noteId)
    {
        $note = Note::findOrFail($noteId);

        if ($note->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $note->update([
            'is_pinned' => !$note->is_pinned
        ]);

        return response()->json([
            'message' => 'Pin status updated',
            'note' => $note
        ]);
    }

    /*
    =========================================
    ARCHIVE NOTE
    =========================================
    */

    public function archive(Request $request, $noteId)
    {
        $note = Note::findOrFail($noteId);

        if ($note->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $note->update([
            'is_archived' => !$note->is_archived
        ]);

        return response()->json([
            'message' => 'Archive status updated',
            'note' => $note
        ]);
    }

    /*
    =========================================
    SEARCH
    =========================================
    */

    public function search(Request $request)
    {
        $request->validate([
            'search' => 'required|string|min:1'
        ]);

        $notes = Note::where(
            'user_id',
            $request->user()->id
        )
        ->where(function ($q) use ($request) {

            $q->where(
                'title',
                'like',
                '%'.$request->search.'%'
            )
            ->orWhere(
                'content',
                'like',
                '%'.$request->search.'%'
            );

        })
        ->latest()
        ->paginate(10);

        return response()->json($notes);
    }
}
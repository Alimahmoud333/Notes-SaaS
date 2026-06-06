<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Group;
use App\Models\Notification;
use App\Models\GroupMember;
use Illuminate\Http\Request;
use App\Models\GroupInvitation;
use App\Http\Controllers\Controller;

class GroupInvitationController extends Controller
{
    /*
    =========================================
    INVITE USER TO GROUP
    =========================================
    */

    public function invite(Request $request, $groupId)
    {
        $request->validate([
            'email' => 'required|email|max:255|exists:users,email',
        ]);

        $group = Group::findOrFail($groupId);

        if ($group->owner_id != $request->user()->id) {
            return response()->json([
                'message' => 'Only owner can invite users'
            ], 403);
        }

        $user = User::where(
            'email',
            strtolower(trim($request->email))
        )->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->is_suspended) {
            return response()->json([
                'message' => 'This user is suspended'
            ], 422);
        }

        if ($user->id == $request->user()->id) {
            return response()->json([
                'message' => 'You cannot invite yourself'
            ], 422);
        }

        $alreadyMember = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $user->id
        )
        ->exists();

        if ($alreadyMember) {
            return response()->json([
                'message' => 'User is already a member'
            ], 422);
        }

        $alreadyInvited = GroupInvitation::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $user->id
        )
        ->where(
            'status',
            'pending'
        )
        ->exists();

        if ($alreadyInvited) {
            return response()->json([
                'message' => 'Invitation already sent'
            ], 422);
        }

        $invitation = GroupInvitation::create([
            'group_id' => $group->id,
            'invited_by' => $request->user()->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        Notification::create([
            'user_id' => $user->id,
            'title' => 'Group Invitation',
            'message' => 'You have been invited to join ' . $group->name,
            'type' => 'group_invitation',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Invitation sent successfully',
            'invitation' => $invitation
        ], 201);
    }

    /*
    =========================================
    MY INVITATIONS
    =========================================
    */

    public function myInvitations(Request $request)
    {
        $invitations = GroupInvitation::with([
            'group',
            'inviter:id,name,email,avatar'
        ])
        ->where(
            'user_id',
            $request->user()->id
        )
        ->latest()
        ->paginate(10);

        return response()->json($invitations);
    }

    /*
    =========================================
    ACCEPT INVITATION
    =========================================
    */

    public function accept(Request $request, $id)
    {
        $invitation = GroupInvitation::findOrFail($id);

        if (
            $invitation->user_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($invitation->status != 'pending') {
            return response()->json([
                'message' => 'Invitation already processed'
            ], 422);
        }

        $alreadyMember = GroupMember::where(
            'group_id',
            $invitation->group_id
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->exists();

        if (!$alreadyMember) {
            GroupMember::create([
                'group_id' => $invitation->group_id,
                'user_id' => $request->user()->id,
                'can_view' => true,
                'can_edit' => false,
                'can_delete' => false,
            ]);
        }

        $invitation->update([
            'status' => 'accepted'
        ]);

        Notification::create([
            'user_id' => $invitation->invited_by,
            'title' => 'Invitation Accepted',
            'message' => $request->user()->name . ' accepted your invitation',
            'type' => 'group_invitation',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Invitation accepted successfully'
        ]);
    }

    /*
    =========================================
    REJECT INVITATION
    =========================================
    */

    public function reject(Request $request, $id)
    {
        $invitation = GroupInvitation::findOrFail($id);

        if (
            $invitation->user_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($invitation->status != 'pending') {
            return response()->json([
                'message' => 'Invitation already processed'
            ], 422);
        }

        $invitation->update([
            'status' => 'rejected'
        ]);

        Notification::create([
            'user_id' => $invitation->invited_by,
            'title' => 'Invitation Rejected',
            'message' => $request->user()->name . ' rejected your invitation',
            'type' => 'group_invitation',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Invitation rejected successfully'
        ]);
    }

    /*
    =========================================
    SENT INVITATIONS
    =========================================
    */

    public function sentInvitations(Request $request)
    {
        $invitations = GroupInvitation::with([
            'group',
            'user:id,name,email,avatar'
        ])
        ->where(
            'invited_by',
            $request->user()->id
        )
        ->latest()
        ->paginate(10);

        return response()->json($invitations);
    }

    /*
    =========================================
    CANCEL INVITATION
    =========================================
    */

    public function cancel(Request $request, $id)
    {
        $invitation = GroupInvitation::findOrFail($id);

        if (
            $invitation->invited_by !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($invitation->status != 'pending') {
            return response()->json([
                'message' => 'Cannot cancel processed invitation'
            ], 422);
        }

        $invitation->delete();

        return response()->json([
            'message' => 'Invitation cancelled successfully'
        ]);
    }
}
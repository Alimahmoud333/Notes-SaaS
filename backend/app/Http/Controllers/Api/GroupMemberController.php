<?php

namespace App\Http\Controllers\Api;

use App\Models\Group;
use App\Models\Notification;
use App\Models\GroupMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GroupMemberController extends Controller
{
    /*
    =========================================
    GROUP MEMBERS
    =========================================
    */

    public function members(Request $request, $groupId)
    {
        $group = Group::findOrFail($groupId);

        $isMember = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->exists();

        if (
            !$isMember &&
            $group->owner_id != $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $members = GroupMember::with([
            'user:id,name,email,avatar'
        ])
        ->where(
            'group_id',
            $group->id
        )
        ->latest()
        ->paginate(20);

        return response()->json($members);
    }

    /*
    =========================================
    REMOVE MEMBER
    =========================================
    */

    public function removeMember(
        Request $request,
        $groupId,
        $userId
    ) {
        $group = Group::findOrFail($groupId);

        if (
            $group->owner_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Only owner can remove members'
            ], 403);
        }

        if ($group->owner_id == $userId) {
            return response()->json([
                'message' => 'Owner cannot be removed'
            ], 422);
        }

        $member = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $userId
        )
        ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        $member->delete();

        Notification::create([
            'user_id' => $userId,
            'title' => 'Removed From Group',
            'message' => 'You were removed from '.$group->name,
            'type' => 'group_member',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Member removed successfully'
        ]);
    }

    /*
    =========================================
    UPDATE MEMBER PERMISSIONS
    =========================================
    */

    public function updatePermissions(
        Request $request,
        $groupId,
        $userId
    ) {
        $group = Group::findOrFail($groupId);

        if (
            $group->owner_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Only owner can update permissions'
            ], 403);
        }

        if ($group->owner_id == $userId) {
            return response()->json([
                'message' => 'Owner permissions cannot be changed'
            ], 422);
        }

        $request->validate([
            'can_view' => 'required|boolean',
            'can_edit' => 'required|boolean',
            'can_delete' => 'required|boolean',
        ]);

        $member = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $userId
        )
        ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        $member->update([
            'can_view' => $request->can_view,
            'can_edit' => $request->can_edit,
            'can_delete' => $request->can_delete,
        ]);

        Notification::create([
            'user_id' => $userId,
            'title' => 'Permissions Updated',
            'message' => 'Your permissions were updated in '.$group->name,
            'type' => 'group_permission',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Permissions updated successfully',
            'member' => $member
        ]);
    }

    /*
    =========================================
    LEAVE GROUP
    =========================================
    */

    public function leaveGroup(
        Request $request,
        $groupId
    ) {
        $group = Group::findOrFail($groupId);

        if (
            $group->owner_id ==
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Owner cannot leave group. Transfer ownership first.'
            ], 422);
        }

        $member = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->first();

        if (!$member) {
            return response()->json([
                'message' => 'You are not a member'
            ], 404);
        }

        $member->delete();

        Notification::create([
            'user_id' => $group->owner_id,
            'title' => 'Member Left',
            'message' => $request->user()->name .
                ' left group ' .
                $group->name,
            'type' => 'group_member',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Left group successfully'
        ]);
    }

    /*
    =========================================
    MY GROUPS
    =========================================
    */

    public function myGroups(Request $request)
    {
        $groups = GroupMember::with([
            'group'
        ])
        ->where(
            'user_id',
            $request->user()->id
        )
        ->latest()
        ->paginate(10);

        return response()->json($groups);
    }

    /*
    =========================================
    MEMBER DETAILS
    =========================================
    */

    public function member(
        Request $request,
        $groupId,
        $userId
    ) {
        $group = Group::findOrFail($groupId);

        $isMember = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $request->user()->id
        )
        ->exists();

        if (
            !$isMember &&
            $group->owner_id != $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $member = GroupMember::with([
            'user:id,name,email,avatar'
        ])
        ->where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $userId
        )
        ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        return response()->json($member);
    }

    /*
    =========================================
    TRANSFER OWNERSHIP
    =========================================
    */

    public function transferOwnership(
        Request $request,
        $groupId,
        $userId
    ) {
        $group = Group::findOrFail($groupId);

        if (
            $group->owner_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Only owner can transfer ownership'
            ], 403);
        }

        $member = GroupMember::where(
            'group_id',
            $group->id
        )
        ->where(
            'user_id',
            $userId
        )
        ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Target user is not a member'
            ], 404);
        }

        $oldOwner = $group->owner_id;

        $group->update([
            'owner_id' => $userId
        ]);

        GroupMember::updateOrCreate(
            [
                'group_id' => $group->id,
                'user_id' => $oldOwner
            ],
            [
                'can_view' => true,
                'can_edit' => true,
                'can_delete' => true,
            ]
        );

        Notification::create([
            'user_id' => $userId,
            'title' => 'Ownership Transferred',
            'message' => 'You are now the owner of '.$group->name,
            'type' => 'group_owner',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Ownership transferred successfully'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Models\Group;
use App\Models\GroupMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GroupController extends Controller
{
    /*
    =========================================
    CREATE GROUP
    =========================================
    */

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_private' => 'nullable|boolean',
        ]);

        $image = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image')
                ->store('groups', 'public');
        }

        $group = Group::create([
            'owner_id' => $request->user()->id,
            'name' => trim($request->name),
            'description' => $request->description,
            'image' => $image,
            'is_private' => $request->is_private ?? false,
        ]);

        GroupMember::create([
            'group_id' => $group->id,
            'user_id' => $request->user()->id,
            'can_view' => true,
            'can_edit' => true,
            'can_delete' => true,
        ]);

        return response()->json([
            'message' => 'Group created successfully',
            'group' => $group,
        ], 201);
    }

    /*
    =========================================
    MY GROUPS
    =========================================
    */

    public function index(Request $request)
    {
        $groups = Group::with([
                'owner:id,name,email,avatar'
            ])
            ->withCount('members')
            ->where(function ($query) use ($request) {

                $query->where(
                    'owner_id',
                    $request->user()->id
                )
                ->orWhereHas(
                    'members',
                    function ($q) use ($request) {

                        $q->where(
                            'user_id',
                            $request->user()->id
                        );
                    }
                );
            })
            ->latest()
            ->paginate(10);

        return response()->json($groups);
    }

    /*
    =========================================
    SHOW GROUP
    =========================================
    */

    public function show(Request $request, $id)
    {
        $group = Group::with([
            'owner:id,name,email,avatar',
            'members:id,name,email,avatar'
        ])
        ->withCount('members')
        ->findOrFail($id);

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

        return response()->json($group);
    }

    /*
    =========================================
    UPDATE GROUP
    =========================================
    */

    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);

        if (
            $group->owner_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Only owner can update group'
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|min:3|max:100',
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_private' => 'nullable|boolean',
        ]);

        $data = [
            'name' => $request->name ?? $group->name,
            'description' => $request->description ?? $group->description,
            'is_private' => $request->is_private ?? $group->is_private,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')
                ->store('groups', 'public');
        }

        $group->update($data);

        return response()->json([
            'message' => 'Group updated successfully',
            'group' => $group->fresh(),
        ]);
    }

    /*
    =========================================
    DELETE GROUP
    =========================================
    */

    public function destroy(Request $request, $id)
    {
        $group = Group::findOrFail($id);

        if (
            $group->owner_id !=
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Only owner can delete group'
            ], 403);
        }

        $group->delete();

        return response()->json([
            'message' => 'Group deleted successfully'
        ]);
    }

    /*
    =========================================
    MY OWNED GROUPS
    =========================================
    */

    public function myOwnedGroups(Request $request)
    {
        $groups = Group::where(
                'owner_id',
                $request->user()->id
            )
            ->withCount('members')
            ->latest()
            ->paginate(10);

        return response()->json($groups);
    }

    /*
    =========================================
    SEARCH GROUPS
    =========================================
    */

    public function search(Request $request)
    {
        $request->validate([
            'search' => 'required|string|min:1|max:100'
        ]);

        $groups = Group::where(function ($query) use ($request) {

                $query->where(
                    'owner_id',
                    $request->user()->id
                )
                ->orWhereHas(
                    'members',
                    function ($q) use ($request) {

                        $q->where(
                            'user_id',
                            $request->user()->id
                        );
                    }
                );
            })
            ->where(function ($query) use ($request) {

                $query->where(
                    'name',
                    'like',
                    '%' . $request->search . '%'
                )
                ->orWhere(
                    'description',
                    'like',
                    '%' . $request->search . '%'
                );
            })
            ->withCount('members')
            ->latest()
            ->paginate(10);

        return response()->json($groups);
    }
}
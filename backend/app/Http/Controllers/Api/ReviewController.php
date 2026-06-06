<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
class ReviewController extends Controller
{
    /*
    =========================================
    CREATE REVIEW
    =========================================
    */

    public function store(Request $request)
    {
        if ($request->user()->plan != 'pro') {
            return response()->json([
                'message' => 'Only Pro users can submit reviews'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $alreadyReviewed = Review::where(
            'user_id',
            $request->user()->id
        )->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'message' => 'You already submitted a review'
            ], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $admins = User::where(
    'role',
    'admin'
)->get();

foreach ($admins as $admin)
{
    Notification::create([
        'user_id' => $admin->id,
        'title' => 'New Review',
        'message' => $request->user()->name .
            ' submitted a review',
        'type' => 'review',
        'is_read' => false,
    ]);
}

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review
        ], 201);
    }

    /*
    =========================================
    MY REVIEW
    =========================================
    */

    public function myReview(Request $request)
    {
        $review = Review::where(
            'user_id',
            $request->user()->id
        )->first();

        return response()->json($review);
    }

    /*
    =========================================
    UPDATE REVIEW
    =========================================
    */

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $admins = User::where(
    'role',
    'admin'
)->get();

foreach ($admins as $admin)
{
    Notification::create([
        'user_id' => $admin->id,
        'title' => 'Review Updated',
        'message' => $request->user()->name .
            ' updated a review',
        'type' => 'review',
        'is_read' => false,
    ]);
}

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review
        ]);
    }

    /*
    =========================================
    DELETE REVIEW
    =========================================
    */

    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }
}
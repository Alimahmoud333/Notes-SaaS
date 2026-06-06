<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\GroupInvitationController;
use App\Http\Controllers\Api\GroupMemberController;
use App\Http\Controllers\Api\SharedNoteController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ReportController;

use App\Http\Controllers\Api\Admin\AdminController;

use App\Http\Controllers\Api\ReminderController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

Route::post('/resend-otp', [AuthController::class, 'resendOtp']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| STRIPE WEBHOOK
|--------------------------------------------------------------------------
*/

Route::post(
    '/stripe/webhook',
    [StripeWebhookController::class, 'handle']
);

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [AuthController::class, 'profile']);

    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::post('/avatar', [AuthController::class, 'uploadAvatar']);

    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [NoteController::class, 'dashboard']);


    /*
    |--------------------------------------------------------------------------
    | NOTES
    |--------------------------------------------------------------------------
    */

    Route::post('/notes', [NoteController::class, 'store']);

    Route::get('/notes', [NoteController::class, 'index']);

    Route::get('/notes/{id}', [NoteController::class, 'show']);

    Route::post('/notes/{id}', [NoteController::class, 'update']);

    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | GROUPS
    |--------------------------------------------------------------------------
    */

    Route::post('/groups', [GroupController::class, 'store']);

    Route::get('/groups', [GroupController::class, 'index']);

    Route::get('/groups/{id}', [GroupController::class, 'show']);

    Route::post('/groups/{id}', [GroupController::class, 'update']);

    Route::delete('/groups/{id}', [GroupController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | GROUP INVITATIONS
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/groups/{group}/invite',
        [GroupInvitationController::class, 'invite']
    );

    Route::get(
        '/my-invitations',
        [GroupInvitationController::class, 'myInvitations']
    );

    Route::post(
        '/invitations/{id}/accept',
        [GroupInvitationController::class, 'accept']
    );

    Route::post(
        '/invitations/{id}/reject',
        [GroupInvitationController::class, 'reject']
    );

    /*
    |--------------------------------------------------------------------------
    | GROUP MEMBERS
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/groups/{group}/members',
        [GroupMemberController::class, 'members']
    );

    Route::delete(
        '/groups/{group}/members/{user}',
        [GroupMemberController::class, 'removeMember']
    );

    Route::post(
        '/groups/{group}/permissions/{user}',
        [GroupMemberController::class, 'updatePermissions']
    );

    Route::post(
        '/groups/{group}/leave',
        [GroupMemberController::class, 'leaveGroup']
    );
    Route::get(
        '/my-groups',
        [GroupMemberController::class, 'myGroups']
    );

        Route::get(
        '/groups/{group}/members/{user}',
        [GroupMemberController::class, 'member']
    );
        Route::post(
        '/groups/{group}/transfer/{user}',
        [GroupMemberController::class, 'transferOwnership']
    );

    /*
    |--------------------------------------------------------------------------
    | SHARED NOTES
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/notes/{note}/share',
        [SharedNoteController::class, 'share']
    );

    Route::get(
        '/groups/{group}/notes',
        [SharedNoteController::class, 'groupNotes']
    );

    Route::get(
        '/shared-notes',
        [SharedNoteController::class, 'sharedNotes']
    );

    Route::post(
        '/shared-notes/{note}',
        [SharedNoteController::class, 'updateSharedNote']
    );

    Route::delete(
        '/shared-notes/{note}',
        [SharedNoteController::class, 'deleteSharedNote']
    );

    Route::post(
        '/notes/{note}/pin',
        [SharedNoteController::class, 'pin']
    );

    Route::post(
        '/notes/{note}/archive',
        [SharedNoteController::class, 'archive']
    );

    Route::get(
        '/notes-search',
        [SharedNoteController::class, 'search']
    );

    /*
    |--------------------------------------------------------------------------
    | REVIEWS
    |--------------------------------------------------------------------------
    */

    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/my-review', [ReviewController::class, 'myReview']);

    Route::post('/reviews/{id}', [ReviewController::class, 'update']);

    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | REPORTS
    |--------------------------------------------------------------------------
    */

    Route::post('/reports', [ReportController::class, 'store']);

    Route::get('/my-reports', [ReportController::class, 'myReports']);

    /*
    |--------------------------------------------------------------------------
    | SUBSCRIPTIONS
    |--------------------------------------------------------------------------
    */

    Route::get('/plans', [SubscriptionController::class, 'plans']);

    Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);

    Route::post(
        '/cancel-subscription',
        [SubscriptionController::class, 'cancel']
    );

    Route::get(
        '/subscription',
        [SubscriptionController::class, 'subscription']
    );

    /*
=========================================
REMINDERS
=========================================
*/

Route::post(
    '/reminders',
    [ReminderController::class,'store']
);

Route::get(
    '/reminders',
    [ReminderController::class,'index']
);

Route::post(
    '/reminders/{id}',
    [ReminderController::class,'update']
);

Route::delete(
    '/reminders/{id}',
    [ReminderController::class,'destroy']
);

/*
=========================================
NOTIFICATIONS
=========================================
*/

Route::get(
    '/notifications',
    [NotificationController::class,'index']
);

Route::post(
    '/notifications/{id}/read',
    [NotificationController::class,'markAsRead']
);

Route::post(
    '/notifications/read-all',
    [NotificationController::class,'markAllRead']
);

Route::delete(
    '/notifications/{id}',
    [NotificationController::class,'destroy']
);
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:admin'
])->prefix('admin')->group(function () {

    Route::get(
        '/dashboard',
        [AdminController::class, 'dashboard']
    );

    Route::get(
        '/users',
        [AdminController::class, 'users']
    );

    Route::get(
        '/users/{id}',
        [AdminController::class, 'user']
    );

    Route::post(
        '/users/{id}/suspend',
        [AdminController::class, 'suspendUser']
    );

    Route::post(
        '/users/{id}/unsuspend',
        [AdminController::class, 'unsuspendUser']
    );

    Route::delete(
        '/users/{id}',
        [AdminController::class, 'deleteUser']
    );

    Route::get(
        '/reports',
        [AdminController::class, 'reports']
    );

    Route::get(
        '/reviews',
        [AdminController::class, 'reviews']
    );

    Route::get(
    '/reminders',
    [AdminController::class,'reminders']
);

Route::get(
    '/notifications',
    [AdminController::class,'notifications']
);
});
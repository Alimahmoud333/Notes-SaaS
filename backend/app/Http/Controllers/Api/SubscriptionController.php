<?php

namespace App\Http\Controllers\Api;

use Stripe\Stripe;
use Stripe\Checkout\Session;

use App\Models\Subscription;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SubscriptionController extends Controller
{
    /*
    =========================================
    PLANS
    =========================================
    */

    public function plans()
    {
        return response()->json([

            [
                'name' => 'Free',
                'price' => 0,
                'notes_limit' => 10,
                'images' => false,
                'files' => false,
            ],

            [
                'name' => 'Pro',
                'price' => 9.99,
                'notes_limit' => 'Unlimited',
                'images' => true,
                'files' => true,
            ]
        ]);
    }

    /*
    =========================================
    SUBSCRIBE
    =========================================
    */

    public function subscribe(Request $request)
    {
        $user = $request->user();

        if ($user->plan == 'pro') {
            return response()->json([
                'message' => 'Already subscribed'
            ], 422);
        }

        Stripe::setApiKey(
            env('STRIPE_SECRET')
        );

        $session = Session::create([

            'payment_method_types' => ['card'],

            'mode' => 'payment',

            'metadata' => [
                'user_id' => $user->id
            ],

            'line_items' => [[

                'price_data' => [

                    'currency' => 'usd',

                    'product_data' => [
                        'name' => 'Pro Plan'
                    ],

                    'unit_amount' => 999,
                ],

                'quantity' => 1
            ]],

            'success_url' =>
                env('FRONTEND_URL').'/payment-success',

            'cancel_url' =>
                env('FRONTEND_URL').'/payment-cancel',
        ]);

        Subscription::create([

            'user_id' => $user->id,

            'stripe_session_id' => $session->id,

            'payment_status' => 'pending',

            'amount' => 9.99,

            'currency' => 'usd',

            'plan' => 'pro',

            'starts_at' => now(),

            'ends_at' => now()->addMonth(),
        ]);

        // return response()->json([
        //     'url' => $session->url
        // ]);

        return response()->json([
    'session_id' => $session->id,
    'url' => $session->url,
]);
    }

    /*
    =========================================
    MY SUBSCRIPTION
    =========================================
    */

    public function subscription(Request $request)
    {
        $subscription = Subscription::where(
            'user_id',
            $request->user()->id
        )
        ->latest()
        ->first();

        return response()->json([
            'plan' => $request->user()->plan,
            'expires_at' => $request->user()->plan_expires_at,
            'subscription' => $subscription
        ]);
    }

    /*
    =========================================
    CANCEL
    =========================================
    */

    public function cancel(Request $request)
    {
        $user = $request->user();

        $user->update([
            'plan' => 'free',
            'plan_expires_at' => null
        ]);

        return response()->json([
            'message' => 'Subscription cancelled'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use Stripe\Webhook;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;
class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('WEBHOOK RECEIVED');

        try {

            $event = Webhook::constructEvent(

                $request->getContent(),

                $request->header('Stripe-Signature'),

                env('STRIPE_WEBHOOK_SECRET')
            );

            Log::info('EVENT TYPE: ' . $event->type);

        } catch (\Exception $e) {

            Log::error('WEBHOOK ERROR: ' . $e->getMessage());

            return response()->json([
                'message' => 'Invalid webhook'
            ], 400);
        }

        switch ($event->type) {

            case 'checkout.session.completed':

                $session = $event->data->object;

                Log::info('SESSION ID: ' . $session->id);

                Log::info('CUSTOMER ID: ' . ($session->customer ?? 'NULL'));

                $subscription = Subscription::where(
                    'stripe_session_id',
                    $session->id
                )->first();

                if (!$subscription) {

                    Log::error(
                        'SUBSCRIPTION NOT FOUND FOR SESSION: '
                        . $session->id
                    );

                    return response()->json([
                        'success' => false,
                        'message' => 'Subscription not found'
                    ]);
                }

                Log::info(
                    'SUBSCRIPTION FOUND ID: '
                    . $subscription->id
                );

                $subscription->update([

                    'payment_status' => 'paid',

                    'stripe_customer_id' =>
                        $session->customer,
                ]);

                Log::info(
                    'SUBSCRIPTION UPDATED TO PAID'
                );

                $user = User::find(
                    $subscription->user_id
                );

                if ($user) {

                    $user->update([

                        'plan' => 'pro',

                        'plan_expires_at' =>
                            now()->addMonth(),
                    ]);

                    Notification::create([
    'user_id' => $user->id,
    'title' => 'Subscription Activated',
    'message' => 'Your Pro subscription is now active',
    'type' => 'subscription',
    'is_read' => false,
]);

                    Log::info(
                        'USER UPDATED TO PRO: '
                        . $user->id
                    );
                }

            break;

            default:

                Log::info(
                    'IGNORED EVENT: '
                    . $event->type
                );
        }

        return response()->json([
            'success' => true
        ]);
    }
}
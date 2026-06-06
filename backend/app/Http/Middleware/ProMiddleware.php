<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ProMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ) {
        if (
            !$request->user()
            ->subscribed('default')
        ) {

            return response()->json([

                'success' => false,

                'message' => 'Pro subscription required'

            ], 403);
        }

        return $next($request);
    }
}
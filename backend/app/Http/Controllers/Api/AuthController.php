<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Otp;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class AuthController extends Controller
{
    /*
    =========================================
    REGISTER
    =========================================
    */

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:50',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:100|confirmed',
        ]);

        $user = User::create([
            'name' => trim($request->name),
            'email' => strtolower(trim($request->email)),
            'password' => Hash::make($request->password),
            'role' => 'user',
            'is_verified' => false,
            'plan' => 'free',
        ]);

        Otp::where('user_id', $user->id)->delete();

        $otpCode = rand(100000, 999999);

        Otp::create([
            'user_id' => $user->id,
            'code' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

       Mail::to($user->email)->send(
    new OtpMail($otpCode)
);

        return response()->json([
            'message' => 'Account created successfully. OTP sent.',
            'user_id' => $user->id,
        ], 201);
    }

    /*
    =========================================
    VERIFY OTP
    =========================================
    */

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required|digits:6',
        ]);

        $otp = Otp::where('user_id', $request->user_id)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP'
            ], 400);
        }

        $user = User::findOrFail($request->user_id);

        $user->update([
            'is_verified' => true
        ]);

        $otp->delete();

        return response()->json([
            'message' => 'Email verified successfully'
        ]);
    }

    /*
    =========================================
    RESEND OTP
    =========================================
    */

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->is_verified) {
            return response()->json([
                'message' => 'Email already verified'
            ], 422);
        }

        Otp::where('user_id', $user->id)->delete();

        $otpCode = rand(100000, 999999);

        Otp::create([
            'user_id' => $user->id,
            'code' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

       Mail::to($user->email)->send(
    new OtpMail($otpCode)
);

        return response()->json([
            'message' => 'OTP resent successfully'
        ]);
    }

    /*
    =========================================
    LOGIN
    =========================================
    */

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Please verify your email first'
            ], 403);
        }

        if ($user->is_suspended) {
            return response()->json([
                'message' => 'Your account has been suspended'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    /*
    =========================================
    LOGOUT
    =========================================
    */

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /*
    =========================================
    FORGOT PASSWORD
    =========================================
    */

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        Otp::where('user_id', $user->id)->delete();

        $otpCode = rand(100000, 999999);

        Otp::create([
            'user_id' => $user->id,
            'code' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(
    new OtpMail($otpCode)
);

        return response()->json([
            'message' => 'Reset OTP sent successfully'
        ]);
    }

    /*
    =========================================
    RESET PASSWORD
    =========================================
    */

    public function resetPassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required|digits:6',
            'password' => 'required|string|min:8|max:100|confirmed',
        ]);

        $otp = Otp::where('user_id', $request->user_id)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP'
            ], 400);
        }

        $user = User::findOrFail($request->user_id);

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        $user->tokens()->delete();

        $otp->delete();

        return response()->json([
            'message' => 'Password reset successful'
        ]);
    }

    /*
    =========================================
    PROFILE
    =========================================
    */

    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /*
    =========================================
    UPDATE PROFILE
    =========================================
    */

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'nullable|string|min:3|max:50',
        ]);

        $user->update([
            'name' => $request->name ?? $user->name,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /*
    =========================================
    CHANGE PASSWORD
    =========================================
    */

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|max:100|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check(
            $request->current_password,
            $user->password
        )) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    /*
    =========================================
    UPLOAD AVATAR
    =========================================
    */

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $path = $request->file('avatar')
            ->store('avatars', 'public');

        $request->user()->update([
            'avatar' => $path
        ]);

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar' => $path
        ]);
    }

    /*
    =========================================
    DELETE ACCOUNT
    =========================================
    */

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        $user->tokens()->delete();

        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}
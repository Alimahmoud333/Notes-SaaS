<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Livewire\User\UserNotes;

Route::get('/', function () {
    return view('auth.login');
});


Route::get('/login', [AuthController::class,'loginForm'])->name('login');;
Route::post('/login', [AuthController::class,'login']);
Route::get('/register', [AuthController::class,'registerForm'])->name('register');
Route::post('/register', [AuthController::class,'register']);
Route::post('/logout', [AuthController::class,'logout'])->name('logout');


Route::middleware(['auth'])->group(function () {

     Route::view('/my-notes', 'user.notes')->name('user.notes');

Route::prefix('admin')->group(function () {
    Route::view('/users', 'admin.users')->name('admin.users');
    });
});
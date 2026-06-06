<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GroupInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'invited_by',
        'user_id',
        'status',
    ];

    /*
    |--------------------------------------------------------------------------
    | Group
    |--------------------------------------------------------------------------
    */

    public function group()
    {
        return $this->belongsTo(
            Group::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Inviter
    |--------------------------------------------------------------------------
    */

    public function inviter()
    {
        return $this->belongsTo(
            User::class,
            'invited_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }
}
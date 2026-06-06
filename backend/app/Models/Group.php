<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Group extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'image',
        'is_private',
    ];

    protected $casts = [
        'is_private' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Owner
    |--------------------------------------------------------------------------
    */

    public function owner()
    {
        return $this->belongsTo(
            User::class,
            'owner_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Members
    |--------------------------------------------------------------------------
    */

    public function members()
    {
        return $this->belongsToMany(
            User::class,
            'group_members'
        )
        ->withPivot([
            'can_view',
            'can_edit',
            'can_delete'
        ])
        ->withTimestamps();
    }

    /*
    |--------------------------------------------------------------------------
    | Group Members
    |--------------------------------------------------------------------------
    */

    public function groupMembers()
    {
        return $this->hasMany(
            GroupMember::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Notes
    |--------------------------------------------------------------------------
    */

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Invitations
    |--------------------------------------------------------------------------
    */

    public function invitations()
    {
        return $this->hasMany(
            GroupInvitation::class
        );
    }
}
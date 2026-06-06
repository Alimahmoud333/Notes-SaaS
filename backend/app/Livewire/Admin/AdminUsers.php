<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\User;
use App\Models\Note;
use Illuminate\Support\Facades\DB;



class AdminUsers extends Component
{

    public $totalUsers;
    public $totalNotes;

    public function mount(){

        $this->updateStats();

    }

    public function updateStats(){
        $this->totalUsers=User::count();
        $this->totalNotes = Note::count();
        
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            session()->flash('error', 'Cannot delete another admin!');
            return;
        }

        DB::transaction(function () use ($user) {
            $user->notes()->delete();
            $user->delete();
        });

        session()->flash('success', 'User deleted successfully!');

        $this->updateStats(); 
    }

    public function render()
    {
        return view('livewire.admin.admin-users',[
            'users'=> User::withCount('notes')->latest()->get()
        ]);
    }


    





    
}
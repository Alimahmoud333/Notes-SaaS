<?php

namespace App\Livewire\User;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\Note;
use Illuminate\Support\Facades\Auth;

class UserNotes extends Component
{
    use WithFileUploads;

    public $title;
    public $content;
    public $image;
    public $noteId;
    public $isEdit = false;

    protected $rules = [
        'title'   => 'required|min:3',
        'content' => 'required|min:5',
        'image'   => 'nullable|image|max:2048',
    ];

    // ✅ Add Note
    public function addNote()
    {
        $this->validate();

        $imagePath = null;
        if ($this->image) {
            $imagePath = $this->image->store('notes', 'public');
        }

        Note::create([
            'user_id' => Auth::id(),
            'title'   => $this->title,
            'content' => $this->content,
            'image'   => $imagePath,
        ]);

        $this->resetForm();
    }

    // ✏️ Edit Note
    public function editNote($id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $this->noteId  = $note->id;
        $this->title   = $note->title;
        $this->content = $note->content;
        $this->isEdit  = true;
    }

    // 🔄 Update Note
    public function updateNote()
    {
        $this->validate();

        $note = Note::where('id', $this->noteId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($this->image) {
            $note->image = $this->image->store('notes', 'public');
        }

        $note->update([
            'title'   => $this->title,
            'content' => $this->content,
            'image'   => $note->image,
        ]);

        $this->resetForm();
    }

    // 🗑 Delete Note
    public function deleteNote($id)
    {
        Note::where('id', $id)
            ->where('user_id', Auth::id())
            ->delete();
    }

    public function resetForm()
    {
        $this->reset(['title','content','image','noteId','isEdit']);
    }

    public function render()
    {
    return view('livewire.user.user-notes', [
        'notes' => auth()->user()->notes()->latest()->get(),
    ]);
    }
}
<div> 

    <div class="container mt-4">

     
        <div class="card shadow mb-4">
            <div class="card-header bg-dark text-white">
                <h4 class="mb-0">{{ $isEdit ? 'Edit Note' : 'Add Note' }}</h4>
            </div>

            <div class="card-body">
                <form wire:submit.prevent="{{ $isEdit ? 'updateNote' : 'addNote' }}">
                    <div class="mb-3">
                        <input type="text" wire:model.defer="title" class="form-control" placeholder="Note title">
                        @error('title') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="mb-3">
                        <textarea wire:model.defer="content" class="form-control" placeholder="Note content"></textarea>
                        @error('content') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="mb-3">
                        <input type="file" wire:model="image" class="form-control">
                        @error('image') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="d-flex flex-column flex-sm-row gap-2">
                        <button class="btn btn-{{ $isEdit ? 'dark' : 'secondary' }}">
                            {{ $isEdit ? 'Update' : 'Save' }}
                        </button>

                        @if($isEdit)
                            <button type="button" wire:click="resetForm" class="btn btn-secondary">
                                Cancel
                            </button>
                        @endif
                    </div>
                </form>
            </div>
        </div>

        {{-- Notes Grid --}}
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            @forelse($notes as $note)
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        @if($note->image)
                            <div class="overflow-hidden" style="height:220px;">
                                <img src="{{ asset('storage/'.$note->image) }}" 
                                     class="card-img-top img-hover-scale" 
                                     style="height:100%; width:100%; object-fit:cover; transition: transform 0.3s;">
                            </div>
                        @endif

                        <div class="card-body">
                            <h5 class="card-title">{{ $note->title }}</h5>
                            <p class="card-text text-truncate" style="max-height: 80px; overflow:hidden;">
                                {{ $note->content }}
                            </p>
                        </div>

                        <div class="card-footer d-flex justify-content-between flex-wrap gap-2">
                            <button wire:click="editNote({{ $note->id }})" class="btn btn-sm btn-warning w-100 w-sm-auto">Edit</button>
                            <button wire:click="deleteNote({{ $note->id }})" 
                                    class="btn btn-sm btn-danger w-100 w-sm-auto"
                                    onclick="return confirm('Are you sure you want to delete this note?')">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-12 text-center py-5">
                    <p class="text-muted fs-5">No notes yet. Add your first note!</p>
                </div>
            @endforelse
        </div>

    </div>
</div>


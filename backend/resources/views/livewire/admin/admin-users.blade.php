<div>

    
    <div class="row mb-4 g-3">
        <div class="col-12 col-sm-6">
            <div class="card shadow text-center">
                <div class="card-body">
                    <h5>Total Users</h5>
                    <h2 class="text-dark">{{ $totalUsers }}</h2>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6">
            <div class="card shadow text-center">
                <div class="card-body">
                    <h5>Total Notes</h5>
                    <h2 class="text-secondary">{{ $totalNotes }}</h2>
                </div>
            </div>
        </div>
    </div>

    {{-- Alerts --}}
    @if (session()->has('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if (session()->has('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    {{-- Users Table --}}
    <div class="card shadow">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Users Management</h4>
        </div>

        <div class="card-body table-responsive">
            <table class="table table-bordered align-middle mb-0">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Notes Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($users as $user)
                        <tr>
                            <td>
                                @if($user->image)
                                    <img src="{{ asset('storage/'.$user->image) }}"
                                         width="40" height="40"
                                         class="rounded-circle">
                                @else
                                    <span class="text-muted">No Image</span>
                                @endif
                            </td>

                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>

                            <td>
                                <span class="badge bg-{{ $user->role === 'admin' ? 'dark' : 'secondary' }}">
                                    {{ ucfirst($user->role) }}
                                </span>
                            </td>

                            <td>
                                <span class="badge bg-primary">
                                    {{ $user->notes_count }}
                                </span>
                            </td>

                            <td class="d-flex flex-column flex-sm-row gap-2">
                                @if(!$user->isAdmin())
                                    <button wire:click="deleteUser({{ $user->id }})"
                                            class="btn btn-dark btn-sm w-100 w-sm-auto"
                                            onclick="return confirm('Are you sure you want to delete this user?')">
                                        Delete
                                    </button>
                                @else
                                    <span class="text-muted">Admin</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

</div>

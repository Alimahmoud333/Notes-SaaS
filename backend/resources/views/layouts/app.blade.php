<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Notes App')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    @livewireStyles
</head>
<body>

<nav class="navbar navbar-dark bg-dark px-3">
    <a class="navbar-brand" href="#">Notes App</a>

    @auth
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button class="btn btn-danger btn-sm">Logout</button>
        </form>
    @endauth
</nav>

<div class="container mt-4">
    @yield('content')
</div>

@livewireScripts
</body>
</html>

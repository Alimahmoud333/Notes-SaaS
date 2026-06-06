<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Notes App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: #f0f2f5;
        }
        .card {
            border-radius: 12px;
        }
        .card-header {
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }
    </style>
</head>
<body>

<div class="d-flex justify-content-center align-items-center vh-100">
    <div class="col-md-5">

        <div class="card shadow">
            <div class="card-header bg-dark text-white text-center">
                <h4 class="mb-0">Register</h4>
            </div>

            <div class="card-body">
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('register') }}" enctype="multipart/form-data">
                    @csrf

                    <input type="text" class="form-control mb-3" name="name" placeholder="Name" value="{{ old('name') }}">
                    <input type="email" class="form-control mb-3" name="email" placeholder="Email" value="{{ old('email') }}">
                    <input type="password" class="form-control mb-3" name="password" placeholder="Password">
                    <input type="password" class="form-control mb-3" name="password_confirmation" placeholder="Confirm Password">
                    <input type="file" class="form-control mb-3" name="image">

                    <button class="btn btn-dark w-100">Register</button>
                </form>

                <div class="text-center mt-3">
                    <a href="{{ route('login') }}">Already have an account? Login</a>
                </div>
            </div>
        </div>

    </div>
</div>

</body>
</html>

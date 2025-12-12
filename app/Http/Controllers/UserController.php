<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => QueryBuilder::for(
                User::query()
                    ->select(['id', 'name', 'email', 'email_verified_at', 'created_at'])
                    ->withCount(['posts', 'comments']),
            )
                ->allowedSorts([
                    'id',
                    'name',
                    'email',
                    'email_verified_at',
                    'created_at',
                    'posts_count',
                    'comments_count',
                ])
                ->allowedFilters([
                    AllowedFilter::exact('id'),
                    AllowedFilter::partial('name'),
                    AllowedFilter::partial('email'),
                    AllowedFilter::callback('email_verified_at', function (Builder $query, mixed $value): void {
                        if ($value === 'verified') {
                            $query->whereNotNull('email_verified_at');

                            return;
                        }

                        if ($value === 'unverified') {
                            $query->whereNull('email_verified_at');

                            return;
                        }

                        if ($value) {
                            $query->whereDate('email_verified_at', $value);
                        }
                    }),
                    AllowedFilter::callback('created_at', function (Builder $query, mixed $value): void {
                        if ($value) {
                            $query->whereDate('created_at', $value);
                        }
                    }),
                    AllowedFilter::callback('posts_count', function (Builder $query, mixed $value): void {
                        if ($value !== null && $value !== '') {
                            $query->has('posts', '=', (int) $value);
                        }
                    }),
                    AllowedFilter::callback('comments_count', function (Builder $query, mixed $value): void {
                        if ($value !== null && $value !== '') {
                            $query->has('comments', '=', (int) $value);
                        }
                    }),
                ])
                ->defaultSort('id')
                ->paginate(10)
                ->withQueryString()
                ->through(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at?->toISOString(),
                    'created_at' => $user->created_at->toISOString(),
                    'posts_count' => $user->posts_count,
                    'comments_count' => $user->comments_count,
                ]),
            'sort' => request('sort', 'id'),
            'filters' => request('filter', []),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'created_at' => $user->created_at->toISOString(),
                'updated_at' => $user->updated_at->toISOString(),
            ],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

        return redirect()
            ->route('users')
            ->with('success', 'User updated.');
    }

    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'password' => Hash::make(Str::random(32)),
        ]);

        return redirect()
            ->route('users')
            ->with('success', 'User created.');
    }
}

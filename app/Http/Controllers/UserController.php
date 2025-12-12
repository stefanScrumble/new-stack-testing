<?php

namespace App\Http\Controllers;

use App\Data\UserData;
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
        $users = QueryBuilder::for(
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
                AllowedFilter::scope('email_verified_at', 'email_verified_filter'),
                AllowedFilter::exact('created_on'),
                AllowedFilter::scope('posts_count', 'posts_count_equals'),
                AllowedFilter::scope('comments_count', 'comments_count_equals'),
            ])
            ->defaultSort('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => UserData::collect($users),
            'sort' => request('sort', 'id'),
            'filters' => request('filter', []),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => UserData::from($user),
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

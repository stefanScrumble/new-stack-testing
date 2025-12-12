<?php

namespace App\Data;

use App\Models\User;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $email_verified_at,
        public ?string $created_at,
        public ?string $updated_at,
        public ?int $posts_count,
        public ?int $comments_count,
    ) {
    }

    public static function fromModel(User $user): self
    {
        return new self(
            $user->id,
            $user->name,
            $user->email,
            $user->email_verified_at?->toISOString(),
            $user->created_at?->toISOString(),
            $user->updated_at?->toISOString(),
            $user->posts_count,
            $user->comments_count,
        );
    }
}

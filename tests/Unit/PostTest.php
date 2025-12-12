<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $this->assertTrue($post->user->is($user));
    }

    public function test_post_has_comments(): void
    {
        $post = Post::factory()->create();
        Comment::factory()->count(2)->for($post)->create();
        $post->refresh();

        $this->assertCount(2, $post->comments);
    }

    public function test_deleting_post_removes_comments(): void
    {
        $post = Post::factory()->create();
        $comments = Comment::factory()->count(2)->for($post)->create();

        $post->delete();

        $this->assertSame(0, Comment::whereIn('id', $comments->pluck('id'))->count());
    }
}

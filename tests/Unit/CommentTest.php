<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_comment_belongs_to_post_and_user(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();
        $comment = Comment::factory()->for($post)->for($user)->create();

        $this->assertTrue($comment->user->is($user));
        $this->assertTrue($comment->post->is($post));
    }

    public function test_comment_stores_body_text(): void
    {
        $body = fake()->sentence();
        $comment = Comment::factory()->create(['body' => $body]);

        $this->assertSame($body, $comment->body);
    }
}

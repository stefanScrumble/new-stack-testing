import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';

export default function CreateUserPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: usersRoute().url },
        { title: 'Create user', href: '/users/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create user" />
            <div className="flex flex-1 flex-col items-start gap-8 px-4 pb-8 md:px-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-foreground">
                        Create user
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Add a new user to the workspace.
                    </p>
                </div>

                <Form
                    method="post"
                    action={usersRoute().url}
                    className="w-full max-w-3xl space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        autoComplete="name"
                                        required
                                        name="name"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        name="email"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[120px]"
                                >
                                    {processing ? 'Creating...' : 'Create user'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={usersRoute().url}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}

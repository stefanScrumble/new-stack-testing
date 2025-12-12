import { update } from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { FieldGroup } from '@/components/ui/field';
import AppLayout from '@/layouts/app-layout';
import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

type EditUser = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export default function EditUserPage({ user }: { user: EditUser }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: usersRoute().url },
        { title: user.name, href: `/users/${user.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            <div className="flex flex-1 flex-col items-start gap-8 px-4 pb-8 md:px-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-foreground">
                        Edit user
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update profile details for {user.email}.
                    </p>
                </div>

                <Form
                    method="put"
                    action={update(user.id)}
                    className="w-full max-w-3xl space-y-6"
                >
                    {({ processing, errors, recentlySuccessful, submit }) => (
                        <>
                            <FieldGroup className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    label="Name"
                                    name="name"
                                    autoComplete="name"
                                    defaultValue={user.name}
                                    required
                                    error={errors.name}
                                    onBlur={() => submit()}
                                />
                                <FormField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    defaultValue={user.email}
                                    required
                                    error={errors.email}
                                    onBlur={() => submit()}
                                />
                            </FieldGroup>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[120px]"
                                >
                                    {processing ? 'Saving...' : 'Save changes'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={usersRoute().url}>Cancel</Link>
                                </Button>
                                {recentlySuccessful && (
                                    <span className="text-sm text-green-600">
                                        Saved
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}

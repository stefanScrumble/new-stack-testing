import { users as usersRoute } from '@/routes';
import { store } from '@/actions/App/Http/Controllers/UserController';

import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { FieldGroup } from '@/components/ui/field';

export default function CreateUserPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: usersRoute().url },
        { title: 'Create user', href: '/users/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create user" />
            <Form
                method="post"
                action={store()}
                className="w-full max-w-3xl space-y-6"
            >
                {({ errors, processing }) => (
                    <>
                        <FieldGroup className="grid gap-6 md:grid-cols-2">
                            <FormField
                                label="Name"
                                name="name"
                                autoComplete="name"
                                required
                                error={errors.name}
                            />
                            <FormField
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                error={errors.email}
                            />
                        </FieldGroup>
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
        </AppLayout>
    );
}

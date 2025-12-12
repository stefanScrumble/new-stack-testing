import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { FieldGroup } from '@/components/ui/field';
import AppLayout from '@/layouts/app-layout';
import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, router } from '@inertiajs/react';
import type { FocusEventHandler } from 'react';

export default function EditUserPage({ user }: { user: App.Data.UserData }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: usersRoute().url },
        { title: `Edit ${user.name}`, href: `/users/${user.id}/edit` },
    ];
    const validateField = (
        method: 'post' | 'put',
        action: string,
    ): FocusEventHandler<HTMLInputElement> => (event) => {
        const form = event.currentTarget.form;

        if (!form) {
            return;
        }

        const formData = new FormData(form);

        router.visit(action, {
            method,
            data: Object.fromEntries(formData.entries()),
            headers: { Precognition: 'true' },
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ['errors'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            <Form
                method="put"
                action={`/users/${user.id}`}
                className="w-full max-w-3xl space-y-6"
            >
                    {({ processing, errors, recentlySuccessful }) => (
                    <>
                        <FieldGroup className="grid gap-6 md:grid-cols-2">
                            <FormField
                                label="Name"
                                name="name"
                                autoComplete="name"
                                    defaultValue={user.name}
                                    required
                                    error={errors.name}
                                    onBlur={validateField('put', `/users/${user.id}`)}
                                />
                                <FormField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    defaultValue={user.email}
                                    required
                                    error={errors.email}
                                    onBlur={validateField('put', `/users/${user.id}`)}
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
        </AppLayout>
    );
}

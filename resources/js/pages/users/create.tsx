import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { FieldGroup } from '@/components/ui/field';
import type { FocusEventHandler } from 'react';
import {store} from '@/actions/App/Http/Controllers/UserController';

export default function CreateUserPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: usersRoute().url },
        { title: 'Create user', href: '/users/create' },
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
            <Head title="Create user" />
            <Form
                {...store.form()}
                className="w-full max-w-3xl space-y-6 p-4"
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
                                onBlur={validateField('post', '/users')}
                            />
                            <FormField
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                error={errors.email}
                                onBlur={validateField('post', '/users')}
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

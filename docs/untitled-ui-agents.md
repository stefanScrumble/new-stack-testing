# Untitled UI React

Untitled UI React is a comprehensive open-source React component library built with Tailwind CSS v4.1, React 19.1, TypeScript 5.8, and React Aria Components. It provides production-ready, accessible UI components designed for modern web applications with full type safety and responsive design. The library follows a copy-paste philosophy, allowing developers to directly integrate components into their projects without npm dependencies.

The component system is organized into three main categories: base components (buttons, inputs, badges, avatars, dropdowns), application components (tables, tabs, modals, date pickers, charts), and foundation elements (typography, colors, spacing). All components are built on React Aria for accessibility and support dark mode via next-themes, with styling powered by Tailwind CSS utility classes and custom CSS variables defined in a semantic token system.

## Button Component

Interactive button component with multiple variants (primary, secondary, tertiary, destructive), sizes (sm, md, lg, xl), loading states, and icon support. Built on React Aria Button for accessibility.

```tsx
import { Button } from "@/components/base/buttons/button";
import { Plus } from "@untitledui/icons";

// Primary button with icon
<Button
  color="primary"
  size="md"
  iconLeading={Plus}
  onClick={() => console.log("clicked")}
>
  Create Project
</Button>

// Loading state button
<Button
  color="secondary"
  size="lg"
  isLoading={true}
  showTextWhileLoading={true}
>
  Saving...
</Button>

// Destructive button
<Button
  color="primary-destructive"
  size="sm"
  iconTrailing={Trash}
  isDisabled={false}
>
  Delete Account
</Button>

// Link-style button
<Button
  color="link-color"
  size="md"
  href="/docs"
>
  View Documentation
</Button>

// Icon-only button
<Button color="tertiary" size="sm" iconLeading={Plus} />
```

## Input Component

Text input field with label, hint text, validation states, tooltips, leading icons, and keyboard shortcuts. Supports controlled and uncontrolled modes.

```tsx
import { Input } from "@/components/base/input/input";
import { Mail } from "@untitledui/icons";

// Basic input with validation
<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
  hint="We'll never share your email"
  isRequired={true}
  onChange={(e) => console.log(e.target.value)}
/>

// Input with icon and tooltip
<Input
  label="API Key"
  icon={Mail}
  tooltip="Your secret API key for authentication"
  size="md"
  isInvalid={false}
  defaultValue="sk_test_123"
/>

// Input with keyboard shortcut
<Input
  placeholder="Search..."
  shortcut="⌘K"
  size="sm"
  icon={SearchIcon}
/>

// Disabled input
<Input
  label="Username"
  value="johndoe"
  isDisabled={true}
  hint="Username cannot be changed"
/>
```

## Badge Component

Small status or category indicators with multiple variants (pill, badge, modern), colors (gray, brand, error, success), and optional icons, dots, flags, or dismiss buttons.

```tsx
import { Badge, BadgeWithDot, BadgeWithIcon, BadgeWithButton } from "@/components/base/badges/badges";
import { CheckCircle } from "@untitledui/icons";

// Basic badge
<Badge type="pill-color" color="brand" size="md">
  Active
</Badge>

// Badge with dot indicator
<BadgeWithDot type="badge-color" color="success" size="sm">
  Online
</BadgeWithDot>

// Badge with icon
<BadgeWithIcon
  type="pill-color"
  color="error"
  size="lg"
  iconLeading={CheckCircle}
>
  Verified
</BadgeWithIcon>

// Badge with dismiss button
<BadgeWithButton
  type="badge-modern"
  color="gray"
  size="md"
  buttonLabel="Remove tag"
  onButtonClick={() => console.log("dismissed")}
>
  TypeScript
</BadgeWithButton>

// Multiple badges
<div className="flex gap-2">
  <Badge color="blue" size="sm">Frontend</Badge>
  <Badge color="purple" size="sm">Backend</Badge>
  <Badge color="orange" size="sm">DevOps</Badge>
</div>
```

## Avatar Component

User profile image component with fallback initials, placeholder icons, online status indicators, badges, and verified checkmarks. Supports multiple sizes and contrast borders.

```tsx
import { Avatar } from "@/components/base/avatar/avatar";
import { User01 } from "@untitledui/icons";

// Avatar with image
<Avatar
  src="https://example.com/avatar.jpg"
  alt="John Doe"
  size="md"
  contrastBorder={true}
/>

// Avatar with initials fallback
<Avatar
  src={null}
  initials="JD"
  size="lg"
  contrastBorder={true}
/>

// Avatar with online status
<Avatar
  src="https://example.com/avatar.jpg"
  status="online"
  size="xl"
  alt="Jane Smith"
/>

// Avatar with verified badge
<Avatar
  src="https://example.com/avatar.jpg"
  verified={true}
  size="md"
  alt="Verified User"
/>

// Avatar with custom placeholder icon
<Avatar
  placeholderIcon={User01}
  size="sm"
  contrastBorder={false}
/>

// Avatar group
<div className="flex -space-x-2">
  <Avatar src="/user1.jpg" size="md" />
  <Avatar src="/user2.jpg" size="md" />
  <Avatar initials="AB" size="md" />
</div>
```

## Dropdown Component

Context menu and dropdown component with sections, separators, icons, keyboard navigation, and addons. Built on React Aria Menu for full accessibility.

```tsx
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Edit, Copy, Trash, Settings } from "@untitledui/icons";

// Dropdown with dots button trigger
<Dropdown.Root>
  <Dropdown.DotsButton />
  <Dropdown.Popover>
    <Dropdown.Menu>
      <Dropdown.Item icon={Edit} label="Edit" />
      <Dropdown.Item icon={Copy} label="Duplicate" />
      <Dropdown.Separator />
      <Dropdown.Item icon={Trash} label="Delete" />
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown.Root>

// Dropdown with sections and addons
<Dropdown.Root>
  <Button color="secondary">Options</Button>
  <Dropdown.Popover placement="bottom left">
    <Dropdown.Menu
      selectionMode="single"
      onSelectionChange={(keys) => console.log(keys)}
    >
      <Dropdown.Section>
        <Dropdown.SectionHeader>Account</Dropdown.SectionHeader>
        <Dropdown.Item icon={Settings} addon="⌘S">
          Settings
        </Dropdown.Item>
        <Dropdown.Item icon={User} addon="⌘P">
          Profile
        </Dropdown.Item>
      </Dropdown.Section>
      <Dropdown.Separator />
      <Dropdown.Item icon={Logout} label="Sign out" />
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown.Root>

// Disabled dropdown item
<Dropdown.Item
  icon={Archive}
  label="Archive"
  isDisabled={true}
/>
```

## Modal Component

Dialog overlay component for modals, alerts, and popups with backdrop blur, animations, and accessible focus management. Supports responsive sizing and custom content.

```tsx
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";

// Basic modal
<DialogTrigger>
  <Button>Open Modal</Button>
  <ModalOverlay>
    <Modal className="max-w-lg">
      <Dialog>
        <div className="p-6">
          <h2 className="text-lg font-semibold">Delete Account</h2>
          <p className="mt-2 text-sm text-tertiary">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="mt-6 flex gap-3 justify-end">
            <Button color="secondary">Cancel</Button>
            <Button color="primary-destructive">Delete</Button>
          </div>
        </div>
      </Dialog>
    </Modal>
  </ModalOverlay>
</DialogTrigger>

// Controlled modal with form
function FormModal() {
  const [isOpen, setOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <Button>Create User</Button>
      <ModalOverlay>
        <Modal className="max-w-md">
          <Dialog>
            <form onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}>
              <div className="p-6 space-y-4">
                <Input label="Name" isRequired />
                <Input label="Email" type="email" isRequired />
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
```

## Table Component

Data table with sortable columns, row selection, pagination, and responsive design. Includes table card wrapper with header, badges, and action buttons.

```tsx
import { Table, TableCard } from "@/components/application/table/table";

// Table with selection
<Table
  selectionMode="multiple"
  selectionBehavior="toggle"
  size="md"
>
  <Table.Header>
    <Table.Head label="Name" isRowHeader />
    <Table.Head label="Email" />
    <Table.Head label="Status" />
    <Table.Head label="Role" />
  </Table.Header>
  <Table.Body>
    {users.map((user) => (
      <Table.Row key={user.id}>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          <Badge color={user.status === 'active' ? 'success' : 'gray'}>
            {user.status}
          </Badge>
        </Table.Cell>
        <Table.Cell>{user.role}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>

// Sortable table
<Table onSortChange={(sort) => console.log(sort)}>
  <Table.Header>
    <Table.Head label="Project" allowsSorting />
    <Table.Head label="Created" allowsSorting />
    <Table.Head label="Status" />
  </Table.Header>
  <Table.Body items={projects}>
    {(item) => (
      <Table.Row>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.created}</Table.Cell>
        <Table.Cell>{item.status}</Table.Cell>
      </Table.Row>
    )}
  </Table.Body>
</Table>

// Table with card wrapper
<TableCard.Root size="md">
  <TableCard.Header
    title="Team Members"
    badge="24"
    description="Manage your team members and their roles"
    contentTrailing={<Button size="sm">Add Member</Button>}
  />
  <Table size="md">
    {/* Table content */}
  </Table>
</TableCard.Root>
```

## Tabs Component

Tabbed navigation component with multiple styles (button-brand, button-gray, underline, line), horizontal/vertical orientation, and badges. Supports keyboard navigation.

```tsx
import { Tabs } from "@/components/application/tabs/tabs";

// Horizontal tabs with badges
<Tabs defaultSelectedKey="overview">
  <Tabs.List
    type="button-brand"
    size="md"
    items={[
      { id: 'overview', label: 'Overview', badge: 12 },
      { id: 'analytics', label: 'Analytics', badge: 3 },
      { id: 'settings', label: 'Settings' }
    ]}
  >
    {(item) => <Tabs.Item key={item.id} badge={item.badge}>{item.label}</Tabs.Item>}
  </Tabs.List>

  <Tabs.Panel id="overview">
    <div className="py-4">Overview content</div>
  </Tabs.Panel>
  <Tabs.Panel id="analytics">
    <div className="py-4">Analytics content</div>
  </Tabs.Panel>
  <Tabs.Panel id="settings">
    <div className="py-4">Settings content</div>
  </Tabs.Panel>
</Tabs>

// Underline style tabs
<Tabs>
  <Tabs.List type="underline" size="md" fullWidth={true}>
    <Tabs.Item id="posts">Posts</Tabs.Item>
    <Tabs.Item id="comments">Comments</Tabs.Item>
    <Tabs.Item id="likes">Likes</Tabs.Item>
  </Tabs.List>
  <Tabs.Panel id="posts">{/* Content */}</Tabs.Panel>
</Tabs>

// Vertical tabs
<Tabs orientation="vertical">
  <Tabs.List type="line" size="md" orientation="vertical">
    <Tabs.Item id="general">General</Tabs.Item>
    <Tabs.Item id="security">Security</Tabs.Item>
    <Tabs.Item id="notifications">Notifications</Tabs.Item>
  </Tabs.List>
  <Tabs.Panel id="general">{/* Content */}</Tabs.Panel>
</Tabs>
```

## Form with React Hook Form

Form integration with react-hook-form for validation, error handling, and form state management. Provides FormField wrapper for controlled inputs.

```tsx
import { HookForm, FormField } from "@/components/base/form/hook-form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";

// Form with validation
function SignupForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <HookForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          }}
        >
          {({ field, fieldState }) => (
            <Input
              {...field}
              label="Email"
              type="email"
              isRequired
              isInvalid={!!fieldState.error}
              hint={fieldState.error?.message}
            />
          )}
        </FormField>

        <FormField
          name="password"
          control={form.control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            }
          }}
        >
          {({ field, fieldState }) => (
            <Input
              {...field}
              label="Password"
              type="password"
              isRequired
              isInvalid={!!fieldState.error}
              hint={fieldState.error?.message}
            />
          )}
        </FormField>

        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Create Account
        </Button>
      </div>
    </HookForm>
  );
}
```

## Summary

Untitled UI React provides a complete design system for building modern web applications with over 100+ accessible, production-ready components. The library excels in common use cases including admin dashboards, SaaS applications, e-commerce platforms, content management systems, and marketing websites. Each component is fully typed with TypeScript, supports dark mode out of the box, and follows WCAG accessibility guidelines through React Aria integration.

The copy-paste architecture allows developers to customize components at the source level without framework lock-in or version conflicts. Integration is straightforward—copy component files into your project, ensure Tailwind CSS v4+ and React 19+ are configured, and import components directly. The semantic token system (defined in theme.css) enables consistent theming across all components, while the modular structure allows selective adoption of only needed components. For advanced implementations, combine components with libraries like react-hook-form for forms, recharts for data visualization, and sonner for notifications to build complete application interfaces rapidly.

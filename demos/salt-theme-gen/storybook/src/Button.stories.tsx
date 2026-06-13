import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component using salt-theme-gen CSS custom properties. Toggle the Theme toolbar to switch between light and dark modes.',
      },
    },
  },
  argTypes: {
    intent:   { control: 'select', options: ['primary', 'secondary', 'danger', 'success'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    onClick:  { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { label: 'Primary button', intent: 'primary', size: 'md' },
};

export const Danger: Story = {
  args: { label: 'Delete item', intent: 'danger', size: 'md' },
};

export const Success: Story = {
  args: { label: 'Save changes', intent: 'success', size: 'md' },
};

export const Small: Story = {
  args: { label: 'Small', intent: 'primary', size: 'sm' },
};

export const Large: Story = {
  args: { label: 'Large', intent: 'primary', size: 'lg' },
};

export const Disabled: Story = {
  args: { label: 'Disabled', intent: 'primary', size: 'md', disabled: true },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button label="Primary"   intent="primary"   />
      <Button label="Secondary" intent="secondary" />
      <Button label="Danger"    intent="danger"    />
      <Button label="Success"   intent="success"   />
    </div>
  ),
};

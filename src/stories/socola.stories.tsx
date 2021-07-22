import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import 'tailwindcss/tailwind.css';
import { Socola } from '../socola';

export default {
  title: 'Example/Socola',
  component: Socola,
} as ComponentMeta<typeof Socola>;

const Template: ComponentStory<typeof Socola> = (args) => (
  <div className="w-2/3 mx-auto mt-10">
    <Socola {...args} />
  </div>
);

export const SocolaComponent = Template.bind({});
SocolaComponent.args = {
  primary: true,
  label: 'Socola',
};

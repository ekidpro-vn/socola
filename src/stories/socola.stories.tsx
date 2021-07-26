import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import 'tailwindcss/tailwind.css';
import Socola from '../App';

export default {
  title: 'Socola',
  component: Socola,
} as ComponentMeta<typeof Socola>;

const Template: ComponentStory<typeof Socola> = (args) => (
  <div className="w-2/3 mx-auto my-10">
    <Socola {...args} />
  </div>
);

export const DefaultSocola = Template.bind({});
DefaultSocola.args = {
  moduleId: 'feedback',
  recordId: '15803',
  showDate: true,
  showStatus: true,
  socolaToken: 'f748a60cb3980c4009302959d72d7a4f',
  // socolaToken: '',
  // userRole: 'ADMIN',
};

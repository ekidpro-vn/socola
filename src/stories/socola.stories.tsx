import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import 'tailwindcss/tailwind.css';
import Socola from '../App';

export default {
  title: 'Socola',
  component: Socola,
} as ComponentMeta<typeof Socola>;

const Template: ComponentStory<typeof Socola> = (args) => (
  <div className="w-full lg:w-3/5 mx-auto my-10">
    <Socola {...args} />
  </div>
);

export const DefaultSocola = Template.bind({});
DefaultSocola.args = {
  moduleId: 'feedback',
  socolaToken: 'f748a60cb3980c4009302959d72d7a4f',
  recordId: '15784',
  // recordId: '15803',
  showDate: true,
  showStatus: true,
  // readOnly: true,
  // socolaToken: '',
  userInfo: {
    id: 16820,
    role: 'ADMIN',
  },
  // renderType: 'minimum',
};

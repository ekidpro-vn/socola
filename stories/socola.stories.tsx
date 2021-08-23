import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import 'tailwindcss/tailwind.css';
import { Socola } from '../src';

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
  token: 'f748a60cb3980c4009302959d72d7a4f',
  // channelId: '',
  cId: 'ekidpro',
  secretKey: 'rtSsf3VeJ8r2cnHgadx5ObYY50Ael8VG',
  recordId: '15803',
  showDate: true,
  showStatus: true,
  userInfo: {
    id: 16820,
    type: 'ADMIN',
  },
};

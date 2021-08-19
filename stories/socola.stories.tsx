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
  token: '',
  // channelId: '',
  cId: 'ekidpro',
  secretKey: '',
  recordId: '15803',
  showDate: true,
  showStatus: true,
  userInfo: {
    id: 16820,
    type: 'ADMIN',
  },
};

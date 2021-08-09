import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Socola } from '../App';
import '../styles/tailwind.css';

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
  secretKey: 'rtSsf3VeJ8r2cnHgadx5ObYY50Ael8VG',
  // recordId: '15784',
  recordId: '15803',
  showDate: true,
  showStatus: true,
  // readOnly: true,
  // socolaToken: '',
  userInfo: {
    id: 16820,
    type: 'ADMIN',
  },
  // renderType: 'minimum',
};

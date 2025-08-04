import React from 'react';
import { useDnD } from './DnDContext';

import Input from '../Components/Input';
import Gates from '../Components/Gates';
import Output from '../Components/Output';
export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
<aside className="w-[220px] h-screen overflow-y-auto scrollbar-hide">
  <Input />
  <Gates />
  <Output />
</aside>

  );
};

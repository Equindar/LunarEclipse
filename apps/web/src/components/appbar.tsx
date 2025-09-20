import { useState } from 'react';

const AppBar = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{count}</h1>;
      <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
    </>
  );
};

export default AppBar;

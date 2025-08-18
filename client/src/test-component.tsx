import React from 'react';

// Simple test component to verify React hooks are working
export function TestComponent() {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    console.log('TestComponent mounted, React hooks working');
    if (ref.current) {
      ref.current.style.backgroundColor = count % 2 === 0 ? '#f0f0f0' : '#e0e0e0';
    }
  }, [count]);
  
  return (
    <div ref={ref} style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>React Hook Test</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
      <p style={{ fontSize: '12px', color: '#666' }}>
        If you can see this and the button works, React hooks are functioning properly.
      </p>
    </div>
  );
}
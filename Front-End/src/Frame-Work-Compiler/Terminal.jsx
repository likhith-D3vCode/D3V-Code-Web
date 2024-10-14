import { Terminal as XTerminal } from '@xterm/xterm';
import { useEffect, useRef, useState } from 'react';
import '@xterm/xterm/css/xterm.css';
import socket from '../socket';

const TerminalComponent = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);
  const [isTerminalVisible, setTerminalVisible] = useState(false); // Terminal visibility state
  const [term, setTerm] = useState(null); // Store the terminal instance

  useEffect(() => {
    if (isRendered.current || !isTerminalVisible) return;

    const newTerm = new XTerminal({
      rows: 20,
    });

    if (terminalRef.current) {
      newTerm.open(terminalRef.current); // Attach terminal to the div
    } else {
      console.error("terminalRef is not attached to a DOM element");
    }

    newTerm.onData((data) => {
      socket.emit('terminal:write', data);
    });

    socket.on('terminal:data', (data) => {
      newTerm.write(data);
    });

    setTerm(newTerm); // Store the terminal instance
    isRendered.current = true;

    return () => {
      // Clean up when the component unmounts or the terminal is hidden
      socket.off('terminal:data');
      if (newTerm) newTerm.dispose(); // Dispose of the terminal
      isRendered.current = false;
    };
  }, [isTerminalVisible]); // Re-run the effect if terminal visibility changes

  // Toggle terminal visibility
  const toggleTerminal = () => {
    setTerminalVisible((prev) => !prev);
  };

  return (
    <div>
      <button onClick={toggleTerminal}>
        {isTerminalVisible ? 'Close Terminal' : 'Open Terminal'}
      </button>
      {isTerminalVisible && (
        <div id="terminal" ref={terminalRef} style={{ marginTop: '10px', height: '400px' }} />
      )}
    </div>
  );
};

export default TerminalComponent;
